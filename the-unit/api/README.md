# gumption-api — Cloud Run proxy

Serverless API proxy that holds provider keys server-side, gates every request
behind a **Firebase ID token**, and meters per-user daily token spend in
Firestore. Designed for the Gumption / Unit front-end.

## Routes

| Method + path | Upstream | Notes |
|---|---|---|
| `GET  /healthz` | — | Public health check. |
| `POST /v1/anthropic/messages` | `api.anthropic.com/v1/messages` | Pure passthrough; usage parsed from response. |
| `POST /v1/openai/chat/completions` | `api.openai.com/v1/chat/completions` | Pure passthrough. |
| `POST /v1/xai/chat/completions` | `api.x.ai/v1/chat/completions` | Pure passthrough. |
| `POST /v1/gemini/:model:generateContent` | Vertex AI (`{REGION}-aiplatform.googleapis.com`) | Uses ADC from the attached service account — no API key. |

All `/v1/*` routes:

1. Require `Authorization: Bearer <firebase-id-token>`.
2. Check `gumption_usage/{uid}/days/{YYYY-MM-DD}.tokens < DAILY_TOKEN_CAP`.
3. Forward to the upstream.
4. Best-effort increment the user's daily token counter on success.

## Environment variables

Set on Cloud Run via `--set-env-vars` and `--set-secrets`:

| Var | Source | Required |
|---|---|---|
| `GCP_PROJECT` | env var | yes |
| `GCP_REGION` | env var | defaults to `us-central1` |
| `DAILY_TOKEN_CAP` | env var | defaults to `250000` |
| `ANTHROPIC_API_KEY` | Secret Manager: `anthropic-key:latest` | optional |
| `OPENAI_API_KEY` | Secret Manager: `openai-key:latest` | optional |
| `XAI_API_KEY` | Secret Manager: `xai-key:latest` | optional |

Vertex AI Gemini does not need a key — it uses the runtime SA's ADC.

## Local dev

```bash
cd the-unit/api
npm install
npm run typecheck
node --test --import tsx test/boot.test.ts   # offline auth + 404 + health checks
```

To run the server locally against real upstreams you need:
- `GOOGLE_APPLICATION_CREDENTIALS` pointing at a SA key JSON file
- The same env vars as production set in a `.env` or your shell
- A Firebase ID token from a real user to test `/v1/*`

```bash
npm run dev   # tsx watch on src/index.ts, port 8080
```

## Deploy to Cloud Run

See `the-unit/scripts/deploy-gcp.sh` (one-shot deploy) and
`the-unit/scripts/setup-secrets.sh` (one-time secret provisioning).

A push to `main` that touches `the-unit/api/**` also auto-deploys via
`.github/workflows/the-unit-api-deploy.yml`.
