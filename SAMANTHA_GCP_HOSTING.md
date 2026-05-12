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

## One-time setup

```bash
gcloud auth login
gcloud config set account bryan@norcalcarbmobile.com
gcloud projects create samantha-gumption --name="Gumption by Silverback AI"
gcloud config set project samantha-gumption
gcloud services enable run.googleapis.com firebase.googleapis.com aiplatform.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

## Deploy

From the repo root:

```powershell
.\scripts\deploy-gcp.ps1
```

The script deploys `api/` to Cloud Run, builds `web/`, then deploys Firebase Hosting.
