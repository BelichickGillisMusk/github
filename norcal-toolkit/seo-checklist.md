# NorCal Carb Mobile — SEO Checklist

> **Site:** norcalcarbmobile.com (Squarespace)
> **Satellite sites:** carbteststockton.com, mobilecarbsmoketest.com (Cloudflare Workers)
> **CARB Tester ID:** IF530523
> **Generated:** 2026-03-19 (V2) · Updated 2026-04-14 (V3: video shorts)
> **Goal:** Dominate local search + LLM/AI search for mobile CARB emissions testing in NorCal

---

## 0. Progress Summary — V1 → V2 → V3

- **V1 (OG plan, prior session):** General SEO foundation — mostly done ✓
- **V2 (this file, sections 1–13):** Checklist expansion — **mostly done, maintain it**
- **V3 (new, section 14):** Video shorts pipeline for LLM/AI search — **focus here**

> **👉 If V1/V2 items are complete, jump straight to [Section 14: Video Shorts for LLM/AI Search](#14-video-shorts-for-llmai-search).**

---

## 1. Quick Wins (Do These First)

- [ ] Claim and fully optimize Google Business Profile (see Section 2)
- [ ] Set up Google Search Console — verify ownership, submit XML sitemap
- [ ] Rewrite homepage `<title>` tag: *"Mobile CARB Emissions Testing | OBD & OVI Tests | Sacramento & NorCal"*
- [ ] Rewrite homepage meta description: *"BAR-licensed mobile diesel emissions testing in Sacramento, Stockton, Roseville & NorCal. OBD tests $75, OVI tests $85. We come to your fleet."*
- [ ] Replace placeholder `GOOGLE_REVIEW_LINK` in `config.py` line 81 with your real Google Place ID
- [ ] Run `python3 05_review_request.py batch-review` for all past clients to kick-start reviews
- [ ] Start running `python3 daily_workflow.py` every morning (automates social posting + review requests)
- [ ] Publish first blog post using the OBD testing outline already in the toolkit:
  ```
  python3 05_review_request.py blog --topic "OBD testing"
  ```

---

## 2. Google Business Profile (Local SEO Foundation)

- [ ] Set primary category: "Emissions Inspection Station" (or closest match)
- [ ] Add secondary categories: "Diesel Engine Repair Service", "Vehicle Inspection"
- [ ] Mark as service-area business (no storefront) — set service radius
- [ ] Add all 7 service areas: Sacramento, Stockton, Roseville, Elk Grove, Modesto, East Bay, Vallejo
- [ ] Write keyword-rich business description mentioning: mobile CARB testing, OBD, OVI, Clean Truck Check, HD I/M, fleet testing, Sacramento, NorCal
- [ ] Add service list with prices: OBD Test ($75), OVI Test ($85), Smoke Opacity ($85), Fleet Discount (10% off 5+ vehicles)
- [ ] Upload photos: testing equipment, truck being tested, Bryan on-site, branded vehicle/gear
- [ ] Add booking/call CTA button
- [ ] Post weekly GBP updates using toolkit:
  ```
  python3 05_review_request.py social --type tip
  python3 05_review_request.py social --type job_done --city Sacramento --tests 6
  ```
- [ ] Enable messaging in GBP settings
- [ ] Add Q&A — pre-populate with common fleet owner questions

---

## 3. Technical SEO

- [ ] Run Google PageSpeed Insights — target score 90+ on mobile
- [ ] Verify HTTPS active with no mixed content warnings
- [ ] Generate and submit XML sitemap to Google Search Console
- [ ] Verify `robots.txt` allows crawling of all public pages
- [ ] Set up Bing Webmaster Tools and verify
- [ ] Add structured data (JSON-LD) — `LocalBusiness` schema with:
  - Business name, phone, email, service area
  - Opening hours, price range
  - `Service` schema for each test type (OBD, OVI, Smoke Opacity)
- [ ] Add `FAQPage` schema to any page with FAQ sections
- [ ] Run Google Mobile-Friendly Test — fix any issues
- [ ] Fix all crawl errors and 404s reported in Search Console
- [ ] Add canonical tags to all pages
- [ ] Compress all images — add descriptive alt text (e.g., *"mobile OBD emissions test on diesel truck in Sacramento yard"*)
- [ ] Ensure clean URL structure (no query strings, no duplicate pages)
- [ ] Set up 301 redirects for any old/broken URLs
- [ ] Add Open Graph and Twitter Card meta tags for social sharing

---

## 4. On-Page SEO — Homepage

- [ ] H1: Single clear heading — *"Mobile CARB Emissions Testing for NorCal Fleets"*
- [ ] Naturally include all service keywords in body copy: OBD test, OVI test, smoke opacity, Clean Truck Check, HD I/M, CARB compliance, mobile smog testing
- [ ] Add a visible pricing section: $75 OBD / $85 OVI / $85 Smoke Opacity / 10% fleet discount
- [ ] Add a service area section listing all 7 cities with links to city landing pages
- [ ] Strong CTA above the fold with phone number and "Schedule Your Fleet Test" button
- [ ] Add trust signals: BAR license number, number of trucks tested, years in business
- [ ] Add a testimonials/reviews section pulling from Google reviews
- [ ] Internal link to each service page and city landing page
- [ ] Add a brief "How It Works" section: 1) Call/Book → 2) We Come to You → 3) Results to CARB Same Day
- [ ] Footer: full NAP (Name, Address, Phone), links to all pages, social profile links

---

## 5. Service Pages (Create 4 Pages)

### `/obd-testing/`
- [ ] Title: *"OBD Emissions Test for Diesel Trucks | Mobile Testing | NorCal Carb Mobile"*
- [ ] Target keyword: "OBD test truck California"
- [ ] 500+ words: what OBD is, which vehicles need it, how often (2x/year now, 4x/year Oct 2027), what happens if you fail, pricing ($75), mobile advantage
- [ ] Add FAQ section with `FAQPage` schema
- [ ] CTA: phone number + booking link

### `/ovi-testing/`
- [ ] Title: *"OVI Opacity & Visual Inspection | Pre-2013 Diesel Vehicles | NorCal Carb Mobile"*
- [ ] Target keyword: "OVI test California diesel"
- [ ] 500+ words: what OVI covers (SAE J1667 snap-idle + visual), which vehicles (pre-2013), frequency, pricing ($85)
- [ ] Add FAQ section with schema
- [ ] CTA: phone number + booking link

### `/smoke-opacity-test/`
- [ ] Title: *"Smoke Opacity Test for Heavy-Duty Vehicles | NorCal Carb Mobile"*
- [ ] Target keyword: "smoke opacity test California"
- [ ] 500+ words: test procedure, pass/fail thresholds, pricing ($85), on-site testing
- [ ] CTA: phone number + booking link

### `/fleet-testing/`
- [ ] Title: *"Fleet Emissions Testing | Volume Discounts | On-Site Mobile Testing"*
- [ ] Target keyword: "fleet emissions testing Sacramento"
- [ ] 500+ words: fleet scheduling, volume pricing (10% off 5+ vehicles), quarterly contract options, zero downtime advantage, CARB 2027 quarterly mandate prep
- [ ] Add fleet size calculator or table: 10 trucks = X/year, 50 trucks = X/year
- [ ] CTA: "Get a Fleet Quote" + phone number

---

## 6. City Landing Pages (Create 7 Pages)

Each page needs unique content — not copy-paste with city name swapped.

- [ ] `/sacramento-mobile-emissions-testing/` — mention Sac Metro fleets, I-5/I-80 corridor, local fleet hubs
- [ ] `/stockton-diesel-emissions-testing/` — mention Port of Stockton, Central Valley ag haulers — **NOTE:** carbteststockton.com already exists as a Cloudflare Worker; link to it or consolidate content
- [ ] `/roseville-carb-testing/` — mention Roseville/Placer County construction fleets, industrial parks
- [ ] `/elk-grove-mobile-emissions-testing/` — mention south Sacramento corridor, distribution centers
- [ ] `/modesto-fleet-emissions-testing/` — mention Stanislaus County ag fleets, dairy haulers, Central Valley
- [ ] `/east-bay-mobile-carb-testing/` — mention Oakland Port, East Bay logistics, I-880 corridor fleets
- [ ] `/vallejo-diesel-smog-testing/` — mention Mare Island area, North Bay fleets, Solano County

**Each city page should include:**
- [ ] City name in title tag, H1, meta description, and URL
- [ ] 400+ words of unique locally-relevant content
- [ ] Embedded Google Map of the service area
- [ ] CTA with phone number
- [ ] Internal links to service pages and blog posts

---

## 7. Content / Blog Strategy

### Publish the 3 blog posts already outlined in the toolkit:
- [ ] **"What Is an OBD Test and When Does Your Truck Need One?"** — `python3 05_review_request.py blog --topic "OBD testing"`
- [ ] **"OVI vs OBD Testing: What's the Difference for Your Fleet?"** — `python3 05_review_request.py blog --topic "OVI vs OBD"`
- [ ] **"CARB 2027 Quarterly Testing Mandate: What Fleet Owners Need to Know"** — `python3 05_review_request.py blog --topic "CARB 2027 quarterly testing"`

### New blog topics to write:
- [ ] "How Much Does CARB Emissions Testing Cost in California?" — commercial intent keyword
- [ ] "What Happens If You Fail a CARB Emissions Test?" — informational/anxiety keyword
- [ ] "Mobile vs Station Smog Testing: Why Fleet Owners Are Switching" — comparison keyword
- [ ] "CARB HD I/M Program Explained: What Every Truck Owner Needs to Know" — explainer
- [ ] "Top 5 Reasons Diesel Trucks Fail Emissions Tests" — list post, shareable
- [ ] "Sacramento Fleet Compliance Checklist for 2026" — local + year keyword
- [ ] "Do Out-of-State Trucks Need CARB Testing in California?" — FAQ keyword

### Content cadence:
- [ ] Publish 2 blog posts per month minimum
- [ ] Each post: 800–1,500 words, one primary keyword, internal links to service/city pages
- [ ] Add a blog index page with categories (compliance, testing types, fleet tips)
- [ ] Add author bio (Bryan) with photo for E-E-A-T signals

---

## 8. Review Generation (use `05_review_request.py`)

- [ ] Configure real Google review link in `config.py` — replace `YOUR_PLACE_ID`
- [ ] Run `python3 05_review_request.py batch-review` daily via `daily_workflow.py` step 8
- [ ] Send manual requests for high-value fleet clients:
  ```
  python3 05_review_request.py review "Company Name" --email "joe@fleet.com" --phone "(916) 555-0101"
  ```
- [ ] Goal: 5+ new Google reviews per month
- [ ] Respond to every Google review (positive and negative) within 24 hours
- [ ] Add review snippets/testimonials to homepage and service pages
- [ ] Set up review monitoring alerts (Google Business Profile notifications)

---

## 9. Social Media SEO Signals (use `05_review_request.py social`)

- [ ] Set up profiles: Facebook Business, Instagram Business, LinkedIn Company Page
- [ ] Ensure NAP and website link are consistent across all social bios
- [ ] Post 3–5x per week using toolkit templates:
  ```
  python3 05_review_request.py social --type job_done --city Sacramento --tests 4
  python3 05_review_request.py social --type tip
  python3 05_review_request.py social --type behind_scenes --city Stockton
  python3 05_review_request.py social --type milestone
  ```
- [ ] Daily social post runs automatically in `daily_workflow.py` step 6
- [ ] Share every new blog post on all social channels
- [ ] Use local hashtags: #SacramentoFleet #NorCalTrucking #CARBCompliance #CleanTruckCheck #MobileSmogTesting
- [ ] Engage with local fleet/trucking accounts — comment, share, build relationships

---

## 10. Link Building & Citations

### Local directories:
- [ ] Yelp Business listing
- [ ] BBB (Better Business Bureau)
- [ ] Angi / HomeAdvisor
- [ ] Thumbtack
- [ ] Apple Maps Connect
- [ ] Bing Places for Business
- [ ] MapQuest Business
- [ ] Foursquare / Swarm
- [ ] YellowPages / Superpages

### Industry directories:
- [ ] TruckPaper
- [ ] FleetOwner directory
- [ ] CARB-related listings and resources
- [ ] BAR (Bureau of Automotive Repair) licensed station directory

### NAP consistency:
- [ ] Audit all listings — Name, Address, Phone must match GBP exactly everywhere
- [ ] Use a tool like BrightLocal or Moz Local to monitor citation consistency

### Authority links:
- [ ] Join Sacramento Metro Chamber of Commerce (backlink + credibility)
- [ ] Join California Trucking Association or similar trade group
- [ ] Reach out to local fleet management blogs for guest posts
- [ ] Partner with diesel repair shops for mutual referral links — the lead scraper already finds these:
  ```
  python3 01_lead_scraper.py
  ```
- [ ] Monitor backlink profile via Google Search Console → Links report

---

## 11. Satellite Sites (Cloudflare Workers)

You already have city-specific microsites deployed as Cloudflare Workers. These need SEO attention too.

### carbteststockton.com
- [ ] Verify Google Search Console ownership for carbteststockton.com
- [ ] Submit sitemap (or ensure single-page is indexed)
- [ ] Create separate Google Business Profile for Stockton service area — phone: (209) 818-1371
- [ ] Ensure title tag and meta description are optimized for "Stockton CARB emissions testing"
- [ ] Cross-link from norcalcarbmobile.com Stockton landing page to carbteststockton.com and vice versa
- [ ] Add CARB Tester ID (IF530523) as a trust signal on the page
- [ ] Collect Stockton-specific Google reviews

### mobilecarbsmoketest.com (San Diego)
- [ ] Verify Google Search Console ownership for mobilecarbsmoketest.com
- [ ] Create Google Business Profile for San Diego service area — phone: (619) 786-4328
- [ ] Optimize title/meta for "San Diego mobile CARB emissions testing"
- [ ] Add structured data (LocalBusiness schema)
- [ ] Build local citations for San Diego area
- [ ] Cross-link strategically (but don't over-link — different service areas)

### Clean Truck Check Lodi
- [ ] Verify deployment and indexing
- [ ] Create Google Business Profile for Lodi/San Joaquin area
- [ ] Optimize for "Lodi CARB emissions testing" / "San Joaquin diesel testing"

---

## 12. Competitor Analysis

- [ ] Search "mobile emissions testing Sacramento" — identify top 3–5 ranking competitors
- [ ] Search "CARB testing near me" — note who ranks in map pack and organic
- [ ] For each competitor, analyze:
  - [ ] Title tags and meta descriptions
  - [ ] Number and depth of service pages
  - [ ] Blog content (topics, frequency, word count)
  - [ ] Google review count and rating
  - [ ] Backlink profile (use free tools: Ahrefs free, Ubersuggest, or Search Console)
- [ ] Identify content gaps — most competitors likely lack city-specific landing pages and educational blog content
- [ ] Target keywords where competitors rank but have thin/weak content

---

## 13. Tracking & Measurement

- [ ] Set up Google Analytics 4 on norcalcarbmobile.com
- [ ] Set up GA4 conversion events: phone clicks, form submissions, booking button clicks
- [ ] Set up call tracking (CallRail, WhatConverts, or GA4 phone click events at minimum)
- [ ] Monitor Google Search Console weekly: impressions, clicks, CTR, average position
- [ ] Track keyword rankings for primary terms:
  - "mobile emissions testing Sacramento"
  - "CARB testing near me"
  - "OBD test truck California"
  - "fleet emissions testing NorCal"
  - "mobile smog testing [city]" for each service area
- [ ] Set up monthly reporting: first Monday of each month, review all metrics
- [ ] Track lead source: ask every caller *"How did you find us?"*
- [ ] Compare month-over-month: organic traffic, phone calls, review count, keyword positions

---

## 14. Video Shorts for LLM/AI Search

**Goal:** Get NorCal Carb Mobile cited by Google AI Overviews, Perplexity, Bing Copilot, and ChatGPT search when users ask CARB-related questions. Long explainer videos are invisible to LLMs; question-focused 30–60 sec shorts with full transcripts are citation gold.

**Prereq (one-time Mac setup):**
```bash
brew install ffmpeg
pip3 install openai-whisper
```

**Run the pipeline on your big explainer video:**
- [ ] Put the long explainer video somewhere on your Mac (e.g. `~/Movies/carb-explainer.mp4`)
- [ ] From repo root:
  ```
  python3 youtube-push/push.py ~/Movies/carb-explainer.mp4
  ```
  (add `--srt captions.srt` if you already exported captions from Squarespace — much faster)
- [ ] Review generated clips in `youtube-push/data/<video_name>/`:
  - 1080×1920 vertical MP4s with burned-in captions
  - Per-clip `*_metadata.json` with question-style title + YouTube description + TikTok caption + VideoObject JSON-LD schema

**Posting cadence:**
- [ ] YouTube Shorts: **3/week** (Mon, Wed, Fri) — run `python3 youtube-push/05_upload_queue.py next` for the next one
- [ ] TikTok: same clip **24 hours after** YouTube (stagger — algorithms penalize simultaneous cross-post)
- [ ] After each post: `python3 youtube-push/05_upload_queue.py mark <clip_id> --platform youtube --url <url>`

**Squarespace integration:**
- [ ] For each short embedded on a service/blog page, paste the `video_schema` JSON-LD into the page's Code Injection (header) — tells Google it's a `VideoObject` with full transcript
- [ ] Link each YouTube Shorts description to the matching norcalcarbmobile.com blog post
- [ ] Add YouTube channel + TikTok profile links to GBP and site footer

**Measure LLM citations (every 2 weeks):**
- [ ] Ask Perplexity: *"Who does mobile CARB testing in Sacramento?"*
- [ ] Ask ChatGPT (with web search): *"What is the CARB 2027 quarterly testing rule?"*
- [ ] Check Google AI Overviews for: *"mobile OBD test California"*, *"OVI vs OBD test"*
- [ ] Screenshot any NorCal Carb Mobile citations; track in `youtube-push/data/llm_citations_log.md`

---

## Bot Command Reference

| Task | Command |
|------|---------|
| Daily full workflow | `python3 norcal-toolkit/daily_workflow.py` |
| Generate social post | `python3 norcal-toolkit/05_review_request.py social --type tip` |
| Generate blog outline | `python3 norcal-toolkit/05_review_request.py blog --topic "topic"` |
| Send review request | `python3 norcal-toolkit/05_review_request.py review "Company" --email "x" --phone "x"` |
| Batch review requests | `python3 norcal-toolkit/05_review_request.py batch-review` |
| Scrape new leads | `python3 norcal-toolkit/01_lead_scraper.py` |
| Send cold emails | `python3 norcal-toolkit/02_cold_emailer.py --send --tier 1 --sequence 1` |
| Check CRM pipeline | `python3 norcal-toolkit/03_crm_tracker.py status` |
| Today's follow-ups | `python3 norcal-toolkit/03_crm_tracker.py due` |
| Check overdue invoices | `python3 norcal-toolkit/04_invoice_generator.py overdue` |
| **Chop video into shorts** | `python3 youtube-push/push.py ~/Movies/video.mp4` |
| **Next clip to post** | `python3 youtube-push/05_upload_queue.py next` |
| **Mark clip posted** | `python3 youtube-push/05_upload_queue.py mark clip_01 --platform youtube --url <url>` |
| **List all clips + status** | `python3 youtube-push/05_upload_queue.py list` |
