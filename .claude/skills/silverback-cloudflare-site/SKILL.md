---
name: silverback-cloudflare-site
description: Add, edit, or migrate a single-page website to Cloudflare Workers under the Silverback Agency account, following the Silverback "single source of truth" pattern. TRIGGER when the user mentions adding a new site, migrating a site (e.g. from Squarespace, Wix, WordPress), changing colors/phone/prices on an existing Silverback site, deploying a Cloudflare Worker, or wants a one-page brochure site for any of their businesses (CARB sites, Chick Boo Law Firm, DMC Properties, etc.).
---

# Silverback Cloudflare Single-Page Site Skill

This skill codifies the **only** correct way to add or modify a Silverback-owned single-page website on Cloudflare Workers. Following it prevents the cross-contamination problem where editing one field (phone, color) accidentally drifts another field (prices) on a different site.

## Account context

- **Cloudflare account**: Silverback Agency (`bafa242dd95d3fdce72540d20accd0a2`)
- **GitHub repo**: `belichickgillismusk/github`
- **GitHub secret**: `CLOUDFLARE_API_TOKEN` is configured
- **Source of truth lives in git** — never edit a deployed worker directly in the Cloudflare dashboard

## Architecture (the pattern that works)

```
sites/
  sites.json              ← single source of truth: every field for every site
  templates/
    carb.html             ← template for CARB smoke-test sites
    law.html              ← template for law firm sites (Chick Boo, etc.)
    <vertical>.html       ← one template per business vertical
  build.mjs               ← generates sites/dist/<id>/{index.html, worker.js, wrangler.toml, sitemap.xml, robots.txt}
  dist/                   ← AUTO-GENERATED, never hand-edit
```

Each site in `sites.json` has its own object with **independent fields**:
- `id`, `domain`, `vertical` (which template to use), `city`/`region`
- `phone`, `phoneRaw`
- `colors` (`primary`, `primaryDark`, `accent`, `background`, `text`, `muted`)
- vertical-specific fields (CARB: `prices.obd`, `prices.ovi`; Law: `practiceAreas`, `barNumbers`, `consultationFee`; etc.)
- `chatbot` (name, avatar, greeting, alertWebhook) — VIN for CARB, named per-vertical otherwise
- `faq` array
- Sister-site cross-links auto-generated from siblings of the same `vertical`

`build.mjs` substitutes `{{TOKENS}}` in the chosen template and writes a **self-contained worker** with the HTML embedded inline (NO KV dependency for content — that was the old breakage source).

## Deployment

GitHub Actions workflow `.github/workflows/deploy-sites.yml` builds and deploys every site in `sites/dist/` via a matrix on push. Adding a new site to `sites.json` automatically gets it deployed on the next push — no workflow edits.

## Workflow: change a field on an existing site

1. Open `sites/sites.json`
2. Find the site by `id` or `domain`
3. Edit the **single field** the user asked about (phone, color, price, etc.)
4. `node sites/build.mjs` (verifies tokens substitute cleanly)
5. Commit and push
6. GitHub Actions deploys automatically

**Never** touch any other field. **Never** edit `sites/dist/`. **Never** edit a deployed worker in the dashboard.

## Workflow: add a brand-new site (e.g., new CARB city)

1. Append a new object to `sites.json` → `sites[]`
2. Required fields: `id`, `domain`, `vertical`, `city`, `region`, `phone`, `phoneRaw`, `colors`
3. Optional: override defaults (`prices`, `chatbot`, `faq`, `tagline`)
4. `node sites/build.mjs`
5. Commit and push — Actions deploys via wrangler matrix
6. **One-time manual step**: in Cloudflare dashboard, attach the custom domain (DNS + worker route). Future deploys reuse that route.

## Workflow: migrate a site from Squarespace / Wix / WordPress / etc.

This is the **brochure-site migration playbook**. Use it for things like Chick Boo Law Firm.

1. **Identify the vertical** (law, real estate, restaurant, agency, etc.). If a template doesn't exist yet, create `sites/templates/<vertical>.html` based on `carb.html` as a starting point. Templates should be:
   - Mobile-first, single-page, fast (no framework runtime, ~30KB total)
   - Accessible (semantic HTML, contrast, alt text)
   - SEO-loaded (`<title>`, `description`, `keywords`, `og:`, `twitter:`, `geo.region`, `canonical`, JSON-LD `LocalBusiness` or `LegalService` etc., FAQ schema)
   - Themed via CSS variables consumed from `sites.json` colors
   - Always include the chatbot widget (per-vertical name, e.g. "VIN" for CARB, "BARRY" for law firm), sticky bottom CTA, sister-site grid (auto-filtered to same vertical)

2. **Scrape the existing site** for content: services, hours, address, attorney names, practice areas, testimonials, contact info, photos. Use WebFetch or ask the user for raw text. Don't copy verbatim — rewrite for clarity and SEO.

3. **Add to sites.json** under a new vertical-specific schema. Add a `defaults` block for the vertical if it's the first site.

4. **Run build, commit, push**. Verify on the `*.workers.dev` URL.

5. **Cut over DNS**: in Cloudflare dashboard, add the domain as a Cloudflare zone (or update existing zone), then add a worker route `<domain>/*` pointing at the new worker. If the domain is currently on Squarespace nameservers, get the user to switch nameservers to Cloudflare's first.

6. **Verify SSL** (Cloudflare auto-issues), check mobile rendering, test the chatbot and contact form.

## Vertical-specific notes

### CARB sites (current)
- Prices fields: `prices.obd` (2013+ OBD test), `prices.ovi` (2012 & older smoke opacity)
- Chatbot: **VIN** 🦍 — knowledge base from `cleantruckcheck.arb.ca.gov`, **strict guardrails** (only diesel/CARB topics, refuse everything else, always promote our phone/email not CARB's contact)
- Existing sites: see `sites/sites.json`

### Law firm sites (Chick Boo Law Firm, future)
- Required fields: `practiceAreas[]`, `attorneys[]` (name, bar#, photo), `consultationFee`, `address`, `hours`
- JSON-LD type: `LegalService` not `AutomotiveBusiness`
- **Compliance**: every page needs an attorney advertising disclaimer in the footer ("This is attorney advertising. Past results do not guarantee future outcomes.") and specifies the jurisdiction
- Chatbot name: pick something on-brand (e.g., "BARRY" for the bar, or just "Chick Boo Assistant"). Same guardrail philosophy: only law-related questions, refuse everything else, always end with the firm's phone + intake link, never recommend a competitor.
- Add a "Free consultation" form prominently — that's the conversion event for law firms.

### Real estate sites (DMC Properties, future)
- Vertical: `real-estate`
- Fields: `propertyTypes[]`, `serviceAreas[]`, `licenseNumbers[]`
- JSON-LD: `RealEstateAgent`

### Generic landing pages
- Vertical: `landing`
- Minimum fields: `headline`, `subheadline`, `cta`, `phone`, `colors`

## Contact + alert flow (every site)

- All sites have `/api/book` (form submissions) and `/api/chat` (chatbot messages)
- Both POST handlers persist to KV namespace `SUBMISSIONS` (90-day TTL) if bound
- Both forward to `ALERT_WEBHOOK` env var (Make.com / Zapier / SMS gateway) so the user gets a real-time alert
- Set the webhook globally in `defaults.chatbot.alertWebhook` in `sites.json`, OR per-site, OR via `wrangler secret put ALERT_WEBHOOK` for sensitive ones

## Hard rules

1. **Never edit `sites/dist/`** — regenerated every build
2. **Never edit a deployed Cloudflare worker in the dashboard**
3. **Never put pricing or contact info inside the template** — only in sites.json
4. **Never share contact info across verticals** — Chick Boo's phone must never appear on a CARB site
5. **Always rebuild and commit before pushing** — `node sites/build.mjs` must succeed
6. **One commit per logical change** so blame is meaningful
7. **Chatbot guardrails are non-negotiable** — every chatbot must refuse off-topic questions and always surface the site's own contact info, never a third-party (like CARB's) unless the user literally asks for it by name

## When in doubt

- The user is `belichickgillismusk` on GitHub
- The Cloudflare account is "Silverbackai Agency"
- Read `sites/README.md` in the repo for the project-specific quick reference
- Read `CLAUDE.md` at the repo root for the architecture overview
- If the user says "the [city] site is broken", they mean the file `sites/sites.json` entry with that `city` — go there first, fix the field, rebuild, push
