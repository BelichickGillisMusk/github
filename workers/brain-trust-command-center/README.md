# Brain Trust Command Center

Enhanced GCP-ready rebuild of the Vercel app at `https://web-ten-teal-90.vercel.app/`.

## What changed

- Preserves the Brain Trust dashboard concept: agent roster, AI provider handoff, KPI bar, command stream, invoices, CARB tests, and orphan-work alerts.
- Adds a GCP launch board for Cloud Run migration work.
- Adds `/api/health` and `/api/status` endpoints for Cloud Run checks and monitoring.
- Supports shareable view URLs like `/?view=gcp&demo=launch` for launch reviews.
- Uses a no-dependency Node static server so the container starts quickly and respects the Cloud Run `PORT`.

## Run locally

```bash
npm run check
npm start
```

Then open `http://localhost:8080`.

## Deploy to Google Cloud Run

Prerequisites:

1. Select the target GCP project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```
2. Enable required services:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```
3. From this directory, deploy:
   ```bash
   REGION=us-central1 SERVICE=brain-trust-command-center ./scripts/deploy-cloud-run.sh
   ```

The Cloud Build config builds the Docker image, pushes it to Artifact Registry, and deploys the service to Cloud Run.
