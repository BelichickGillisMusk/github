import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
    ],
    remove: true,
  },
  formatters: {
    level: (label) => ({ severity: label.toUpperCase() }),
  },
  messageKey: "message",
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: "gumption-api",
    env: process.env.NODE_ENV ?? "production",
  },
});
