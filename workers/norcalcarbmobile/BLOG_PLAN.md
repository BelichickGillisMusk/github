# Blog plan — Easy to edit, content-plentiful

## Goal

A blog that:
1. **Is easy** — Bryan edits one HTML file per post in the GitHub web UI. No CMS, no admin, no database.
2. **Has plenty of content** — 30+ posts at launch, growing to 50+ in 90 days. Every post ranks for a real CARB search query.

## Why not Squarespace's built-in blog?

Bryan is leaving Squarespace. Keeping the blog there means still paying for a platform we're supposed to be off of. Moving it here means:
- All content on the same domain (entity signals stay consolidated)
- Free (Cloudflare Workers Static Assets)
- Version history built in (GitHub)
- Edit from a phone in the GitHub app

## File structure

```
public/blog/
  index.html                              # Blog hub — lists all posts with excerpts
  what-is-the-clean-truck-check/
    index.html
  obd-vs-ovi-j1667-which-do-i-need/
    index.html
  carb-penalties-deadlines-2026/
    index.html
  [slug]/
    index.html
```

Every post follows the same HTML template — header, article, footer. Bryan only edits the `<article>` body.

## Per-post template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>{Post Title} | NorCal CARB Mobile Blog</title>
  <meta name="description" content="{140-160 char summary}">
  <link rel="canonical" href="https://norcalcarbmobile.com/blog/{slug}/">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "{Post Title}",
    "datePublished": "2026-04-21",
    "dateModified": "2026-04-21",
    "author": { "@id": "https://norcalcarbmobile.com/#bryan" },
    "publisher": { "@id": "https://norcalcarbmobile.com/#business" },
    "mainEntityOfPage": "https://norcalcarbmobile.com/blog/{slug}/"
  }
  </script>
</head>
<body>
  {standard header}
  <main>
    <article>
      <h1>{Post Title}</h1>
      <p class="meta">By Bryan Gillis &middot; Licensed CARB Tester IF530523 &middot; Published {date}</p>
      {POST BODY — THE ONLY THING BRYAN EDITS}
    </article>
    <aside>
      <h2>Related</h2>
      {3 links to related posts}
    </aside>
  </main>
  {standard footer}
</body>
</html>
```

Bryan's editing surface shrinks to just the `<article>` body. He can write `<h2>` and `<p>` tags or paste from Word — everything else stays the same.

## Content plan — 30+ seed posts

### Cluster A: "What is" pillars (drives top-of-funnel SEO)
1. What is the CARB Clean Truck Check?
2. What is OBD testing for heavy-duty trucks?
3. What is OVI-J1667 (opacity visible inspection)?
4. What is HD-OBD reporting?
5. What is the CARB Periodic Smoke Inspection Program (PSIP)?
6. What is CARB fleet compliance?

### Cluster B: "How to" guides (drives mid-funnel)
7. How to prepare your truck for a CARB test
8. How to read a CARB OBD test result
9. How to pass OVI-J1667 on the first try
10. How to schedule a mobile CARB test at your yard
11. How to set up a CARB account for your fleet
12. How to report HD-OBD data to CARB

### Cluster C: Deadlines & penalties (drives urgency searches)
13. CARB Clean Truck Check deadlines for 2026
14. CARB penalties for non-compliance (daily fines explained)
15. DMV registration holds for failed CARB tests
16. CARB phase-in schedule by vehicle weight

### Cluster D: Vehicle-specific (long-tail)
17. CARB testing for motorhomes and RVs
18. CARB testing for agricultural diesel equipment
19. CARB testing for Class 8 semi-trucks
20. CARB testing for dump trucks and construction vehicles
21. CARB testing for school buses

### Cluster E: City + service pages (programmatic SEO)
22. Mobile CARB test near me — Sacramento guide
23. Mobile CARB test near me — Stockton guide
24. Mobile CARB test near me — Oakland guide
25. Mobile CARB test near me — Modesto guide
26. [+ 15 more cities]

### Cluster F: Comparisons (AI-search gold)
27. OBD vs OVI-J1667 — which does my truck need?
28. Mobile CARB test vs shop visit — cost, time, hassle
29. BIT vs CARB — what's the difference?
30. CARB vs DMV smog — do I need both?

### Cluster G: Glossary + FAQ expansions
31. CARB Q&A glossary (100+ term dictionary)
32. Clean Truck Check FAQ (expanded, 30+ Q&A)

## Post sources

1. **Squarespace WordPress export** (when Bryan uploads `.xml` to `squarespace-import/`): parse and convert existing posts 1:1. Preserve slug if it ranks; 301 if not.
2. **Net new** (written by Claude, reviewed by Bryan): Cluster A–G above, using real CARB documentation + pricing.
3. **Programmatic from city pages**: every city landing page can be cross-posted as a blog with more depth.

## How Bryan adds a new post

1. Go to `github.com/BelichickGillisMusk/github/tree/main/workers/norcalcarbmobile/public/blog`
2. Click **Add file → Create new file**
3. Name it `slug-here/index.html` (the slash creates the folder)
4. Copy any existing post as a template; change title, date, body
5. Commit — auto-deploys in 30 seconds

He can also edit from the GitHub mobile app.

## SEO discipline

Every post:
- Has a unique `<title>` under 60 characters
- Has a unique `<meta description>` 140–160 characters
- Has exactly one `<h1>`
- Has `BlogPosting` schema with Bryan as author (fuses with Person/hasCredential entity)
- Links to at least 2 other internal pages (service or city)
- Opens with the answer in the first paragraph (LLM-quotable)
- Has a clear CTA at the bottom (call or request)

## Blog hub (`/blog/`)

- Lists all posts, newest first
- Shows title + 160-char excerpt + date
- `Blog` schema
- Categorized by cluster (A–G) after we have 30+ posts

## Timeline

- **Week 1**: Seed 10 pillar posts (Clusters A + C) — foundation
- **Week 2**: Import all Squarespace posts via XML
- **Week 3**: City posts (Cluster E) — 15–20
- **Week 4**: Remaining clusters (B, D, F, G)

Total at 30-day mark: **50+ posts**. Every one ranking-ready.
