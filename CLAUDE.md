# Agent Memory

## ⚡ READ THIS FIRST — CARB Sites

**ALL Silverback CARB sites (Mobile CARB Smoke Test, Clean Truck Check Roseville/Stockton/Hayward/Fairfield, etc.) are generated from `sites/` — NEVER edit them anywhere else.**

- Source of truth: `sites/sites.json` (phone, colors, prices, FAQ, chatbot config per site)
- Template: `sites/template.html`
- Build: `node sites/build.mjs` → outputs `sites/dist/<site-id>/{index.html, worker.js, wrangler.toml, sitemap.xml, robots.txt}`
- Each generated worker has the HTML embedded inline. **No KV dependency for content**, so phone/color/price fields are completely independent — changing one cannot drift another.
- Workflow when user says "fix X on the [city] site": open `sites/sites.json`, find the site by `id` or `domain`, edit the field, run `node sites/build.mjs`, commit, deploy.
- VIN chatbot (the gorilla 🦍) lives in the template; alerts via `ALERT_WEBHOOK` env var or `defaults.chatbot.alertWebhook` in sites.json. Bookings + chats persist in KV namespace `SUBMISSIONS` if bound.
- Sister-site cross-links are auto-generated from sites.json — adding a new site automatically links it from every other site.
- See `sites/README.md` for full docs.

**The legacy `workers/cleantruckcheckstockton/` was deleted** — Stockton is now generated under `sites/dist/cleantruckcheck-stockton/`. The other `workers/*` folders (`silverback-ai-studio`, `silverbackai`, `security-silverbackai`, `silverbackai-toolkit`, `dmc-properties`) are unrelated products and stay where they are.

## Project Overview

Cloudflare Workers monorepo for **Silverback AI** — an AI-powered security monitoring and property management platform. Multiple independently deployable workers plus a full-stack React dashboard.

## Directory Structure

```
workers/
  silverback-ai-studio/    # Main app: React dashboard + Express/WebSocket backend
  silverbackai/             # Homepage/landing page (Cloudflare Worker)
  security-silverbackai/    # Security systems landing page (Cloudflare Worker)
  silverbackai-toolkit/     # Toolkit hub/marketplace (Cloudflare Worker)
  cleantruckcheckstockton/  # Local service website (Cloudflare Worker)
  dmc-properties/           # DMC Properties rent roll dashboard (static HTML)
```

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Framer Motion (motion v12), Lucide React icons
- **Backend**: Express.js 4, WebSocket (ws v8), Node.js
- **Build**: Vite 6, TypeScript ~5.8, tsx for dev server
- **Services**: Firebase (Auth + Firestore), Google Gemini API (@google/genai)
- **Deploy**: Cloudflare Workers via Wrangler, GitHub Actions
- **License**: Apache 2.0

## Key File Paths

| File | Purpose |
|------|---------|
| `workers/silverback-ai-studio/src/App.tsx` | Main React component (~82KB), all types/interfaces, core UI logic |
| `workers/silverback-ai-studio/server.ts` | Express + WebSocket server, Vite middleware integration |
| `workers/silverback-ai-studio/src/firebase.ts` | Firebase singleton: auth, db, googleProvider exports |
| `workers/silverback-ai-studio/vite.config.ts` | Vite config with React plugin, Tailwind, GEMINI_API_KEY injection |
| `workers/silverback-ai-studio/tsconfig.json` | TS config: ES2022 target, ESNext module, `@/*` path alias |
| `workers/silverback-ai-studio/firebase-blueprint.json` | Firestore data model definitions |
| `workers/silverback-ai-studio/firestore.rules` | Firestore security rules |
| `workers/silverback-ai-studio/.env.example` | Required env vars (GEMINI_API_KEY, APP_URL) |
| `.github/workflows/*.yml` | CI/CD: 4 Cloudflare deploy workflows |

## Core Types (App.tsx lines 55-113)

- `OperationType` enum: CREATE, UPDATE, DELETE, LIST, GET, WRITE
- `EventLog`: timestamp, type, description, severity, location, aiAnalysis
- `WeirdnessConfig`: normalHours, motionThreshold, lingeringThreshold
- `SecurityReport`: generatedAt, period, summary, eventCount
- `FirestoreErrorInfo`: error, operationType, path, authInfo

## Code Patterns

### Firebase Singleton (`src/firebase.ts`)
Centralized init — all Firebase imports go through this module. Exports: `auth`, `db`, `googleProvider`.

### WebSocket Broadcasting (`server.ts` lines 19-40)
- Tracks clients via `Set<WebSocket>`
- Broadcasts only to `readyState === WebSocket.OPEN`
- Message format: `{ type: 'ALERT', payload: alert }`

### Error Handling (`App.tsx` lines 293-314)
- `handleFirestoreError()` wraps errors with auth context, operation type, collection path
- Serializes to JSON string for structured logging
- `ErrorBoundary` component for React-level catching (lines 365-398)

### State Management
- Pure React hooks (`useState`, `useEffect`) — no state library
- 14+ state variables in App component
- Firestore real-time listeners via `onSnapshot()` with cleanup in useEffect return
- Loading flags: `isGenerating`, `isAnalyzing`, etc.

### View Routing
- State-driven: `view: 'dashboard' | 'presentation'`
- Tab-based nav within views via `dashboardTab`
- No router library — component composition with conditional rendering

### Cloudflare Workers Pattern
All workers follow: single default export with `async fetch(request)`, URL-based routing, embedded HTML response fallback.
```js
var worker_default = { async fetch(request) { /* route or serve HTML */ } }
```

### Component Patterns
- Functional components with destructured props
- Tailwind utility classes inline (no separate CSS files in React app)
- Glassmorphic UI: backdrop blur, z-index layering (100/110/200 ranges)
- Motion animations via `motion.div` with initial/animate/exit

## API Endpoints (server.ts)

- `POST /api/trigger-alert` — Broadcast WebSocket alert
- `GET /api/health` — Health check
- `GET /api/status` — System status report

## AI Integration

- **Google Gemini** via `@google/genai`
- Text analysis model: `gemini-3-flash-preview`
- Image generation model: `gemini-2.5-flash-image`
- API key injected via Vite `define` from `GEMINI_API_KEY` env var

## Build & Dev Commands (silverback-ai-studio)

```bash
npm run dev      # Start dev server (tsx server.ts)
npm run build    # Production build (vite build)
npm run preview  # Preview production build
npm run clean    # Remove dist/
npm run lint     # TypeScript type checking (tsc --noEmit)
```

## CI/CD (GitHub Actions)

4 workflows in `.github/workflows/`, all using `cloudflare/wrangler-action@v3`:
- Trigger: push to main/master (path-filtered) or manual dispatch
- Secret: `CLOUDFLARE_API_TOKEN`
- Account ID: `bafa242dd95d3fdce72540d20accd0a2`

## Testing

- **No test framework** — no Jest, Vitest, Mocha, or test files
- Only `tsc --noEmit` for type checking
- No ESLint, Prettier, or pre-commit hooks configured

## Conventions

- **File naming**: kebab-case directories/files, PascalCase components
- **Imports**: React/framework first, then UI libs, then Firebase module, then external APIs
- **Comments**: Minimal — code is self-documenting
- **Auth flow**: Firebase Google Sign-In via popup, user profile stored at `/users/{userId}` in Firestore
