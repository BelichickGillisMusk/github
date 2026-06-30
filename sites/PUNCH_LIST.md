# Chigbu Law — Pre-Launch Punch List

The site is **structurally complete**. Every blocker between today and going live with `chigbulaws.com` is listed here, organized by who can do it.

---

## 🟥 Blockers — must be resolved before flipping DNS

### 1. Real bio text from Clifford
- **What's there now:** A bio I wrote based on what the user told me ("Nigerian immigrant attorney, doesn't want photos of himself, dedicated to families")
- **Why it matters:** Attorney bios are personal — Clifford's voice should be his, not mine
- **Who:** **You + Clifford** — text from his current Squarespace About page, or a 5-min phone call where he tells you his story
- **How to fix:** Paste the real bio text into a message; I'll swap it into `sites.json` → `chigbulaws.aboutHtml` and rebuild
- **Status:** ☐

### 2. Real Google reviews (top 3-5)
- **What's there now:** The aggregate "★ 4.8 from 24 reviews" (real, from screenshot) plus a "click to read on Google" CTA, but no individual review text
- **Why it matters:** Real review quotes convert dramatically better than aggregates. Also they enable rich-result `Review` schema.
- **Who:** **You** — screenshot the Reviews tab on his Google Business Profile
- **How to fix:** Send 3-5 screenshots of the Reviews tab. I'll OCR them, add to `sites.json` → `chigbulaws.reviews[]`, and JSON-LD will pick them up automatically.
- **Bonus:** If you can also send his **Google Place ID** (find it at: https://developers.google.com/maps/documentation/places/web-service/place-id), I can wire up live API pulls instead of static snapshots.
- **Status:** ☐

### 3. Desk photo + office exterior photo
- **What's there now:** Photo-free design (per Clifford's request, but the desk photo from his GBP looks fine)
- **Why it matters:** Local trust signal, helps both directory listings and the site itself
- **Who:** **You** — long-press the photos on his Google Business Profile → Save to Photos → drag into chat
- **How to fix:** Upload here. I'll host them in the repo or on Cloudflare R2 and paste URLs into `chigbulaws.deskPhotoUrl` + `chigbulaws.officeExteriorPhotoUrl`
- **Status:** ☐

### 4. Year founded (for `LegalService` schema and directory listings)
- **Status:** ☐ — Ask Clifford the year he started the practice

### 5. Confirm or correct the practice areas
- **What's there now:** Family Law, Immigration, Personal Injury, Bankruptcy, Business & Contract Law (extracted from his Squarespace nav menu)
- **What I might be wrong about:** Whether "Business & Contract Law" is its own area or part of something else; whether he wants Bankruptcy displayed at all (some attorneys hide low-margin practices); whether there's a 6th area I missed
- **Who:** **Clifford or you confirming**
- **Status:** ☐ — review the rendered preview at sites/dist/chigbulaws/index.html and tell me yes/no/change

### 6. Resend (or MailChannels) email setup
- **What's there now:** Email fallback code is built and wired to email `chigbulaw@sbcglobal.net`. Just needs an API key set as a Cloudflare secret.
- **Why it matters:** This is the safety net for "if the agent is down" — every form goes to his email
- **Who:** You, or me if you give me Cloudflare access — see `sites/RESEND_SETUP.md`
- **Status:** ☐

---

## 🟧 Should-do before launch (high impact, fast)

### 7. Clear the placeholder bio
- The current `aboutHtml` is mine. Even if Clifford doesn't write a new one, replace it with something he's comfortable saying about himself.

### 8. Phone-verify the BARNUMBER link works
- Visit https://apps.calbar.ca.gov/attorney/Licensee/Detail/221386 once on a real phone — make sure the link resolves to Clifford's actual State Bar profile and not a 404. If 221386 is wrong (typo), update `sites.json`.
- **Status:** ☐

### 9. Record a 30-second voice memo from Clifford
- Use it as the basis for the OBI chatbot's tone of voice and the homepage bio
- A natural intro: "My name is Clifford Chigbu, I've been practicing law in Elk Grove for X years. My focus is helping families through divorce, custody, and immigration. I'd love to help you next."
- **Status:** ☐

### 10. Confirm "no fee unless we win" phrasing for PI
- California Rules of Professional Conduct require specific disclosures about contingency fees. I added a generic disclaimer to the footer. **Verify** with Clifford that the PI section's exact phrasing is OK before launch.
- **Status:** ☐

---

## 🟨 Nice-to-have before launch (post-launch is fine)

### 11. Custom 404 page
### 12. Schema for individual attorneys (if he ever adds an associate)
### 13. Privacy Policy + Terms of Service pages
- California (CCPA) requires a privacy policy on any site that collects info. The intake forms collect info. **Add this before launch.** I can generate a starter version — just say go.
- **Status:** ☐ — should probably be a blocker actually

### 14. Cookie consent banner
- Not required if we don't drop tracking cookies. Cloudflare Web Analytics is cookie-free. Only needed if we add GA4.

### 15. Backup of Squarespace before cutover
- Squarespace export → save XML in repo as `sites/archive/chigbulaws-squarespace-2026-XX-XX.xml`. Cheap insurance.

---

## 🟩 Done ✅

- ✅ Architecture: single source of truth, build script, vertical templates
- ✅ Domain: chigbulaws.com (kept inherited spelling, per decision)
- ✅ Phone, email, hours, address
- ✅ State Bar #221386 with verify link
- ✅ Award badge: Best of BusinessRate 2025
- ✅ 5 practice areas, each with its own URL, focused 6-question intake, area FAQ, JSON-LD
- ✅ Multi-page architecture (`/family/`, `/immigration/`, etc.)
- ✅ Quick contact form (front and center)
- ✅ Per-area intake forms (one per practice area)
- ✅ Reviews section with real Google aggregate (4.8/24)
- ✅ Get Directions button (deep-links to native Maps)
- ✅ "Read all on Google" + "Leave a review" buttons
- ✅ Service Areas section with 12 cities
- ✅ OBI chatbot with vertical-specific rule-based replies
- ✅ Email fallback (Resend → MailChannels → KV) for every submission
- ✅ Sitemap, robots.txt with explicit AI crawler welcome
- ✅ Schema: LegalService, FAQPage, QAPage, Review, AggregateRating, SearchAction, PostalAddress
- ✅ Blog system (markdown files → generated pages)
- ✅ Knowledge base with 49 Q&As + instant search module
- ✅ /llms.txt for ChatGPT/Claude/Perplexity
- ✅ Analytics hooks (Cloudflare Web Analytics, GA4, Plausible — set any/all)
- ✅ Mobile-first, fast (~30KB), accessible
- ✅ All in git, version-controlled, GitHub Actions deploy on push

---

## ☎️ Launch day runbook (when everything above is done)

1. Final preview: pull `sites/dist/chigbulaws/index.html` up on phone → sanity check
2. Cloudflare worker deploy: `wrangler deploy` (or wait for GitHub Actions)
3. Verify on `chigbulaws.silverback-agency.workers.dev` (or whatever the workers.dev URL is)
4. DNS cutover (see `sites/DNS_CUTOVER.md`)
5. Within 5 min: load chigbulaws.com on phone — should show new site
6. Within 1 hour: Clifford gets a test email from `/api/intake` to verify the email fallback works
7. Within 24 hours: submit sitemap to Google Search Console + Bing Webmaster Tools
8. Within 48 hours: claim Tier 1 directories from `sites/directories/chigbulaws.md`

---

*Last updated by Claude. Refresh this list as items get checked off.*
