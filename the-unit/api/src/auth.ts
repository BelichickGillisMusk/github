import type { NextFunction, Request, Response } from "express";
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { logger } from "./logger.js";

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: process.env.GCP_PROJECT,
  });
}

export interface AuthedRequest extends Request {
  uid?: string;
  email?: string | null;
}

/**
 * Verifies a Firebase ID token from the Authorization header and attaches
 * `uid` + `email` to the request. Rejects with 401 otherwise.
 *
 * The Cloud Run service is deployed with --allow-unauthenticated at the
 * network edge so the browser can call it directly — auth is enforced HERE.
 */
export async function requireFirebaseAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.header("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) {
    res.status(401).json({ error: "missing_bearer_token" });
    return;
  }

  try {
    const decoded = await getAuth().verifyIdToken(match[1], true);
    req.uid = decoded.uid;
    req.email = decoded.email ?? null;
    next();
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "id_token_verification_failed");
    res.status(401).json({ error: "invalid_id_token" });
  }
}
