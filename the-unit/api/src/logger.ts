import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
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
