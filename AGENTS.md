# AGENTS.md

Guidance for AI agents working in this repository.

## Cursor Cloud specific instructions

### Repository shape

- **Root `package.json`** exists but only holds repo automation scripts (`setup:hermes`, `check`) and has **no dependencies** — `npm install` at the root is a no-op. Real dependencies live per-app.
- **Two Node apps have real npm dependencies** (need `npm install`): `workers/silverback-ai-studio/` (React + Express + Vite) and `the-unit/api/` (`gumption-api`, a Cloud Run Express/TypeScript proxy with `npm run typecheck` + `npm run test:boot`).
- **CARB / law brochure sites** — edit `sites/sites.json` and `sites/templates/*.html`, then run `node sites/build.mjs`. Never hand-edit `sites/dist/` (regenerated output, but committed so workers can be previewed without rebuilding).
- **Legacy inline workers** — `workers/silverbackai`, `security-silverbackai`, `portfolio-showcase`, `norcalcarbmobile`, etc. each have their own `wrangler.toml` and need no `npm install` (run via `npx wrangler@4`).

### After pulling changes

1. If `sites/**` changed: `node sites/build.mjs`
2. If `workers/silverback-ai-studio/**` changed: `cd workers/silverback-ai-studio && npm install`
3. If `the-unit/api/**` changed: `cd the-unit/api && npm install`

### Lint / build / test

| Target | Command | Notes |
|--------|---------|--------|
| Silverback AI Studio | `cd workers/silverback-ai-studio && npm run lint` | `tsc --noEmit` only |
| Silverback AI Studio | `cd workers/silverback-ai-studio && npm run build` | Vite production build |
| Site generator | `node sites/build.mjs` | Validates template + config; writes `sites/dist/*` |
| CI-style smoke | `curl -f https://<site-id>.silverbackai.workers.dev/` | See `.github/workflows/health-check.yml` |

There is no unit-test runner in-repo; GitHub Actions smoke deployed Workers over HTTPS.

### Local dev servers (non-obvious)

**Wrangler** — use non-interactive flags in Cloud Agent / CI shells (avoids `npx` confirm and “install Cloudflare skills” prompts):

```bash
CI=1 npx --yes wrangler@4 dev --local --show-interactive-dev-session=false --install-skills=false
```

- Default URL: `http://localhost:8787`
- Only one Worker should bind **8787** at a time. For a second worker, change `--port` and use a distinct `--inspector-port` (e.g. `9230`) if you see “Address already in use” on **9229**.

**Example — preview one generated site:**

```bash
node sites/build.mjs
cd sites/dist/cleantruckcheck-stockton
CI=1 npx --yes wrangler@4 dev --local --show-interactive-dev-session=false --install-skills=false
```

**Silverback AI Studio** (Express + Vite, port **3000**):

```bash
cd workers/silverback-ai-studio
npm run dev
```

Copy `.env.example` → `.env.local` and set `GEMINI_API_KEY` for AI analysis features. Firebase/Google Sign-In are cloud services; the UI shell runs without them, but auth and live data need configured Firebase credentials.

Non-obvious: the dashboard's "Trigger Real-time Alert" / "Mock Event" buttons need Firebase login (they early-return when no user). To exercise the WebSocket alerting pipeline **without** auth, POST to the server directly and a toast renders on the landing page (the WS listener mounts regardless of login):

```bash
curl -s -X POST http://localhost:3000/api/trigger-alert -H 'Content-Type: application/json' \
  -d '{"type":"weirdness_alert","severity":"high","description":"Lingering stranger","location":"Rear Entrance"}'
# health: GET http://localhost:3000/api/health -> {"status":"ok","clients":N}
```

Only `high`/`critical` severities are broadcast.

### Optional services

- **KV `SUBMISSIONS`**, **Resend/MailChannels**, **ALERT_WEBHOOK** — booking/chat persistence and alerts on brochure sites; sites still render without KV.
- **`norcal-toolkit/`** — standalone Python CLIs (`python3 norcal-toolkit/<script>.py`), not part of web dev.

### Deploy

Push to `main` triggers path-scoped GitHub Actions (`.github/workflows/`). Manual: `cd sites/dist/<id>` or `cd workers/<name>` then `npx wrangler deploy` (requires `CLOUDFLARE_API_TOKEN`).
