# Onboarding — Tools, Skills, MCP & Google APIs

Quick-start reference for a new AI assistant (e.g. **Samantha**) working in this repo.
Read this alongside `CLAUDE.md` (architecture) and `sites/README.md` (site registry).

## Accounts & secrets

| Thing | Value / location |
|---|---|
| GitHub repo | `belichickgillismusk/github` |
| Cloudflare account ID | `bafa242dd95d3fdce72540d20accd0a2` ("Silverbackai Agency") |
| Cloudflare deploy token | GitHub secret `CLOUDFLARE_API_TOKEN` |
| Gemini API key | `GEMINI_API_KEY` — `workers/silverback-ai-studio/.env.local` (see `.env.example`) |
| Email alerts | Resend — see `sites/RESEND_SETUP.md` |
| Form/chat alerts | `ALERT_WEBHOOK` env var (Make.com / Zapier / SMS) |

Source of truth lives in git — **never edit a deployed worker in the Cloudflare dashboard.**

## Skills

**Repo-local** (`.claude/skills/`):
- **`silverback-cloudflare-site`** — the only correct way to add/edit/migrate a single-page Silverback site. Triggers on: new site, migrate from Squarespace/Wix/WordPress, change phone/color/price, deploy a Worker. Enforces the `sites.json` single-source-of-truth pattern. Read the SKILL.md before touching any site.

**Harness skills** (invoke with `/<name>`):
- `init` — scaffold/update `CLAUDE.md`
- `review`, `security-review`, `/code-review ultra` — PR & branch review
- `simplify` — review changed code for reuse/quality
- `update-config` — edit `settings.json` (permissions, hooks, env)
- `less-permission-prompts` — build an allowlist to reduce prompts
- `keybindings-help`, `loop`, `session-start-hook`, `claude-api`

## MCP servers

- **GitHub MCP** (`mcp__github__*`) — PRs, issues, comments, CI status, file reads/writes, branches, releases.
  - **Scope is restricted to `belichickgillismusk/github`.** Calls to any other repo are denied.
  - There is **no `gh` CLI** — use the MCP tools for all GitHub work.
  - Tools are deferred: load a schema with `ToolSearch` (`select:mcp__github__create_pull_request`) before calling.
- **Do not create a PR unless explicitly asked.**

## Google APIs & cloud services (all in `silverback-ai-studio`)

**All Google APIs are provisioned automatically under the GCP project `Samantha`, owned by `bryan@norcalcarbmobile.com`.** Sign in as that account in the [Google Cloud console](https://console.cloud.google.com/) and select the `Samantha` project to view/manage keys, billing, quotas, and IAM.

The React app at `workers/silverback-ai-studio/` is where Google services are wired:
- **Gemini** via `@google/genai` — AI analysis. Key: `GEMINI_API_KEY` (injected by Vite, see `vite.config.ts`). Issue/rotate keys in the `Samantha` project → APIs & Services → Credentials.
- **Firebase** v12 — **Auth** + **Firestore** event storage. The Firebase project is linked to the same `Samantha` GCP project. Firestore rules enforce admin vs viewer roles; admin is hardcoded to `bryan@norcalcarbmobile.com`.
- **Google Sign-In** — OAuth client lives in the `Samantha` project's Credentials page.
- **Google Cloud Run** — deployment target for `silverback-ai-studio` (deployed via Google AI Studio under the `Samantha` project; no workflow in this repo).

## Local setup

```bash
# Cloudflare workers (workers/* and sites/*) — no install needed beyond wrangler
npx wrangler deploy            # from a worker/dist dir

# Site registry (sites/)
node sites/build.mjs           # regenerate sites/dist/* from sites.json

# Full-stack studio app
cd workers/silverback-ai-studio
npm install
cp .env.example .env.local     # then add your GEMINI_API_KEY
npm run dev                     # Express + Vite, port 3000
npm run build                   # vite build
npm run lint                    # tsc --noEmit
```

## Deployment (current reality)

GitHub Actions, all using `cloudflare/wrangler-action@v3` + `CLOUDFLARE_API_TOKEN`:

- **`sites/` registry** → `.github/workflows/deploy-sites.yml`. Builds from `sites.json` and deploys **every** site via a matrix on push to `main`/`master`/`claude/**` (path `sites/**`). Add a site to `sites.json` and it deploys automatically — no workflow edits. Also runnable manually (Actions → "Deploy Silverback Sites" → pick a site or ALL).
- **Older `workers/*`** → one workflow each: `deploy-silverbackai.yml`, `deploy-silverbackai-toolkit.yml`, `deploy-security-silverbackai.yml`, `deploy-portfolio-showcase.yml`, `deploy-stockton-worker.yml`, `deploy-norcalcarbmobile.yml`. Path-scoped to that worker's dir.
- **`silverback-ai-studio`** → Google Cloud Run, out-of-band (not in this repo).
- New CARB/brochure-site custom domains need a **one-time** manual DNS + worker-route step in the Cloudflare dashboard.

## Golden rules

1. Develop on a `claude/*` branch; commit with clear messages; push with `git push -u origin <branch>`.
2. Never edit `sites/dist/` (regenerated) or a deployed worker in the dashboard.
3. Never share contact info/pricing across verticals (a law firm's phone must never appear on a CARB site).
4. `node sites/build.mjs` must succeed before pushing a site change.
5. Chatbot guardrails are non-negotiable — refuse off-topic, always surface the site's own contact info.
