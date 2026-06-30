import { Router } from "express";
import { request } from "undici";
import type { AuthedRequest } from "../auth.js";
import { logger } from "../logger.js";
import { recordTokens } from "../rateLimit.js";

export const openaiRouter: Router = Router();

openaiRouter.post("/chat/completions", async (req: AuthedRequest, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "openai_key_not_configured" });
    return;
  }

  try {
    const upstream = await request("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstream.body.text();
    res.status(upstream.statusCode).type("application/json").send(text);

    if (upstream.statusCode >= 200 && upstream.statusCode < 300 && req.uid) {
      try {
        const parsed = JSON.parse(text) as {
          model?: string;
          usage?: { prompt_tokens?: number; completion_tokens?: number };
        };
        await recordTokens(
          req.uid,
          "openai",
          parsed.model ?? "unknown",
          parsed.usage?.prompt_tokens ?? 0,
          parsed.usage?.completion_tokens ?? 0,
        );
      } catch {
        // non-fatal
      }
    }
  } catch (err) {
    logger.error({ err: (err as Error).message }, "openai_upstream_failed");
    res.status(502).json({ error: "openai_upstream_failed" });
  }
});
