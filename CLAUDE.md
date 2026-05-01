# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-property web platform deployed on **Cloudflare Workers**, plus a standalone React security app. All workers share Cloudflare account ID `bafa242dd95d3fdce72540d20accd0a2`.

## Architecture

```
workers/
├── silverbackai/              # Marketing homepage (worker.js → HTML)
├── silverbackai-toolkit/      # AI tools catalog (worker.js → HTML)
├── security-silverbackai/     # Security dashboard (worker.js → HTML + JSON API)
├── cleantruckcheckstockton/   # CARB emissions testing service (worker.js → HTML)
├── silverback-ai-studio/      # Full React + Express security app (NOT a CF Worker)
└── dmc-properties/            # Property management dashboard (static HTML)
```

**Cloudflare Workers** (`silverbackai`, `silverbackai-toolkit`, `security-silverbackai`, `cleantruckcheckstockton`): Single `worker.js` files that return complete HTML inline. Each has a `wrangler.toml` for config and a GitHub Actions workflow for auto-deploy on push to `main`.

**silverback-ai-studio**: React 19 + Express + WebSocket app deployed to Google Cloud Run via AI Studio. Uses Firebase Firestore for event storage, Google Gemini API for AI analysis, and Google Sign-In for auth. Monitors 3875 Ruby St, Oakland.

## Deployment

All Cloudflare Worker deploys use GitHub Actions with `cloudflare/wrangler-action@v3`. Workflows are in `.github/workflows/` and trigger on pushes to `main`/`master` scoped by path (e.g., `workers/silverbackai/**`). Requires `CLOUDFLARE_API_TOKEN` secret.

Custom domain routing is configured in each worker's `wrangler.toml` via `routes` (e.g., `security.silverbackai.agency/*`). DNS records must be configured in Cloudflare dashboard separately.

To manually deploy a worker:
```bash
cd workers/<worker-name>
npx wrangler deploy
```

## Silverback AI Studio Commands

```bash
cd workers/silverback-ai-studio
npm install
npm run dev      # Start dev server (Express + Vite, port 3000)
npm run build    # Production build via Vite
npm run lint     # TypeScript type check (tsc --noEmit)
```

## Key Patterns

- Workers return full HTML as template literals inside `fetch()` handler — all CSS is inlined
- Dark theme with purple accents (`#8b5cf6`) is the brand standard across all sites
- The security-silverbackai worker has `/api/health` and `/api/status` JSON endpoints
- Firebase admin is hardcoded to `bryan@norcalcarbmobile.com` in studio app
- Firestore rules enforce auth and role-based access (admin vs viewer)
