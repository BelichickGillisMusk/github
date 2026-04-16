# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-property web platform deployed on **Cloudflare Workers**, plus a standalone full-stack React security app and a static property dashboard. All Cloudflare Workers share account ID `bafa242dd95d3fdce72540d20accd0a2` and `compatibility_date = 2026-03-01`.

## Architecture

```
workers/
├── silverbackai/              # Marketing homepage + intake form (CF Worker)
├── silverbackai-toolkit/      # AI tools catalog (CF Worker)
├── security-silverbackai/     # Security dashboard + JSON API (CF Worker)
├── cleantruckcheckstockton/   # CARB HD-OBD testing site (CF Worker)
├── silverback-ai-studio/      # React 19 + Express + WebSocket app (Cloud Run)
└── dmc-properties/            # Static rent-roll HTML (no deploy)

.github/workflows/             # One deploy-*.yml per CF Worker
```

### Cloudflare Workers

Each worker is a single `worker.js` that returns complete HTML as a template literal from the `fetch()` handler — all CSS is inlined. Each has its own `wrangler.toml` and a path-scoped GitHub Actions workflow.

| Worker | Custom domain(s) | Notes |
|---|---|---|
| `silverbackai` | `silverbackai.agency`, `www.silverbackai.agency` | Routes: `/`, `/tools/:slug` (5 tool pages), `/robots.txt`, `/sitemap.xml`, `POST /api/intake` |
| `silverbackai-toolkit` | `toolkit.silverbackai.agency` | Tool registry/catalog |
| `security-silverbackai` | `security.silverbackai.agency/*` (zone `silverbackai.agency`) | Dashboard for 3875 Ruby St, Oakland (24-unit apt). `/api/health`, `/api/status` JSON endpoints |
| `cleantruckcheckstockton` | None — uses `*.workers.dev` | CARB mobile emissions testing service site |

### silverback-ai-studio (NOT a Cloudflare Worker)

Full-stack TypeScript app deployed to **Google Cloud Run** via Google AI Studio. Stack:

- **Frontend**: React 19, Vite 6, Tailwind 4, Framer Motion
- **Backend**: Express 4 + `ws` WebSocket server in `server.ts` (run via `tsx`)
- **Data/AI**: Firebase 12 (Auth, Firestore), `@google/genai` 1 (Gemini)
- **Auth**: Google Sign-In; Firebase admin hardcoded to `bryan@norcalcarbmobile.com`
- **Purpose**: Real-time security monitoring for 3875 Ruby St, Oakland — event logging, AI analysis, audio alerts, CSV export

App entry: `server.ts` (Express + WS + Vite middleware) and `src/App.tsx` (single large component, ~82KB). Firestore rules enforce auth + role-based access (admin vs viewer).

### dmc-properties

Single static `rent-roll.html` for Dave Cowan Properties (West Region rent roll). No `worker.js`, no `wrangler.toml`, no deploy workflow. Irish flag color palette, WCAG AAA accessibility.

## Deployment

**Cloudflare Workers**: GitHub Actions using `cloudflare/wrangler-action@v3`. One workflow per worker (`deploy-silverbackai.yml`, `deploy-silverbackai-toolkit.yml`, `deploy-security-silverbackai.yml`, `deploy-stockton-worker.yml`), each triggered on pushes to `main`/`master` filtered by `workers/<name>/**`. Requires `CLOUDFLARE_API_TOKEN` secret. Custom domains in `wrangler.toml` `routes`; DNS must be configured separately in Cloudflare.

Manual deploy:
```bash
cd workers/<worker-name>
npx wrangler deploy
```

**silverback-ai-studio**: deployed to Google Cloud Run (out-of-band — no workflow in this repo).

**dmc-properties**: not deployed by this repo.

## silverback-ai-studio Commands

```bash
cd workers/silverback-ai-studio
npm install
npm run dev      # tsx server.ts — Express + Vite, port 3000
npm run build    # vite build
npm run lint     # tsc --noEmit (type check only)
```

## Key Conventions

- Workers return full HTML as template literals — keep CSS inlined, no build step.
- Brand styling: dark theme with purple accent `#8b5cf6` across all sites.
- Silverback brand uses gorilla-in-hi-vis-vest logo.
- Add a new worker: create `workers/<name>/{worker.js,wrangler.toml}` and a matching `.github/workflows/deploy-<name>.yml` scoped to that path.
- `silverback-ai-studio` and `dmc-properties` do **not** follow the worker pattern — don't add a `wrangler.toml` to either.
