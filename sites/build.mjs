#!/usr/bin/env node
// build.mjs — Generates one self-contained HTML + Cloudflare Worker per site.
//
// SOURCE OF TRUTH: sites/sites.json
// TEMPLATES:       sites/templates/<vertical>.html  (carb, law, ...)
// BLOG CONTENT:    sites/content/<site-id>/blog/*.md
//
// Output per site:
//   sites/dist/<site-id>/index.html
//   sites/dist/<site-id>/worker.js          (HTML + blog all embedded; NO KV for content)
//   sites/dist/<site-id>/wrangler.toml
//   sites/dist/<site-id>/sitemap.xml
//   sites/dist/<site-id>/robots.txt
//
// Run:  node sites/build.mjs

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = join(ROOT, 'dist');
const TEMPLATES = join(ROOT, 'templates');
const CONTENT = join(ROOT, 'content');

const config = JSON.parse(readFileSync(join(ROOT, 'sites.json'), 'utf8'));
const defaults = config.defaults;
const verticalDefaults = config.verticalDefaults || {};

// ---------- helpers ----------
const htmlEscape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function businessNameHtml(name) {
  const words = name.split(' ');
  if (words.length < 2) return htmlEscape(name);
  const before = words[0];
  const accent = words[1];
  const after = words.slice(2).join(' ');
  return `${htmlEscape(before)} <span class="accent">${htmlEscape(accent)}</span>${after ? '<br>' + htmlEscape(after) : ''}`;
}

function phoneLast4(phone) {
  const d = String(phone).replace(/\D/g, '');
  return d.slice(-4) || phone;
}

function faqHtml(faq) {
  return faq.map(i => `<details><summary>${htmlEscape(i.q)}</summary><p>${htmlEscape(i.a)}</p></details>`).join('\n      ');
}

function faqJsonLd(faq) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(i => ({
      "@type": "Question",
      "name": i.q,
      "acceptedAnswer": { "@type": "Answer", "text": i.a }
    }))
  });
}

function sisterLinksHtml(currentId, allSites, vertical) {
  return allSites
    .filter(s => s.id !== currentId && (s.vertical || 'carb') === vertical)
    .map(s => `<a href="https://${s.domain}/" rel="noopener"><strong>${htmlEscape(s.city)}</strong><small>${htmlEscape(s.domain)}</small></a>`)
    .join('\n        ');
}

// ---------- minimal Markdown ----------
function md(text) {
  // Tiny inline markdown — sufficient for blog posts. Headings, paragraphs, bold, italic, links, lists.
  const lines = text.split('\n');
  const out = [];
  let inList = false;
  for (let line of lines) {
    if (/^### (.*)/.test(line)) { if (inList) { out.push('</ul>'); inList = false; } out.push(`<h3>${htmlEscape(RegExp.$1)}</h3>`); continue; }
    if (/^## (.*)/.test(line))  { if (inList) { out.push('</ul>'); inList = false; } out.push(`<h2>${htmlEscape(RegExp.$1)}</h2>`); continue; }
    if (/^# (.*)/.test(line))   { if (inList) { out.push('</ul>'); inList = false; } out.push(`<h1>${htmlEscape(RegExp.$1)}</h1>`); continue; }
    if (/^- (.*)/.test(line))   { if (!inList) { out.push('<ul>'); inList = true; } out.push(`<li>${inline(RegExp.$1)}</li>`); continue; }
    if (line.trim() === '')     { if (inList) { out.push('</ul>'); inList = false; } continue; }
    if (inList) { out.push('</ul>'); inList = false; }
    out.push(`<p>${inline(line)}</p>`);
  }
  if (inList) out.push('</ul>');
  return out.join('\n');
}
function inline(s) {
  return htmlEscape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: m[2] };
}

function loadBlog(siteId) {
  const dir = join(CONTENT, siteId, 'blog');
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  const posts = files.map(f => {
    const raw = readFileSync(join(dir, f), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const slug = f.replace(/\.md$/, '');
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      author: meta.author || '',
      excerpt: meta.excerpt || '',
      html: md(body),
    };
  });
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return posts;
}

// ---------- law-vertical helpers ----------
function intakeFieldHtml(field) {
  const req = field.required ? ' required' : '';
  if (field.type === 'textarea') return `<label>${htmlEscape(field.label)}<textarea name="${field.name}" rows="3"${req}></textarea></label>`;
  if (field.type === 'select') {
    const opts = field.options.map(o => `<option value="${htmlEscape(o)}">${htmlEscape(o)}</option>`).join('');
    return `<label>${htmlEscape(field.label)}<select name="${field.name}"${req}><option value="">— select —</option>${opts}</select></label>`;
  }
  return `<label>${htmlEscape(field.label)}<input name="${field.name}" type="${field.type || 'text'}"${req}></label>`;
}

function practiceCardsHtml(areas) {
  return areas.map(a => {
    const cta = a.id === 'personal-injury' ? 'Free PI consult →' : 'Start confidential intake →';
    return `<a class="practice-card" href="/${htmlEscape(a.id)}/"><h3>${htmlEscape(a.name)}</h3><p>${htmlEscape(a.blurb)}</p><span class="cta">${cta}</span></a>`;
  }).join('\n    ');
}

// Per-area intake form, used on /<area>/ pages
function intakeFormHtml(area, attorneyShortName) {
  const fields = area.intake.map(intakeFieldHtml).join('\n        ');
  const isPI = area.id === 'personal-injury';
  const submitLabel = isPI ? 'Get my free consultation' : 'Submit confidential intake';
  const okName = attorneyShortName || 'Mr. Chigbu';
  return `<form class="intake-form" data-area="${htmlEscape(area.id)}" style="background:rgba(255,255,255,0.04);border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:14px;">
        ${fields}
        <label>Your name<input name="client_name" required></label>
        <label>Phone<input name="client_phone" type="tel" required></label>
        <label>Email<input name="client_email" type="email" required></label>
        <button type="submit" class="btn primary block">${submitLabel}</button>
        <div class="ok" hidden style="color:#7BE7A2;">✓ Received. ${htmlEscape(okName)} will be in touch shortly.</div>
      </form>`;
}

// Home page no longer renders all intakes inline — practice area cards link to /<area>/
function intakeFormsHtml() { return ''; }

function navPracticeLinksHtml(areas) {
  return areas.map(a => `<a href="/${htmlEscape(a.id)}/">${htmlEscape(a.name)}</a>`).join('\n    ');
}

function bulletsHtml(bullets) {
  return `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:10px;margin-top:14px;">${(bullets||[]).map(b => `<li style="padding-left:24px;position:relative;color:var(--text);"><span style="position:absolute;left:0;color:var(--accent);font-weight:700;">✓</span>${htmlEscape(b)}</li>`).join('')}</ul>`;
}

function processStepsHtml(steps) {
  return `<div style="display:grid;grid-template-columns:1fr;gap:14px;margin-top:14px;">${(steps||[]).map(s => `<div style="background:rgba(255,255,255,0.04);border-left:3px solid var(--accent);padding:16px 18px;border-radius:0 8px 8px 0;"><div style="color:var(--accent);font-family:-apple-system,sans-serif;font-weight:700;margin-bottom:4px;">${htmlEscape(s.step)}</div><div style="color:var(--muted);">${htmlEscape(s.text)}</div></div>`).join('')}</div>`;
}

function reviewAvgHtml(reviews) {
  if (!reviews || !reviews.length) return '';
  const avg = (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1);
  const stars = '★★★★★';
  return `<div style="display:flex;align-items:center;gap:10px;margin-top:8px;font-family:-apple-system,sans-serif;"><span style="color:var(--accent);font-size:24px;letter-spacing:2px;">${stars}</span><strong style="font-size:20px;color:var(--text);">${avg}</strong><span style="color:var(--muted);font-size:14px;">(${reviews.length} reviews)</span></div>`;
}

function legalServiceJsonLd(site) {
  const obj = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": site.firmName || site.businessName || site.domain,
    "telephone": site.phone || 'TBD',
    "email": site.email || undefined,
    "url": `https://${site.domain}/`,
    "image": site.ogImage || undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": site.streetAddress || undefined,
      "addressLocality": site.city || undefined,
      "addressRegion": "CA",
      "postalCode": site.postalCode || undefined,
      "addressCountry": "US",
    },
    "areaServed": site.serviceAreas && site.serviceAreas.length
      ? site.serviceAreas.map(a => ({ "@type": "City", "name": a + ", CA" }))
      : (site.region || site.city),
    "founder": { "@type": "Person", "name": site.attorneyName || site.firmName },
    "knowsLanguage": site.languages || ["English"],
    "priceRange": "$$",
  };
  if (site.awards && site.awards.length) {
    obj.award = site.awards.map(a => `${a.title} ${a.year}${a.subtitle ? ' — ' + a.subtitle : ''}`);
  }
  if (site.reviews && site.reviews.length) {
    const avg = (site.reviews.reduce((s, r) => s + (r.rating || 5), 0) / site.reviews.length);
    obj.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avg.toFixed(1),
      "reviewCount": site.reviews.length,
      "bestRating": "5",
      "worstRating": "1",
    };
    obj.review = site.reviews.map(r => ({
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": String(r.rating || 5), "bestRating": "5" },
      "author": { "@type": "Person", "name": r.author || "Google reviewer" },
      "reviewBody": r.text,
    }));
  }
  // Strip undefined values for cleaner JSON
  return JSON.stringify(obj, (k, v) => v === undefined ? undefined : v);
}

function serviceAreasHtml(areas) {
  if (!areas || !areas.length) return '';
  const chips = areas.map(a => `<span style="display:inline-block;padding:8px 14px;background:rgba(212,162,76,0.12);border:1px solid rgba(212,162,76,0.35);color:var(--text);border-radius:999px;font-size:13px;font-family:-apple-system,sans-serif;">📍 ${htmlEscape(a)}</span>`).join(' ');
  return `<div style="margin-top:18px;display:flex;flex-wrap:wrap;gap:8px;">${chips}</div>`;
}

function awardsHtml(awards) {
  if (!awards || !awards.length) return '';
  const cards = awards.map(a => `<div style="display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,rgba(212,162,76,0.18),rgba(212,162,76,0.06));border:1px solid var(--accent);padding:10px 16px;border-radius:999px;font-family:-apple-system,sans-serif;"><span style="color:var(--accent);font-size:18px;">🏆</span><span style="color:var(--text);font-weight:700;font-size:13px;line-height:1.3;">${htmlEscape(a.title)} ${a.year}</span><span style="color:var(--muted);font-size:12px;">· ${htmlEscape(a.subtitle || '')}</span></div>`).join(' ');
  return `<div style="margin-top:18px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">${cards}</div>`;
}

function analyticsHtml(site) {
  const parts = [];
  // Cloudflare Web Analytics — free, privacy-respecting, no cookies
  if (site.cloudflareAnalyticsToken) {
    parts.push(`<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${site.cloudflareAnalyticsToken}"}'></script>`);
  }
  // Google Analytics 4 — only if explicitly configured
  if (site.googleAnalyticsId) {
    parts.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${site.googleAnalyticsId}"></script>`);
    parts.push(`<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.googleAnalyticsId}');</script>`);
  }
  // Plausible — privacy-first, EU-hosted option
  if (site.plausibleDomain) {
    parts.push(`<script defer data-domain="${site.plausibleDomain}" src="https://plausible.io/js/script.js"></script>`);
  }
  return parts.join('\n');
}

function smallReviewsHtml(reviews, limit = 2) {
  if (!reviews || !reviews.length) return '';
  return reviews.slice(0, limit).map(r => `<blockquote style="background:rgba(255,255,255,0.04);border-left:3px solid var(--accent);padding:14px 18px;border-radius:0 6px 6px 0;font-style:italic;color:var(--text);margin-bottom:10px;"><div style="color:var(--accent);font-family:-apple-system,sans-serif;font-style:normal;letter-spacing:2px;font-size:13px;">${'★'.repeat(r.rating || 5)}</div>${htmlEscape(r.text)}<footer style="margin-top:8px;font-size:12px;color:var(--muted);font-style:normal;font-family:-apple-system,sans-serif;">— ${htmlEscape(r.author || 'Google reviewer')}</footer></blockquote>`).join('');
}

// ---------- per-area page (full HTML doc, no external template needed) ----------
function lawAreaPageHtml(site, area) {
  const c = site.colors;
  const phone = site.phone || 'TBD';
  const phoneRaw = site.phoneRaw || 'TBD';
  const firmName = site.firmName || 'Law Firm';
  const attorneyName = site.attorneyName || firmName;
  const shortName = site.attorneyShortName || attorneyName.split(' ')[0];
  const isPI = area.id === 'personal-injury';
  const titleSuffix = isPI ? 'Free Consultation' : 'Confidential Intake';
  const consultBadge = isPI ? '✓ Free consultation · No fee unless we win' : '✓ Confidential · 6 quick questions · ~90 seconds';
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<meta name="theme-color" content="${c.background}">
<title>${htmlEscape(area.name)} Lawyer in ${htmlEscape(site.city || 'California')} — ${htmlEscape(firmName)}</title>
<meta name="description" content="${htmlEscape(area.areaSubhead || area.blurb)} Call ${phone}. ${titleSuffix}.">
<meta name="keywords" content="${htmlEscape(area.name)} lawyer ${htmlEscape(site.city || '')}, California ${htmlEscape(area.name)} attorney, ${htmlEscape(firmName)}, ${htmlEscape(attorneyName)}">
<link rel="canonical" href="https://${site.domain}/${area.id}/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="${htmlEscape(site.city || '')}">
<meta property="og:title" content="${htmlEscape(area.name)} — ${htmlEscape(firmName)}">
<meta property="og:description" content="${htmlEscape(area.areaSubhead || area.blurb)}">
<meta property="og:url" content="https://${site.domain}/${area.id}/">
<meta property="og:type" content="website">
<style>
:root{--primary:${c.primary};--primary-dark:${c.primaryDark};--accent:${c.accent};--bg:${c.background};--text:${c.text};--muted:${c.muted};--max-w:760px;}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:Georgia,"Times New Roman",serif;line-height:1.6;-webkit-font-smoothing:antialiased;padding-bottom:100px;}
h1,h2,h3{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;}
nav.top{position:sticky;top:0;z-index:50;background:var(--primary-dark);border-bottom:1px solid rgba(255,255,255,0.08);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;}
nav.top .brand{color:var(--accent);font-weight:800;font-size:18px;text-decoration:none;font-family:-apple-system,sans-serif;letter-spacing:0.5px;}
nav.top button.menu-btn{background:none;border:none;color:var(--text);font-size:26px;cursor:pointer;padding:4px 8px;}
nav.top .menu-panel{display:none;position:absolute;top:100%;right:0;left:0;background:var(--primary-dark);border-bottom:2px solid var(--accent);padding:12px 0;}
nav.top .menu-panel.open{display:block;}
nav.top .menu-panel a{display:block;padding:14px 24px;color:var(--text);text-decoration:none;font-family:-apple-system,sans-serif;border-bottom:1px solid rgba(255,255,255,0.05);}
nav.top .menu-panel a:hover{background:rgba(255,255,255,0.05);color:var(--accent);}
.crumb{padding:14px 24px;max-width:var(--max-w);margin:0 auto;color:var(--muted);font-size:13px;font-family:-apple-system,sans-serif;}
.crumb a{color:var(--accent);text-decoration:none;}
.area-hero{padding:30px 24px 20px;max-width:var(--max-w);margin:0 auto;}
.area-hero .badge{display:inline-block;background:rgba(212,162,76,0.15);color:var(--accent);padding:6px 14px;border-radius:999px;font-size:13px;font-family:-apple-system,sans-serif;font-weight:600;margin-bottom:14px;}
.area-hero h1{font-size:34px;line-height:1.2;margin-bottom:14px;color:var(--text);}
.area-hero p.lede{font-size:18px;color:var(--muted);}
section{padding:30px 24px;max-width:var(--max-w);margin:0 auto;}
section h2{font-size:24px;margin-bottom:8px;color:var(--accent);}
section p{color:var(--muted);font-size:16px;}
.btn{display:inline-block;padding:16px 28px;border-radius:6px;font-weight:700;text-decoration:none;font-family:-apple-system,sans-serif;font-size:16px;border:2px solid var(--accent);cursor:pointer;}
.btn.primary{background:var(--accent);color:var(--primary-dark);}
.btn.outline{background:transparent;color:var(--accent);}
.btn.block{display:block;width:100%;text-align:center;}
form.intake-form label{display:flex;flex-direction:column;gap:6px;font-family:-apple-system,sans-serif;font-size:14px;color:var(--muted);}
form.intake-form input,form.intake-form select,form.intake-form textarea{background:rgba(0,0,0,0.3);color:var(--text);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:12px;font-size:15px;font-family:inherit;}
details{background:rgba(255,255,255,0.04);border-radius:8px;padding:14px 18px;margin-bottom:8px;cursor:pointer;}
details summary{font-weight:600;color:var(--text);list-style:none;font-family:-apple-system,sans-serif;}
details summary::-webkit-details-marker{display:none;}
details summary::after{content:" +";color:var(--accent);float:right;}
details[open] summary::after{content:" –";}
details p{margin-top:8px;color:var(--muted);font-size:14px;}
footer{background:var(--primary-dark);border-top:2px solid var(--accent);padding:30px 24px 20px;margin-top:60px;color:var(--muted);font-size:13px;text-align:center;font-family:-apple-system,sans-serif;}
footer .firm{color:var(--accent);font-weight:700;font-size:16px;margin-bottom:8px;}
footer .disclaimer{margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;line-height:1.5;max-width:600px;margin-left:auto;margin-right:auto;}
.sticky-cta{position:fixed;bottom:0;left:0;right:0;background:var(--accent);color:var(--primary-dark);text-align:center;padding:16px;text-decoration:none;font-weight:700;font-family:-apple-system,sans-serif;box-shadow:0 -4px 16px rgba(0,0,0,0.3);z-index:40;padding-bottom:calc(16px + env(safe-area-inset-bottom));}
</style></head><body>

<nav class="top">
  <a href="/" class="brand">${htmlEscape(firmName)}</a>
  <button class="menu-btn" id="menuBtn">☰</button>
  <div class="menu-panel" id="menuPanel">
    <a href="/">Home</a>
    <a href="/#about">About</a>
    ${(site.practiceAreas||[]).map(a => `<a href="/${htmlEscape(a.id)}/">${htmlEscape(a.name)}</a>`).join('\n    ')}
    <a href="/#reviews">Reviews</a>
    <a href="/blog/">Blog</a>
    <a href="/#contact">Contact &amp; Directions</a>
    <a href="tel:${phoneRaw}">📞 ${phone}</a>
  </div>
</nav>

<div class="crumb"><a href="/">${htmlEscape(firmName)}</a> · ${htmlEscape(area.name)}</div>

<header class="area-hero">
  <div class="badge">${consultBadge}</div>
  <h1>${htmlEscape(area.areaHeadline || area.name)}</h1>
  <p class="lede">${htmlEscape(area.areaSubhead || area.blurb)}</p>
</header>

<section id="form">
  <h2>${isPI ? 'Free consultation request' : 'Quick intake — 6 questions'}</h2>
  <p style="margin-bottom:14px;">Takes about 90 seconds. Confidential.</p>
  ${intakeFormHtml(area, shortName)}
</section>

<section>
  <h2>What I can help with</h2>
  ${bulletsHtml(area.bullets)}
</section>

<section>
  <h2>How it works</h2>
  ${processStepsHtml(area.process)}
</section>

<section>
  <h2>What clients say</h2>
  ${reviewAvgHtml(site.reviews)}
  <div style="margin-top:14px;">${smallReviewsHtml(site.reviews, 2)}</div>
  <p style="margin-top:14px;"><a href="${site.googleReviewsUrl || directionsUrl(site)}" target="_blank" rel="noopener" style="color:var(--accent);">★ Read all reviews on Google →</a></p>
</section>

<section>
  <h2>Common ${htmlEscape(area.name.toLowerCase())} questions</h2>
  ${(area.areaFaq||[]).map(f => `<details><summary>${htmlEscape(f.q)}</summary><p>${htmlEscape(f.a)}</p></details>`).join('')}
</section>

<section style="text-align:center;">
  <h2>Ready to talk?</h2>
  <p style="margin-bottom:18px;">Call ${phone} or email <a href="mailto:${site.email}" style="color:var(--accent);">${site.email}</a></p>
  <a class="btn primary" href="tel:${phoneRaw}">📞 Call ${phone}</a>
</section>

<footer>
  <div class="firm">${htmlEscape(firmName)}</div>
  <div>${htmlEscape(attorneyName)} · State Bar of California #${site.barNumber || 'TBD'}</div>
  <div>📞 ${phone} · ✉️ ${site.email || ''}</div>
  <div><a href="/" style="color:var(--accent)">Home</a> · <a href="/blog/" style="color:var(--accent)">Blog</a></div>
  <div class="disclaimer">${htmlEscape(site.disclaimer || (verticalDefaults.law && verticalDefaults.law.disclaimer) || '')}</div>
</footer>

<a class="sticky-cta" href="tel:${phoneRaw}">📞 Talk to ${htmlEscape(shortName)} · ${phone}</a>

<script>
const menuBtn=document.getElementById('menuBtn');
const menuPanel=document.getElementById('menuPanel');
menuBtn.addEventListener('click',()=>menuPanel.classList.toggle('open'));
document.querySelectorAll('form.intake-form').forEach(form=>{
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    const data=Object.fromEntries(new FormData(this).entries());
    data.site="${site.id}";
    data.area=this.dataset.area;
    data.timestamp=new Date().toISOString();
    try{await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}catch(err){}
    const ok=this.querySelector('.ok');
    if(ok)ok.hidden=false;
    this.reset();
  });
});
</script>

<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": firmName,
  "serviceType": area.name,
  "telephone": phone,
  "email": site.email,
  "url": `https://${site.domain}/${area.id}/`,
  "areaServed": site.region || site.city,
  "founder": { "@type": "Person", "name": attorneyName },
  "aggregateRating": site.reviews && site.reviews.length ? {
    "@type": "AggregateRating",
    "ratingValue": (site.reviews.reduce((s, r) => s + (r.rating || 5), 0) / site.reviews.length).toFixed(1),
    "reviewCount": site.reviews.length
  } : undefined
})}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": (area.areaFaq||[]).map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
})}
</script>
${analyticsHtml(site)}
</body></html>`;
}

// Generic style for intake form labels (injected once via <style> in worker)
const LAW_FORM_STYLE = `<style>
form.intake-form label { display:flex; flex-direction:column; gap:6px; font-family:-apple-system,sans-serif; font-size:14px; color: var(--muted); }
form.intake-form input, form.intake-form select, form.intake-form textarea {
  background: rgba(0,0,0,0.3); color: var(--text); border:1px solid rgba(255,255,255,0.15);
  border-radius:8px; padding:12px; font-size:15px; font-family:inherit;
}
section#intakes h2 { margin-top: 30px; }
</style>`;

// ---------- render ----------
function pickTemplate(vertical) {
  const carbLegacy = join(ROOT, 'template.html');
  const path = join(TEMPLATES, `${vertical}.html`);
  if (existsSync(path)) return readFileSync(path, 'utf8');
  if (vertical === 'carb' && existsSync(carbLegacy)) return readFileSync(carbLegacy, 'utf8');
  throw new Error(`No template for vertical "${vertical}" at ${path}`);
}

function applyTokens(template, tokens) {
  let html = template;
  for (const [k, v] of Object.entries(tokens)) {
    html = html.replaceAll(`{{${k}}}`, String(v ?? ''));
  }
  return html;
}

function commonTokens(site, vDef) {
  const chatbot = site.chatbot ?? vDef?.chatbot ?? defaults.chatbot ?? { name: 'VIN', avatar: '🦍', greeting: 'Hi!' };
  const faq = site.faq ?? defaults.faq ?? [];
  return {
    ID: site.id,
    DOMAIN: site.domain,
    CITY: site.city || '',
    REGION: site.region || '',
    PHONE: site.phone || 'TBD',
    PHONE_RAW: site.phoneRaw || 'TBD',
    PHONE_LAST4: phoneLast4(site.phone || ''),
    EMAIL: site.email || '',
    HOURS: site.hours || '',
    PRIMARY: site.colors.primary,
    PRIMARY_DARK: site.colors.primaryDark,
    ACCENT: site.colors.accent,
    BACKGROUND: site.colors.background,
    TEXT: site.colors.text,
    MUTED: site.colors.muted,
    CHAT_NAME: chatbot.name,
    CHAT_AVATAR: chatbot.avatar,
    CHAT_GREETING: chatbot.greeting.replace(/"/g, '\\"'),
    FAQ_HTML: faqHtml(faq),
    FAQ_JSONLD: faqJsonLd(faq),
  };
}

function renderCarbSite(site, allSites) {
  const obd = site.prices?.obd ?? defaults.prices.obd;
  const ovi = site.prices?.ovi ?? defaults.prices.ovi;
  const businessName = site.businessName ?? defaults.businessName;
  const tokens = {
    ...commonTokens(site, null),
    BUSINESS_NAME: businessName,
    BUSINESS_NAME_HTML: businessNameHtml(businessName),
    TAGLINE: site.tagline ?? defaults.tagline,
    OBD_LABEL: site.obdLabel ?? defaults.obdLabel,
    OVI_LABEL: site.oviLabel ?? defaults.oviLabel,
    OBD_PRICE: obd,
    OVI_PRICE: ovi,
    MOTORHOME_NOTE: site.motorhomeNote ?? defaults.motorhomeNote,
    SISTER_LINKS_HTML: sisterLinksHtml(site.id, allSites, 'carb'),
    ANALYTICS_HTML: analyticsHtml(site),
  };
  const template = pickTemplate('carb');
  const html = applyTokens(template, tokens);
  const leftover = html.match(/\{\{[A-Z_]+\}\}/g);
  if (leftover) throw new Error(`[${site.id}] unreplaced tokens: ${[...new Set(leftover)].join(', ')}`);
  return html;
}

function reviewsHtml(reviews) {
  if (!reviews || !reviews.length) return '<p style="color:var(--muted);font-style:italic;">Reviews coming soon — check us on Google.</p>';
  return reviews.map(r => {
    const stars = '★'.repeat(r.rating || 5) + '☆'.repeat(5 - (r.rating || 5));
    return `<blockquote style="background:rgba(255,255,255,0.04);border-left:4px solid var(--accent);padding:18px 20px;border-radius:0 8px 8px 0;font-style:italic;color:var(--text);"><div style="color:var(--accent);font-family:-apple-system,sans-serif;font-style:normal;letter-spacing:2px;margin-bottom:8px;">${stars}</div>${htmlEscape(r.text)}<footer style="margin-top:10px;font-size:13px;color:var(--muted);font-style:normal;font-family:-apple-system,sans-serif;">— ${htmlEscape(r.author || 'Google reviewer')}</footer></blockquote>`;
  }).join('\n    ');
}

function directionsUrl(site) {
  if (site.googleMapsUrl) return site.googleMapsUrl;
  const dest = encodeURIComponent(site.addressForMaps || site.address || `${site.city || ''}, CA`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

function renderLawSite(site, allSites) {
  const vDef = verticalDefaults.law || {};
  const firmName = site.firmName || vDef.businessName || 'Law Firm';
  const tokens = {
    ...commonTokens(site, vDef),
    FIRM_NAME: firmName,
    ATTORNEY_NAME: site.attorneyName || firmName,
    EYEBROW: site.eyebrow || site.city || '',
    HEADLINE: site.headline || 'Practical legal help when you need it most.',
    SUBHEADLINE: site.subheadline || 'Free, confidential first consultation.',
    TAGLINE: site.headline || '',
    META_DESCRIPTION: site.metaDescription || '',
    KEYWORDS: site.keywords || '',
    ABOUT_HTML: site.aboutHtml || '<p>About text coming soon.</p>',
    ADDRESS_HTML: htmlEscape(site.address || ''),
    BAR_ADMISSIONS: site.barAdmissions || '',
    BAR_NUMBER: site.barNumber || 'TBD',
    LANGUAGES_JSON: JSON.stringify(site.languages || ['English']),
    DISCLAIMER: site.disclaimer || vDef.disclaimer || '',
    PRACTICE_CARDS_HTML: practiceCardsHtml(site.practiceAreas || []),
    INTAKE_FORMS_HTML: intakeFormsHtml(),
    NAV_PRACTICE_LINKS: navPracticeLinksHtml(site.practiceAreas || []),
    AVG_RATING_HTML: reviewAvgHtml(site.reviews),
    REVIEWS_HTML: reviewsHtml(site.reviews),
    DIRECTIONS_URL: directionsUrl(site),
    GOOGLE_BUSINESS_URL: site.googleBusinessUrl || directionsUrl(site),
    GOOGLE_REVIEWS_URL: site.googleReviewsUrl || site.googleBusinessUrl || directionsUrl(site),
    GOOGLE_REVIEW_WRITE_URL: site.googleReviewWriteUrl || (site.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${site.googlePlaceId}` : (site.googleBusinessUrl || directionsUrl(site))),
    LEGAL_SERVICE_JSONLD: legalServiceJsonLd(site),
    ANALYTICS_HTML: analyticsHtml(site),
    AWARDS_HTML: awardsHtml(site.awards),
    SERVICE_AREAS_HTML: serviceAreasHtml(site.serviceAreas),
  };
  let html = applyTokens(pickTemplate('law'), tokens);
  // Inject form style once before </head>
  html = html.replace('</head>', `${LAW_FORM_STYLE}\n</head>`);
  const leftover = html.match(/\{\{[A-Z_]+\}\}/g);
  if (leftover) throw new Error(`[${site.id}] unreplaced tokens: ${[...new Set(leftover)].join(', ')}`);
  return html;
}

function renderSite(site, allSites) {
  const vertical = site.vertical || 'carb';
  if (vertical === 'law') return renderLawSite(site, allSites);
  return renderCarbSite(site, allSites);
}

// ---------- blog rendering (law sites only for now) ----------
function blogIndexHtml(site, posts) {
  const list = posts.map(p =>
    `<article style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><h3 style="margin-bottom:6px;"><a href="/blog/${htmlEscape(p.slug)}/" style="color:var(--accent);text-decoration:none;">${htmlEscape(p.title)}</a></h3><div style="color:var(--muted);font-size:13px;font-family:-apple-system,sans-serif;">${htmlEscape(p.date)}${p.author ? ' · ' + htmlEscape(p.author) : ''}</div><p style="color:var(--muted);margin-top:8px;">${htmlEscape(p.excerpt || '')}</p></article>`
  ).join('\n  ');
  return blogShell(site, 'Blog', `<main style="max-width:760px;margin:0 auto;padding:40px 24px;"><h1 style="color:var(--accent);font-family:-apple-system,sans-serif;margin-bottom:20px;">Blog</h1>${posts.length ? list : '<p style="color:var(--muted);">No posts yet.</p>'}<p style="margin-top:30px;"><a href="/" style="color:var(--accent);">← Back to home</a></p></main>`);
}

function blogPostHtml(site, post) {
  return blogShell(site, post.title, `<main style="max-width:720px;margin:0 auto;padding:40px 24px;"><a href="/blog/" style="color:var(--accent);font-family:-apple-system,sans-serif;font-size:13px;">← All posts</a><h1 style="margin:14px 0 8px;font-family:-apple-system,sans-serif;">${htmlEscape(post.title)}</h1><div style="color:var(--muted);font-size:13px;font-family:-apple-system,sans-serif;margin-bottom:24px;">${htmlEscape(post.date)}${post.author ? ' · ' + htmlEscape(post.author) : ''}</div><div style="color:var(--text);line-height:1.7;">${post.html}</div><p style="margin-top:40px;"><a href="/" style="color:var(--accent);">← Back to home</a></p></main>`);
}

function blogShell(site, title, body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEscape(title)} — ${htmlEscape(site.firmName || site.businessName || site.domain)}</title><meta name="theme-color" content="${site.colors.background}"><style>:root{--primary:${site.colors.primary};--primary-dark:${site.colors.primaryDark};--accent:${site.colors.accent};--bg:${site.colors.background};--text:${site.colors.text};--muted:${site.colors.muted};}*{box-sizing:border-box;margin:0;padding:0;}body{background:var(--bg);color:var(--text);font-family:Georgia,serif;line-height:1.6;}a{color:var(--accent);}</style></head><body>${body}</body></html>`;
}

// ---------- worker.js generation ----------
function workerJs(html, site, sitemap, robots, blog, areaPages) {
  const escapedHtml = JSON.stringify(html);
  const escapedSitemap = JSON.stringify(sitemap);
  const escapedRobots = JSON.stringify(robots);
  const blogIndex = blog.length ? JSON.stringify(blogIndexHtml(site, blog)) : '""';
  const blogPostsObj = '{' + blog.map(p => `${JSON.stringify(p.slug)}: ${JSON.stringify(blogPostHtml(site, p))}`).join(', ') + '}';
  const areaPagesObj = '{' + Object.entries(areaPages || {}).map(([id, h]) => `${JSON.stringify(id)}: ${JSON.stringify(h)}`).join(', ') + '}';
  const alertWebhook = site.chatbot?.alertWebhook ?? defaults.chatbot?.alertWebhook ?? '';
  const obdPrice = site.prices?.obd ?? defaults.prices?.obd ?? '';
  const oviPrice = site.prices?.ovi ?? defaults.prices?.ovi ?? '';
  const phone = site.phone || 'TBD';
  const city = site.city || '';
  const vertical = site.vertical || 'carb';
  const fallbackEmail = site.fallbackEmail || site.email || '';
  const fromEmail = site.fromEmail || `noreply@${site.domain}`;
  const fromName = site.firmName || site.businessName || site.domain;

  return `// AUTO-GENERATED by sites/build.mjs — DO NOT EDIT.
// Edit sites/sites.json or sites/templates/${vertical}.html and re-run \`node sites/build.mjs\`.
// Site: ${site.id} (${site.domain}) · vertical: ${vertical}

const HTML = ${escapedHtml};
const SITEMAP = ${escapedSitemap};
const ROBOTS = ${escapedRobots};
const BLOG_INDEX = ${blogIndex};
const BLOG_POSTS = ${blogPostsObj};
const AREA_PAGES = ${areaPagesObj};
const SITE_ID = ${JSON.stringify(site.id)};
const VERTICAL = ${JSON.stringify(vertical)};
const ALERT_WEBHOOK = ${JSON.stringify(alertWebhook)};
const FALLBACK_EMAIL = ${JSON.stringify(fallbackEmail)};
const FROM_EMAIL = ${JSON.stringify(fromEmail)};
const FROM_NAME = ${JSON.stringify(fromName)};

// Format a submission payload into a plain-text email body
function formatEmailBody(payload) {
  const lines = [];
  lines.push("New " + (payload.kind || "submission") + " from " + SITE_ID);
  lines.push("Time: " + (payload.timestamp || new Date().toISOString()));
  if (payload.area) lines.push("Practice area: " + payload.area);
  lines.push("");
  const skip = new Set(["kind", "site", "timestamp"]);
  for (const [k, v] of Object.entries(payload)) {
    if (skip.has(k) || v == null || v === "") continue;
    const label = k.replace(/_/g, " ").replace(/\\b\\w/g, c => c.toUpperCase());
    lines.push(label + ": " + v);
  }
  return lines.join("\\n");
}

function formatEmailSubject(payload) {
  const kind = payload.kind === "intake" ? "Intake"
            : payload.kind === "booking" ? "Booking"
            : payload.kind === "chat" ? "Chat message"
            : "Submission";
  const who = payload.client_name || payload.name || "someone";
  const what = payload.area ? " (" + payload.area + ")" : "";
  return "[" + SITE_ID + "] " + kind + what + " — " + who;
}

// Resend API — free 100/day, simplest to set up.
// Requires: wrangler secret put RESEND_API_KEY
async function sendViaResend(env, to, subject, body, replyTo) {
  if (!env || !env.RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_NAME + " <" + FROM_EMAIL + ">",
        to: [to],
        subject: subject,
        text: body,
        reply_to: replyTo || undefined,
      }),
    });
    return res.ok;
  } catch (e) { return false; }
}

// MailChannels — free, works from Cloudflare Workers if the sending domain has
// SPF/DKIM configured. Best-effort fallback if Resend isn't set up.
async function sendViaMailChannels(to, subject, body, replyTo) {
  try {
    const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        reply_to: replyTo ? { email: replyTo } : undefined,
        subject: subject,
        content: [{ type: "text/plain", value: body }],
      }),
    });
    return res.ok;
  } catch (e) { return false; }
}

async function sendFallbackEmail(env, payload) {
  if (!FALLBACK_EMAIL) return false;
  const subject = formatEmailSubject(payload);
  const body = formatEmailBody(payload);
  const replyTo = payload.client_email || payload.email || undefined;
  // Try Resend first (most reliable), then MailChannels as last resort
  if (await sendViaResend(env, FALLBACK_EMAIL, subject, body, replyTo)) return true;
  if (await sendViaMailChannels(FALLBACK_EMAIL, subject, body, replyTo)) return true;
  return false;
}

async function fireAlert(env, payload) {
  // 1. Always persist in KV if bound (survives everything else failing)
  try {
    if (env && env.SUBMISSIONS) {
      const key = payload.kind + "_" + Date.now();
      await env.SUBMISSIONS.put(key, JSON.stringify(payload), { expirationTtl: 60 * 60 * 24 * 90 });
    }
  } catch (e) {}
  // 2. Fire webhook (Make/Zapier/SMS) — primary alert path
  let webhookOk = false;
  const url = (env && env.ALERT_WEBHOOK) || ALERT_WEBHOOK;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      webhookOk = res.ok;
    } catch (e) {}
  }
  // 3. Email fallback — always send, regardless of webhook status. Double-belt.
  //    (If you only want email when the webhook fails, change to: if (!webhookOk) await sendFallbackEmail(env, payload);)
  await sendFallbackEmail(env, payload);
}

function html(body) {
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff", "Strict-Transport-Security": "max-age=31536000; includeSubDomains" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === "/robots.txt") return new Response(ROBOTS, { headers: { "Content-Type": "text/plain" } });
    if (p === "/sitemap.xml") return new Response(SITEMAP, { headers: { "Content-Type": "application/xml" } });

    // Blog
    if (p === "/blog" || p === "/blog/") return html(BLOG_INDEX || HTML);
    if (p.startsWith("/blog/")) {
      const slug = p.replace(/^\\/blog\\//, "").replace(/\\/$/, "");
      if (BLOG_POSTS[slug]) return html(BLOG_POSTS[slug]);
    }

    // Practice area pages (law sites)
    if (p.length > 1) {
      const areaId = p.replace(/^\\//, "").replace(/\\/$/, "");
      if (AREA_PAGES[areaId]) return html(AREA_PAGES[areaId]);
    }

    // Bookings (CARB) / Intakes (Law) / Chat — all funnel through fireAlert
    if (p === "/api/book" && request.method === "POST") {
      try {
        const data = await request.json();
        await fireAlert(env, { kind: "booking", site: SITE_ID, ...data });
        return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
    }
    if (p === "/api/intake" && request.method === "POST") {
      try {
        const data = await request.json();
        await fireAlert(env, { kind: "intake", site: SITE_ID, ...data });
        return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
    }
    if (p === "/api/chat" && request.method === "POST") {
      try {
        const data = await request.json();
        await fireAlert(env, { kind: "chat", site: SITE_ID, ...data });
        const msg = (data.message || "").toLowerCase();
        let reply;
        if (VERTICAL === "law") {
          if (msg.includes("price") || msg.includes("cost") || msg.includes("how much") || msg.includes("fee") || msg.includes("free")) {
            reply = "Personal injury consultations are free — and PI cases are on contingency, so no fee unless we win. For other matters there's a modest consultation fee that's credited toward your case if you retain us. Call __PHONE__ to set it up.";
          } else if (msg.includes("immigration") || msg.includes("green card") || msg.includes("visa") || msg.includes("deport")) {
            reply = "Immigration is one of our main practice areas. Use the Immigration intake form on this page or call __PHONE__ — we'll keep it confidential.";
          } else if (msg.includes("bankruptcy") || msg.includes("debt") || msg.includes("garnish")) {
            reply = "We handle Chapter 7 and 13 bankruptcies. Filling out the bankruptcy intake form on this page is the fastest way to get a real assessment.";
          } else if (msg.includes("divorce") || msg.includes("custody") || msg.includes("family")) {
            reply = "We handle divorce, custody, and support matters. Family law intake form is on this page.";
          } else if (msg.includes("hour") || msg.includes("open") || msg.includes("when")) {
            reply = "We're open Mon–Fri 9–5:30, with after-hours by appointment. Call __PHONE__ any time — we return calls quickly.";
          } else if (msg.includes("nutrition") || msg.includes("diet") || msg.includes("politic") || msg.includes("weather") || msg.includes("joke") || msg.includes("recipe")) {
            reply = "I only help with legal questions for our firm. For that, you'll want a different resource. Got a legal question I can help with?";
          } else {
            reply = "I'll alert the office and Mr. Chigbu. Drop your phone number and we'll call you back, or call __PHONE__ directly. Email: __EMAIL__.";
          }
        } else {
          // CARB defaults
          if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
            reply = "OBD test (2013+) is $__OBD__, OVI smoke (2012 & older) is $__OVI__. Motorhomes same pricing.";
          } else if (msg.includes("hours") || msg.includes("when") || msg.includes("weekend")) {
            reply = "We run 24/7, weekends included. We'll come to your yard, lot, or jobsite.";
          } else if (msg.includes("schedule") || msg.includes("book") || msg.includes("appointment")) {
            reply = "Easy — leave your phone number here and we'll text you back, or call us at __PHONE__.";
          } else {
            reply = "Got it — alerting the __CITY__ crew now. Drop your phone number and we'll text you in a few minutes. Or call __PHONE__.";
          }
        }
        return new Response(JSON.stringify({ ok: true, reply }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
    }

    return html(HTML);
  }
};
`
    .replaceAll('__OBD__', String(obdPrice))
    .replaceAll('__OVI__', String(oviPrice))
    .replaceAll('__PHONE__', phone)
    .replaceAll('__CITY__', city)
    .replaceAll('__EMAIL__', site.email || '');
}

function sitemapXml(site, blog) {
  const urls = [`<url><loc>https://${site.domain}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`];
  if ((site.vertical || 'carb') === 'law') {
    for (const a of (site.practiceAreas || [])) {
      urls.push(`<url><loc>https://${site.domain}/${a.id}/</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>`);
    }
  }
  if (blog.length) urls.push(`<url><loc>https://${site.domain}/blog/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  for (const p of blog) urls.push(`<url><loc>https://${site.domain}/blog/${p.slug}/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls.join('\n  ')}\n</urlset>`;
}

function robotsTxt(site) {
  return `User-agent: *\nAllow: /\nSitemap: https://${site.domain}/sitemap.xml\n`;
}

function wranglerToml(site) {
  return `# AUTO-GENERATED by sites/build.mjs — DO NOT EDIT.
name = "${site.id}"
main = "worker.js"
compatibility_date = "2026-03-01"
account_id = "bafa242dd95d3fdce72540d20accd0a2"

# Submissions persistence (optional, 90-day TTL) — create once with:
#   wrangler kv namespace create SUBMISSIONS
# [[kv_namespaces]]
# binding = "SUBMISSIONS"
# id = "<paste-id>"

# Alert webhook (Make/Zapier/SMS gateway) — overrides sites.json
# [vars]
# ALERT_WEBHOOK = "https://hook.us1.make.com/xxxxxxxx"

# Email fallback — set RESEND_API_KEY as a Cloudflare secret (not a var):
#   wrangler secret put RESEND_API_KEY
# Sign up free at resend.com (100 emails/day free). Add sending domain verification
# so from address "noreply@${site.domain}" passes SPF/DKIM.
# If no Resend key is set, the worker falls back to MailChannels (also free,
# but requires domain SPF/DKIM configured in your Cloudflare DNS).

# Custom domain — uncomment after DNS is ready
# [[routes]]
# pattern = "${site.domain}/*"
# zone_name = "${site.domain}"
`;
}

// ---------- main ----------
if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

let count = 0;
for (const site of config.sites) {
  const html = renderSite(site, config.sites);
  const blog = loadBlog(site.id);
  const sitemap = sitemapXml(site, blog);
  const robots = robotsTxt(site);
  const dir = join(DIST, site.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);

  // Generate per-area pages for law sites
  const areaPages = {};
  if ((site.vertical || 'carb') === 'law') {
    for (const a of (site.practiceAreas || [])) {
      const pageHtml = lawAreaPageHtml(site, a);
      areaPages[a.id] = pageHtml;
      const areaDir = join(dir, a.id);
      mkdirSync(areaDir, { recursive: true });
      writeFileSync(join(areaDir, 'index.html'), pageHtml);
    }
  }

  writeFileSync(join(dir, 'worker.js'), workerJs(html, site, sitemap, robots, blog, areaPages));
  writeFileSync(join(dir, 'wrangler.toml'), wranglerToml(site));
  writeFileSync(join(dir, 'sitemap.xml'), sitemap);
  writeFileSync(join(dir, 'robots.txt'), robots);
  const v = site.vertical || 'carb';
  const extras = v === 'carb'
    ? `OBD $${site.prices?.obd ?? defaults.prices.obd}  OVI $${site.prices?.ovi ?? defaults.prices.ovi}`
    : `${(site.practiceAreas || []).length} practice areas, ${blog.length} blog post${blog.length === 1 ? '' : 's'}`;
  console.log(`✓ ${site.id.padEnd(28)} [${v}]  → ${site.domain.padEnd(34)} ${extras}`);
  count++;
}
console.log(`\nGenerated ${count} site(s) into sites/dist/`);
