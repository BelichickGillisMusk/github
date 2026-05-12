import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { buildApp } from "../src/index.js";

test("GET /healthz returns ok", async () => {
  const app = buildApp();
  const res = await request(app).get("/healthz");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.service, "gumption-api");
});

test("POST /v1/openai/chat/completions without bearer is 401", async () => {
  const app = buildApp();
  const res = await request(app)
    .post("/v1/openai/chat/completions")
    .send({ model: "gpt-4o-mini", messages: [{ role: "user", content: "hi" }] });
  assert.equal(res.status, 401);
  assert.equal(res.body.error, "missing_bearer_token");
});

test("POST /v1/anthropic/messages without bearer is 401", async () => {
  const app = buildApp();
  const res = await request(app)
    .post("/v1/anthropic/messages")
    .send({ model: "claude-3-5-sonnet-latest", messages: [] });
  assert.equal(res.status, 401);
});

test("POST /v1/gemini/gemini-2.0-flash-001:generateContent without bearer is 401", async () => {
  const app = buildApp();
  const res = await request(app)
    .post("/v1/gemini/gemini-2.0-flash-001:generateContent")
    .send({ contents: [] });
  assert.equal(res.status, 401);
});

test("POST /v1/openai/chat/completions with bogus bearer is 401", async () => {
  const app = buildApp();
  const res = await request(app)
    .post("/v1/openai/chat/completions")
    .set("Authorization", "Bearer not-a-real-token")
    .send({ model: "gpt-4o-mini", messages: [] });
  assert.equal(res.status, 401);
  assert.equal(res.body.error, "invalid_id_token");
});

test("GET unknown route returns 404", async () => {
  const app = buildApp();
  const res = await request(app).get("/nope");
  assert.equal(res.status, 404);
});
