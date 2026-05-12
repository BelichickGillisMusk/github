# Gumption API

Cloud Run provider proxy for Samantha's Brain Trust app.

## Responsibilities

- Keeps Anthropic, OpenAI, and xAI keys server-side.
- Uses Vertex AI Gemini from `samantha-gumption` instead of a browser Gemini key.
- Exposes `/api/health`, `/api/providers`, and `/api/chat`.
- Returns local handoff responses when secrets or Cloud Run metadata are not available.

## Secrets

Create these Secret Manager secrets when each provider is ready:

- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `XAI_API_KEY`

Attach them to Cloud Run as environment variables when deploying `gumption-api`.
