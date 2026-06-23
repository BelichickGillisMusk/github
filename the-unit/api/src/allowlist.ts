import type { NextFunction, Response } from "express";
import type { AuthedRequest } from "./auth.js";
import { logger } from "./logger.js";

const ALLOWED_EMAILS_RAW = process.env.ALLOWED_EMAILS ?? "";

const allowedEmails: Set<string> = new Set(
  ALLOWED_EMAILS_RAW.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

/**
 * Rejects requests from users whose email is not in the allowlist.
 * When ALLOWED_EMAILS is unset or empty, ALL authenticated users are blocked
 * (fail-closed) to prevent open proxy abuse.
 */
export function enforceAllowlist(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const email = req.email?.toLowerCase() ?? "";

  if (allowedEmails.size === 0) {
    logger.warn({ uid: req.uid, email }, "allowlist_empty_all_blocked");
    res.status(403).json({ error: "service_not_configured" });
    return;
  }

  if (!allowedEmails.has(email)) {
    logger.warn({ uid: req.uid, email }, "user_not_in_allowlist");
    res.status(403).json({ error: "not_authorized" });
    return;
  }

  next();
}
