import { createServer } from "node:http";

const port = Number(process.env.PORT || 8081);
const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "samantha-gumption";
const vertexLocation = process.env.VERTEX_LOCATION || "us-west1";

const providers = {
  claude: {
    label: "Claude",
    env: "ANTHROPIC_API_KEY",
    configured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  },
  chatgpt: {
    label: "ChatGPT",
    env: "OPENAI_API_KEY",
    configured: () => Boolean(process.env.OPENAI_API_KEY),
  },
  grok: {
    label: "SuperGrok",
    env: "XAI_API_KEY",
    configured: () => Boolean(process.env.XAI_API_KEY),
  },
  gemini: {
    label: "Gemini",
    env: "Vertex AI service account",
    configured: () => Boolean(projectId),
  },
  copilot: {
    label: "Copilot",
    env: "manual",
    configured: () => true,
  },
};

function writeJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": process.env.CORS_ORIGIN || "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
  });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function fallbackReply(provider, prompt) {
  if (provider === "copilot") {
    return "Copilot is manual handoff only. Prompt copied into the command stream for IDE follow-up.";
  }

  const config = providers[provider];
  return `${config.label} proxy received the prompt, but ${config.env} is not configured yet. Add it in Secret Manager and redeploy gumption-api. Prompt: ${prompt.slice(0, 160)}`;
}

async function openAiCompatible({ apiKey, url, model, prompt }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || `Provider returned ${response.status}`);
  }
  return payload.choices?.[0]?.message?.content || "Provider returned an empty response.";
}

async function anthropic(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
      max_tokens: 900,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || `Anthropic returned ${response.status}`);
  }
  return payload.content?.map((item) => item.text).filter(Boolean).join("\n") || "Claude returned an empty response.";
}

async function metadataAccessToken() {
  const response = await fetch(
    "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
    { headers: { "metadata-flavor": "Google" } },
  );
  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    throw new Error("Unable to obtain Cloud Run service account token for Vertex AI.");
  }
  return payload.access_token;
}

async function vertexGemini(prompt) {
  const token = await metadataAccessToken();
  const model = process.env.VERTEX_GEMINI_MODEL || "gemini-1.5-pro";
  const url = `https://${vertexLocation}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${vertexLocation}/publishers/google/models/${model}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || `Vertex AI returned ${response.status}`);
  }
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n")
    || "Gemini returned an empty response.";
}

async function routeChat(body) {
  const provider = body.provider || "claude";
  const prompt = String(body.prompt || "").trim();
  if (!prompt) {
    return { status: 400, payload: { error: "prompt is required" } };
  }
  if (!providers[provider]) {
    return { status: 400, payload: { error: `Unknown provider: ${provider}` } };
  }

  if (!providers[provider].configured() || provider === "copilot") {
    return { status: 200, payload: { provider, mode: "handoff", reply: fallbackReply(provider, prompt) } };
  }

  if (provider === "gemini" && !process.env.K_SERVICE) {
    return {
      status: 200,
      payload: {
        provider,
        mode: "vertex-ready",
        reply: "Gemini proxy is ready for Vertex AI. Deploy gumption-api to Cloud Run so Samantha's service account can call Vertex with project-scoped auth.",
      },
    };
  }

  const reply = await {
    claude: () => anthropic(prompt),
    chatgpt: () => openAiCompatible({
      apiKey: process.env.OPENAI_API_KEY,
      url: "https://api.openai.com/v1/chat/completions",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      prompt,
    }),
    grok: () => openAiCompatible({
      apiKey: process.env.XAI_API_KEY,
      url: "https://api.x.ai/v1/chat/completions",
      model: process.env.XAI_MODEL || "grok-2-latest",
      prompt,
    }),
    gemini: () => vertexGemini(prompt),
  }[provider]();

  return { status: 200, payload: { provider, mode: "live", reply } };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    writeJson(res, 204, {});
    return;
  }

  try {
    if (url.pathname === "/api/health") {
      writeJson(res, 200, {
        status: "ok",
        service: "gumption-api",
        owner: "bryan@norcalcarbmobile.com",
        operator: "Samantha",
        projectId,
        vertexLocation,
        revision: process.env.K_REVISION || "local",
      });
      return;
    }

    if (url.pathname === "/api/providers") {
      writeJson(res, 200, Object.fromEntries(
        Object.entries(providers).map(([id, provider]) => [id, {
          label: provider.label,
          configured: provider.configured(),
          secret: provider.env,
        }]),
      ));
      return;
    }

    if (url.pathname === "/api/chat" && req.method === "POST") {
      const result = await routeChat(await readJson(req));
      writeJson(res, result.status, result.payload);
      return;
    }

    writeJson(res, 404, { error: "not found" });
  } catch (error) {
    writeJson(res, 500, { error: error.message || "unexpected api error" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`gumption-api listening on http://0.0.0.0:${port}`);
});
