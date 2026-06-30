import { Firestore, FieldValue } from "@google-cloud/firestore";
import type { NextFunction, Response } from "express";
import type { AuthedRequest } from "./auth.js";
import { logger } from "./logger.js";

const firestore = new Firestore({ projectId: process.env.GCP_PROJECT });

const DAILY_TOKEN_CAP = Number(process.env.DAILY_TOKEN_CAP ?? 250_000);

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function usageRef(uid: string) {
  return firestore.doc(`gumption_usage/${uid}/days/${today()}`);
}

/**
 * Soft pre-check before sending the request to a provider. If the user has
 * already exceeded the cap today, reject without making a paid LLM call.
 *
 * The post-call increment in `recordTokens` is what makes the cap real;
 * this check only avoids spending money once a cap is already blown.
 */
export async function enforceDailyCap(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.uid) {
    res.status(401).json({ error: "missing_uid" });
    return;
  }
  try {
    const snap = await usageRef(req.uid).get();
    const used = (snap.data()?.tokens as number | undefined) ?? 0;
    if (used >= DAILY_TOKEN_CAP) {
      res.status(429).json({
        error: "daily_token_cap_exceeded",
        used,
        cap: DAILY_TOKEN_CAP,
      });
      return;
    }
    next();
  } catch (err) {
    logger.error({ err: (err as Error).message, uid: req.uid }, "rate_limit_check_failed");
    next();
  }
}

/**
 * Best-effort post-call token accounting. Called after each successful
 * provider response. Failures here must never block the user's response.
 */
export async function recordTokens(
  uid: string,
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
): Promise<void> {
  try {
    await usageRef(uid).set(
      {
        tokens: FieldValue.increment(inputTokens + outputTokens),
        [`byProvider.${provider}`]: FieldValue.increment(inputTokens + outputTokens),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    logger.info(
      { uid, provider, model, inputTokens, outputTokens },
      "tokens_recorded",
    );
  } catch (err) {
    logger.error(
      { err: (err as Error).message, uid, provider },
      "token_record_failed",
    );
  }
}
