# Migration Addendum — Gaps consolidated

Reconciles this plan with the parallel Manus checklist. Captures every item either side caught, plus things neither caught.

---

## A. Gaps Manus caught that we should add

### A1. MX records / email continuity (CRITICAL)

**Risk**: If `norcalcarbmobile.com` has email accounts (`bryan@`, `sales@`, etc.) hosted via Squarespace's Google Workspace integration or any other MX, **changing DNS will break email** unless MX records are preserved.

**Action before DNS flip**:
1. Run `dig norcalcarbmobile.com MX` and screenshot the output. These are the records that must continue working after cutover.
2. In Cloudflare DNS dashboard, recreate every MX record exactly. Do NOT proxy MX records (orange cloud OFF — grey cloud only for MX, TXT, SPF, DKIM, DMARC).
3. Also preserve: SPF (`TXT v=spf1 ...`), DKIM (`TXT default._domainkey...`), DMARC (`TXT _dmarc...`), and any `_acme-challenge` for Let's Encrypt.
4. **Test before flipping**: send a test email to `bryan@norcalcarbmobile.com` *before* changing nameservers. Confirm receipt. Then change nameservers.

**If email is Squarespace-hosted**: leaving Squarespace cancels the email plan. Migrate to Cloudflare Email Routing (free, forwards `@norcalcarbmobile.com` → personal Gmail) or Google Workspace direct (~$6/user/mo) **before** cancelling Squarespace.

### A2. Domain transfer to Cloudflare as registrar (optional, post-launch)

Manus suggests transferring the domain registration itself to Cloudflare. This is **not required for migration** — we just change nameservers — but worth doing later because:
- Cloudflare charges at-cost renewal (typically $9.77/yr for `.com` vs Squarespace's $25/yr).
- One vendor for DNS + registrar is simpler.

Sequence:
1. **Now**: change nameservers only (no transfer). Site goes live.
2. **+30 days post-launch**: initiate transfer (ICANN requires 60 days from any prior change).
3. Get auth code from current registrar (Squarespace), enter in Cloudflare, pay transfer fee (which adds 1 year of registration), confirm via email.

Not blocking the migration. Park as a follow-up.

---

## B. Things this plan has that Manus appears to lack

Don't lose these in the merge:

| Item | Why it matters |
|---|---|
| `Person` + `hasCredential` JSON-LD with CARB Tester IF530523 | E-E-A-T signal Google explicitly requires per Search Quality Rater Guidelines §2.5 |
| `LocalBusiness.location` array with Sacramento + Oakland | Google fuses both offices into one entity |
| `/llms.txt` + `/llms-full.txt` | AI search readiness (ChatGPT/Claude/Perplexity) |
| `robots.txt` allowlist for GPTBot/ClaudeBot/PerplexityBot/Google-Extended/Applebot-Extended/CCBot | Without this, AI engines can't quote the site |
| FAQPage schema with 13 self-contained Q&A | Eligible for Google rich results + AI extraction |
| Service-area-business GBP setting (no street address) | Correct configuration for mobile services per Google's own guidance |
| `CITATIONS.md` with sources for every design choice | Defensible — every decision is backed by a Google/OpenAI/Anthropic/CARB doc |
| 30+ post blog plan with cluster strategy | Programmatic SEO scaling |
| OVI-J1667 terminology throughout (not "smoke test") | Ranks for compliance-literate searchers (fleet managers) |

---

## C. Items NEITHER plan caught — add now

### C1. Cloudflare Turnstile on the contact form
**What**: Free CAPTCHA replacement, invisible by default. Ships with one `<script>` tag + secret in the worker.
**Why**: A `mailto:` link gets harvested. A real form gets spam. Turnstile blocks it without breaking UX.
**When**: Add when we wire up `/api/schedule` (post-launch).

### C2. Final Squarespace backup before DNS flip
**What**: Run `wget --mirror` one more time the morning of cutover. Commit to `workers/norcalcarbmobile/squarespace-snapshot-final/`.
**Why**: If something breaks 2 weeks after cutover, we have an exact byte-for-byte copy of what was live. (Wayback Machine is unreliable for missed pages.)

### C3. Wayback Machine "Save Page Now" for top 20 URLs
**What**: Submit each top-trafficked URL to https://web.archive.org/save/ before flipping DNS.
**Why**: Insurance. If a redirect drops a URL, the old version is preserved at archive.org — you can recover content and the URL keeps a snapshot for entity continuity.

### C4. Google Business Profile post-DNS verification
**What**: After DNS cuts over, log into GBP, click "Refresh" on the website link, confirm GBP can reach the new site at the same domain. Verify both Sacramento and Oakland listings.
**Why**: Sometimes GBP caches a 5xx response from the migration window and de-emphasizes the listing. Forcing a refresh fixes it.

### C5. NAP cross-update on directories
**What**: Update website link (and address mode if changing to service-area) on:
- Yelp
- BBB
- Google Business Profile (Sac + Oak both)
- Yellow Pages / Yellowpages.com
- Manta
- Foursquare
- Apple Business Connect
- Bing Places
**Why**: `sameAs` in our schema only fuses entity if the directory entries actually match. Stale directory entries with a different phone or address pull the entity apart.

### C6. CARB / state directory listings
**What**: If CARB or DMV publishes a list of licensed testers, ensure tester ID IF530523 lists `norcalcarbmobile.com`. Same for any compliance directories used by fleet managers.
**Why**: This is the highest-trust backlink possible — a `.gov` or `.ca.gov` link confirming the credential.

### C7. Plausible or GA4 added day-1
**What**: Pick analytics before launch. Plausible (~$9/mo, privacy-first, simple) or GA4 (free, complex). Add the script tag to all pages.
**Why**: Without it, the 30/60/90-day KPI table in `MIGRATION_PLAN.md` has no numbers. Search Console alone misses non-search traffic.

### C8. UptimeRobot or similar monitor
**What**: Free uptime monitor pinging `https://norcalcarbmobile.com/` every 5 minutes. Alerts to Bryan's phone on 4xx/5xx.
**Why**: Cloudflare is reliable, but a wrangler.toml typo could 502 the site overnight. Alert in 5 minutes, not 5 days.

### C9. Cancellation reminder for Squarespace (calendar item)
**What**: 7 days post-launch → confirm new site is solid → cancel Squarespace subscription.
**Why**: Easy to forget. $20/mo bleed.

---

## D. Stylistic decisions Bryan needs to make (current vs Manus proposal)

Manus is suggesting a redesign brief (charcoal background, safety-green/yellow CTAs, Inter/Roboto fonts). The current build uses Navy `#002244` + Red `#C60C30` + system fonts.

| Decision | Current (this branch) | Manus proposal | Recommendation |
|---|---|---|---|
| Background | White `#ffffff` | Charcoal `#0f1b2e` | Charcoal-on-dark looks tougher / industrial. Navy header on white body (current) loads faster and reads better in sunlight on mobile (truck cabs!). **Stick with current** unless you specifically want a dark-mode look. |
| Hero text color | Navy on white | White on charcoal | Same trade-off. Truck drivers searching on bright phones favor light backgrounds. |
| CTA color | Red `#C60C30` | Safety green/yellow | Red has higher conversion globally per CRO research. Safety green/yellow signals "compliance/industrial" — on-brand for CARB. **Either works**; pick by gut. |
| Font | System fonts | Inter or Roboto | System = faster (no FOUT, no extra request). Inter = more modern look. **Stick with system** for Core Web Vitals. |

If you want the charcoal/safety-green look, one CSS file change flips it — we're not locked in.

---

## E. Updated cutover checklist (combined)

### Phase 1: Pre-flip (this week)
- [x] Branch with home + CSS + wrangler + worker pushed
- [ ] Push remaining pages (about, services, areas, faq, contact, privacy, terms, 404)
- [ ] Push SEO/config (sitemap, llms, _redirects, _headers, robots)
- [ ] Push blog hub placeholder + first 10 pillar posts
- [ ] Run final `wget --mirror` of Squarespace site → commit to `squarespace-snapshot-final/`
- [ ] Submit top 20 URLs to Wayback Machine
- [ ] **CRITICAL**: screenshot current MX/TXT/DKIM/DMARC records via `dig`
- [ ] Decide email plan: Cloudflare Email Routing (free, forward to Gmail) or Google Workspace (paid)
- [ ] Add Plausible or GA4 script

### Phase 2: Cutover (the day)
- [ ] Merge migration branch → main → GitHub Actions deploys to `*.workers.dev`
- [ ] QA the preview URL (every link, every form CTA)
- [ ] In Cloudflare dashboard: add `norcalcarbmobile.com` as a site (if not already)
- [ ] Add nameservers from Cloudflare to Squarespace's domain settings
- [ ] **Recreate all MX/SPF/DKIM/DMARC records in Cloudflare DNS — grey cloud only**
- [ ] Send test email → confirm delivery
- [ ] Uncomment `routes = [...]` in `wrangler.toml` → commit → Cloudflare attaches custom domain
- [ ] Verify SSL (Cloudflare Universal SSL auto-provisions — check `https://norcalcarbmobile.com/`)
- [ ] Spot-check 20 old URLs return 301 → 200

### Phase 3: Post-flip (Day 0–7)
- [ ] Resubmit `sitemap.xml` to Google Search Console
- [ ] Refresh website link in both GBP listings (Sac + Oak)
- [ ] Update website link on Yelp, BBB, Bing Places, Apple Business Connect
- [ ] PageSpeed Insights check — LCP/CLS/INP green
- [ ] Set up UptimeRobot monitor
- [ ] Calendar reminder: cancel Squarespace +7 days

### Phase 4: +30 days
- [ ] Initiate domain transfer Squarespace → Cloudflare (saves ~$15/yr renewal)
- [ ] First KPI check vs. baseline (organic clicks, indexed pages, position)
- [ ] Wire up `/api/schedule` with native Google Calendar integration + Turnstile
- [ ] Publish remaining blog posts (Cluster B, D, F, G)

---

*Source review: this addendum incorporates the Manus migration checklist (Phase 2: Domain Transfer; Phase 3: Post-Migration; Part 2: Redesign Brief) plus items neither plan originally caught.*
