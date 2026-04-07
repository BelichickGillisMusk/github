# Silverback CARB Sites — Single Source of Truth

This folder is the **only** place to edit any of the Silverback mobile-CARB sites.
There is **one config file** (`sites.json`), **one HTML template** (`template.html`),
and a **build script** (`build.mjs`) that generates everything.

You can no longer accidentally break the prices when changing a phone number,
because each value lives in its own field.

## How to change something

1. Open `sites.json`.
2. Find the site by `id` or `domain`.
3. Edit the field (`phone`, `colors.primary`, `prices.obd`, etc.).
4. Run:
   ```bash
   node sites/build.mjs
   ```
5. Deploy the affected site:
   ```bash
   cd sites/dist/<site-id>
   wrangler deploy
   ```
   (Or push to `main` and let GitHub Actions deploy — see `.github/workflows/`.)

## What gets generated

For each site in `sites.json`, `build.mjs` writes:

```
sites/dist/<site-id>/
  index.html       ← preview the site locally
  worker.js        ← Cloudflare Worker, HTML embedded inline (NO KV for content)
  wrangler.toml    ← deploy config
  sitemap.xml
  robots.txt
```

## What's in each site

- Mobile-first hero with the brand name, city, and phone (last 4 highlighted)
- Tagline + two CTAs (Book / Call)
- Pricing block — bullet list with `$OBD` / `$OVI`
- Motorhome note
- **FAQ section** (also emitted as `FAQPage` JSON-LD for Google rich results)
- **Sister-site cross-links** — automatically generated from the other entries in `sites.json`
- Booking form → `POST /api/book`
- **VIN chatbot** (the gorilla 🦍 in the bottom-right) → `POST /api/chat`
- Sticky bottom call/text bar with the domain
- Full SEO: `description`, `keywords`, `og:`, `twitter:`, `geo.region`, `canonical`
- `AutomotiveBusiness` JSON-LD with prices, hours, area served

## VIN chatbot — how alerts work

When a visitor sends a message in the VIN chat:

1. Worker receives `POST /api/chat` with `{ site, sessionId, message, timestamp }`
2. Stores it in the `SUBMISSIONS` KV namespace (90-day TTL) — if bound
3. Forwards a webhook to `ALERT_WEBHOOK` (Make.com / Zapier / your own endpoint)
   so you get **a real-time text or email** every time someone asks for help.
4. Returns a canned reply to the visitor

To wire it up:

```bash
# 1. Create a KV namespace once
wrangler kv namespace create SUBMISSIONS
# Paste the id into each site's wrangler.toml under [[kv_namespaces]]

# 2. Set the alert webhook (per-site OR globally)
#    Option A — globally in sites.json -> defaults.chatbot.alertWebhook
#    Option B — as a Cloudflare secret per site:
wrangler secret put ALERT_WEBHOOK  # paste your Make.com hook URL
```

The chat reply is currently rule-based (price/hours/scheduling keywords).
If you want a real LLM, plug Workers AI or Gemini into the `/api/chat`
handler — the seam is one function in the generated `worker.js`.

## Sites currently in `sites.json`

| ID | City | Domain | Theme |
|---|---|---|---|
| `mobilecarbsmoketest` | San Diego | mobilecarbsmoketest.com | san-diego-amber |
| `cleantruckcheck-roseville` | Roseville | cleantruckcheckroseville.com | sf-giants (orange/black) |
| `cleantruckcheck-fairfield` | Fairfield | cleantruckcheckfairfield.com | default-amber |
| `cleantruckcheck-stockton` | Stockton | cleantruckcheckstockton.com | default-amber |
| `cleantruckcheck-hayward` | Hayward | cleantruckcheckhayward.com | default-amber |
| `carb-clean-truck-check` | Statewide | carb-clean-truck-check.com | default-amber |
| `mobilecarbtest` | Statewide | mobilecarbtest.com | default-amber |
| `mobilesmoketest` | Statewide | mobilesmoketest.com | default-amber |

Several entries have `phone: "TBD"` — fill those in when you have a moment.

## Adding a new site

Copy any block in `sites.json` → `sites[]`, change `id`, `domain`, `city`,
`region`, `phone`, `phoneRaw`, `colors`. Run `node sites/build.mjs`. Done.

## Rules to never break this again

1. **Never edit `sites/dist/`** — it's regenerated every build.
2. **Never edit a deployed worker directly in the Cloudflare dashboard.** Edit `sites.json`, build, deploy.
3. **Phone, colors, and prices are independent fields.** Changing one cannot affect another.
4. **One commit = one source of truth** for every site, in git, diffable.
