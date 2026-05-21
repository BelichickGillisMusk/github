import { Router } from "express";
import { request } from "undici";
import { GoogleAuth } from "google-auth-library";
import type { AuthedRequest } from "../auth.js";
import { logger } from "../logger.js";
import { recordTokens } from "../rateLimit.js";

export const geminiRouter: Router = Router();

const PROJECT = process.env.GCP_PROJECT;
const REGION = process.env.GCP_REGION ?? "us-central1";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

/**
 * Vertex AI Gemini passthrough. Uses Application Default Credentials
 * from the attached Cloud Run service account (no API key needed) —
 * Vertex calls are billed against project credits, not a personal key.
 *
 * POST /v1/gemini/:model:generateContent
 *   :model = e.g. gemini-2.0-flash-001, gemini-2.5-pro
 */
geminiRouter.post("/:model\\:generateContent", async (req: AuthedRequest, res) => {
  if (!PROJECT) {
    res.status(503).json({ error: "gcp_project_not_configured" });
    return;
  }
  const model = req.params.model;
  const url =
    `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT}` +
    `/locations/${REGION}/publishers/google/models/${model}:generateContent`;

  try {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) {
      res.status(500).json({ error: "could_not_acquire_adc_token" });
      return;
    }

    const upstream = await request(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstream.body.text();
    res.status(upstream.statusCode).type("application/json").send(text);

    if (upstream.statusCode >= 200 && upstream.statusCode < 300 && req.uid) {
      try {
        const parsed = JSON.parse(text) as {
          usageMetadata?: {
            promptTokenCount?: number;
            candidatesTokenCount?: number;
          };
        };
        await recordTokens(
          req.uid,
          "vertex-gemini",
          model,
          parsed.usageMetadata?.promptTokenCount ?? 0,
          parsed.usageMetadata?.candidatesTokenCount ?? 0,
        );
      } catch {
        // non-fatal
      }
    }
  } catch (err) {
    logger.error({ err: (err as Error).message, model }, "vertex_gemini_failed");
    res.status(502).json({ error: "vertex_gemini_failed" });
  }
});
