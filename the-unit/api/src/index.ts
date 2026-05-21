import express from "express";
import { pinoHttp } from "pino-http";
import { requireFirebaseAuth } from "./auth.js";
import { enforceDailyCap } from "./rateLimit.js";
import { logger } from "./logger.js";
import { anthropicRouter } from "./providers/anthropic.js";
import { openaiRouter } from "./providers/openai.js";
import { xaiRouter } from "./providers/xai.js";
import { geminiRouter } from "./providers/gemini.js";

export function buildApp(): express.Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "2mb" }));
  app.use(pinoHttp({ logger }));

  app.get("/healthz", (_req, res) => {
    res.json({ ok: true, service: "gumption-api" });
  });

  app.use("/v1/anthropic", requireFirebaseAuth, enforceDailyCap, anthropicRouter);
  app.use("/v1/openai", requireFirebaseAuth, enforceDailyCap, openaiRouter);
  app.use("/v1/xai", requireFirebaseAuth, enforceDailyCap, xaiRouter);
  app.use("/v1/gemini", requireFirebaseAuth, enforceDailyCap, geminiRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const port = Number(process.env.PORT ?? 8080);
  buildApp().listen(port, () => {
    logger.info({ port }, "gumption-api listening");
  });
}
