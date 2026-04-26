# Citations — Why every design choice

Every SEO, AI-search, and E-E-A-T decision in this migration maps to an authoritative source. If Google, OpenAI, Anthropic, or CARB publishes the guidance, it's linked here.

---

## 1. AI Search / LLM Readiness

### robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended

**Why**: These are the named commercial LLM crawlers. `Google-Extended` is separate from `Googlebot` — it controls whether Google can use the content for AI Overviews and Gemini training. Blocking (or not explicitly allowing) these means your content is invisible to AI answer engines.

**Sources**:
- OpenAI GPTBot: https://platform.openai.com/docs/gptbot
- Anthropic ClaudeBot: https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity PerplexityBot: https://docs.perplexity.ai/guides/bots
- Google-Extended: https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
- Applebot-Extended: https://support.apple.com/en-us/119829

### `/llms.txt` and `/llms-full.txt`

**Why**: Community-proposed standard for a machine-readable site index (short) and full-text dump (long) tuned for LLM ingestion. Adopted by Anthropic, Cloudflare, Vercel, Perplexity, and others for their own docs. Reduces token cost for LLMs reading your site → more complete citations.

**Source**: https://llmstxt.org/

### Semantic HTML (`<main>`, `<article>`, `<section>`, one `<h1>` per page)

**Why**: LLMs and accessibility tools parse document structure to decide what content matters. A site built with `<div>` soup looks like noise to a crawler; a site built with semantic tags is pre-labeled.

**Source**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main

### Answer-first prose + standalone Q&A blocks

**Why**: LLMs extract and quote self-contained answer blocks. "A mobile CARB test costs $75 for OBD or $250 for OVI-J1667" is quotable. A paragraph that buries the answer after three sentences of context is not. This is the same mechanism Google uses for featured snippets.

**Source**: https://developers.google.com/search/docs/appearance/featured-snippets

---

## 2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

### Visible owner name + CARB credential ID + photo above the fold

**Why**: Google's Search Quality Rater Guidelines require human raters to identify *who is responsible for the website* and *the content creator's credentials*. Missing this lowers the rater score, which trains the ranking algorithm. For YMYL (Your Money or Your Life) categories — and government-regulated testing qualifies — this is a hard requirement.

**Sources**:
- Search Quality Rater Guidelines (PDF, §2.5 "Reputation of the Website or Content Creator"): https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf
- Google Developers E-E-A-T announcement: https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t

### `Person` schema with `hasCredential` → `EducationalOccupationalCredential` → `recognizedBy: GovernmentOrganization`

**Why**: The machine-readable version of "licensed by a real government body." Pairs Bryan Gillis (Person) → CARB Tester IF530523 (credential) → California Air Resources Board (recognizing authority). Google uses this to build the Knowledge Graph entry for the business.

**Sources**:
- Schema.org Person: https://schema.org/Person
- Schema.org EducationalOccupationalCredential: https://schema.org/EducationalOccupationalCredential
- Google Structured Data overview: https://developers.google.com/search/docs/appearance/structured-data

### `LocalBusiness` schema + Google Business Profile + Search Console all on the same domain

**Why**: Google fuses entity signals when GBP, Search Console property, and LocalBusiness schema all point at the same domain. Splitting them (GBP on `example.com` but site on `www.example.com` or `get.example.com`) dilutes the entity — Google can't tell if it's one business or two.

**Sources**:
- LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Site names in search: https://developers.google.com/search/docs/appearance/site-names
- Google Business Profile help: https://support.google.com/business/answer/9157481

### Service-area business (no street address published on GBP)

**Why**: Google explicitly supports businesses that serve customers at customer locations. Hiding the address on GBP is the *recommended* setting for mobile services — it doesn't hurt ranking, and it puts you in local results for every city in your service area. This is why "they won't accept my address" is a non-problem: don't publish one.

**Source**: https://support.google.com/business/answer/9157481

### NAP (Name-Address-Phone) consistency across site footer + GBP

**Why**: Inconsistent NAP is the most common cause of entity confusion in local search. Same business name, same phone format, same city spelling — everywhere.

**Source**: https://developers.google.com/search/docs/appearance/structured-data/local-business

---

## 3. Technical SEO

### Canonical tags, `sitemap.xml`, 301 redirects from old Squarespace URLs

**Why**: Prevents duplicate-content dilution during migration. Preserves inbound link equity.

**Source**: https://developers.google.com/search/docs/crawling-indexing/canonicalization/define-canonical

### `FAQPage` structured data

**Why**: Eligible for rich results in Google Search (expandable Q&A in SERP). Directly parsed by Google AI Overviews and ChatGPT for answer extraction.

**Source**: https://developers.google.com/search/docs/appearance/structured-data/faqpage

### Core Web Vitals — LCP < 2.5s, CLS < 0.1, INP < 200ms

**Why**: Google confirmed ranking signal since 2021. Static HTML on Cloudflare's edge network hits all three targets trivially — no framework, no build step, no JS hydration.

**Source**: https://web.dev/articles/vitals

---

## 4. Industry-Specific

### OVI-J1667 terminology instead of "smoke test"

**Why**: SAE J1667 is the international standard for opacity-based visible inspection. CARB documentation uses "OVI" (Opacity Visible Inspection). Using the official term ranks for compliance-literate searchers — fleet managers, DMV-referred customers, owner-operators who know what they need.

**Sources**:
- SAE J1667 standard: https://www.sae.org/standards/content/j1667_202111/
- CARB Heavy-Duty I&M program: https://ww2.arb.ca.gov/our-work/programs/heavy-duty-inspection-maintenance-hd-im

### CARB Clean Truck Check program references

**Source**: https://ww2.arb.ca.gov/our-work/programs/clean-truck-check-hd-im

---

## 5. Hosting & Editability

### Cloudflare Workers Static Assets (not inline HTML, not Cloudflare Pages)

**Why**: Free at this traffic tier (~$0/mo vs. $20/mo Squarespace). Custom domain + TLS included. Global edge caching out of the box. Bryan edits plain `.html` files in the GitHub web UI — no framework, no build step, no terminal.

**Source**: https://developers.cloudflare.com/workers/static-assets/
