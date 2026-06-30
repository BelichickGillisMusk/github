import { Router } from "express";
import { request } from "undici";
import type { AuthedRequest } from "../auth.js";
import { logger } from "../logger.js";
import { recordTokens } from "../rateLimit.js";

export const anthropicRouter: Router = Router();

const ANTHROPIC_VERSION = "2023-06-01";

anthropicRouter.post("/messages", async (req: AuthedRequest, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "anthropic_key_not_configured" });
    return;
  }

  try {
    const upstream = await request("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
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
          usage?: { input_tokens?: number; output_tokens?: number };
        };
        await recordTokens(
          req.uid,
          "anthropic",
          parsed.model ?? "unknown",
          parsed.usage?.input_tokens ?? 0,
          parsed.usage?.output_tokens ?? 0,
        );
      } catch {
        // non-fatal — body wasn't JSON or didn't include usage
      }
    }
  } catch (err) {
    logger.error({ err: (err as Error).message }, "anthropic_upstream_failed");
    res.status(502).json({ error: "anthropic_upstream_failed" });
  }
});
