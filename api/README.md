# Gumption API

Cloud Run provider proxy for Samantha's Brain Trust app.

## Responsibilities

- Keeps Anthropic, OpenAI, and xAI keys server-side.
- Uses Vertex AI Gemini from `samantha-gumption` instead of a browser Gemini key.
- Sends SMS or voice escalation alerts to Bryan when agent progress is blocked.
- Exposes `/api/health`, `/api/providers`, `/api/chat`, `/api/alerts/status`, and `/api/alerts`.
- Returns local handoff responses when secrets or Cloud Run metadata are not available.

## Secrets

Create these Secret Manager secrets when each provider is ready:

- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `XAI_API_KEY`
- `ALERT_TO_PHONE`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_SMS_FROM` or `TWILIO_FROM`
- `TWILIO_VOICE_FROM` or `TWILIO_FROM`

Attach them to Cloud Run as environment variables when deploying `gumption-api`.

## Google Voice note

Google Voice numbers can receive alerts if you set `ALERT_TO_PHONE` to that number or forward it to your real phone. Google Voice is not a supported outbound SMS API, so the sending side should be a Twilio number unless the Google Voice number is ported to a provider with an API.
