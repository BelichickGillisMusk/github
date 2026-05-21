# Brain Trust Command Center Web

Firebase Hosting static Vite app for Samantha's `samantha-gumption` GCP project.

## What changed

- Preserves the Brain Trust dashboard concept from `https://web-ten-teal-90.vercel.app/`.
- Builds to `dist/` for Firebase Hosting's CDN-backed static hosting.
- Rewrites `/api/**` to the `gumption-api` Cloud Run service in `us-west1`.
- Supports shareable view URLs like `/?view=gcp&demo=launch` for launch reviews.
- Keeps provider keys out of the browser; AI Assist posts to the Cloud Run proxy.

## Run locally

Start the API from `../api`, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deploy

From the repo root, after authenticating to `samantha-gumption`:

```powershell
.\scripts\deploy-gcp.ps1
```
