# Samantha GCP Hosting Plan

Owner: `bryan@norcalcarbmobile.com`  
Operator agent: Samantha  
Project: `samantha-gumption`

## Split

- `web/` deploys the static Vite build to Firebase Hosting.
- `api/` deploys `gumption-api` to Cloud Run for provider calls and server-side keys.
- Firebase Hosting rewrites `/api/**` to Cloud Run in `us-west1`.
- Vertex AI Gemini uses project-scoped Cloud Run service account auth.
- Anthropic, OpenAI, and xAI keys belong in Secret Manager and are attached as Cloud Run env vars.
- SMS/voice progress alerts are sent from `gumption-api`; Bryan's destination phone stays in `ALERT_TO_PHONE`.

## One-time setup

```bash
gcloud auth login
gcloud config set account bryan@norcalcarbmobile.com
gcloud projects create samantha-gumption --name="Gumption by Silverback AI"
gcloud config set project samantha-gumption
gcloud services enable run.googleapis.com firebase.googleapis.com aiplatform.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

## Alert secrets

For "progress does not stop" alerts, add these secrets before enabling live SMS/voice:

```bash
printf "+15555550199" | gcloud secrets create ALERT_TO_PHONE --data-file=-
printf "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | gcloud secrets create TWILIO_ACCOUNT_SID --data-file=-
printf "twilio-auth-token" | gcloud secrets create TWILIO_AUTH_TOKEN --data-file=-
printf "+15555550200" | gcloud secrets create TWILIO_FROM --data-file=-
```

Use your real phone or a receiving Google Voice number for `ALERT_TO_PHONE`. Google Voice can receive or forward alerts, but it is not a supported outbound SMS API; use Twilio for the sending number.

## Deploy

From the repo root:

```powershell
.\scripts\deploy-gcp.ps1
```

The script deploys `api/` to Cloud Run, builds `web/`, then deploys Firebase Hosting.
