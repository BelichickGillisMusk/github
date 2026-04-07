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
  return areas.map(a => `<a class="practice-card" href="#intake-${htmlEscape(a.id)}"><h3>${htmlEscape(a.name)}</h3><p>${htmlEscape(a.blurb)}</p><span class="cta">Start free intake →</span></a>`).join('\n    ');
}

function intakeFormsHtml(areas) {
  return areas.map(a => {
    const fields = a.intake.map(intakeFieldHtml).join('\n        ');
    return `<div id="intake-${htmlEscape(a.id)}" style="margin-top:30px;">
      <h2>${htmlEscape(a.name)} — Free Confidential Intake</h2>
      <form class="intake-form" data-area="${htmlEscape(a.id)}" style="background:rgba(255,255,255,0.04);border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:14px;">
        ${fields}
        <label>Your name<input name="client_name" required></label>
        <label>Phone<input name="client_phone" type="tel" required></label>
        <label>Email<input name="client_email" type="email" required></label>
        <label>Anything else we should know?<textarea name="notes" rows="3"></textarea></label>
        <button type="submit" class="btn primary block">Submit confidential intake</button>
        <div class="ok" hidden style="color:#7BE7A2;">✓ Received. Mr. Chigbu (or our office) will reach out shortly.</div>
      </form>
    </div>`;
  }).join('\n    ');
}

function navPracticeLinksHtml(areas) {
  return areas.map(a => `<a href="#intake-${htmlEscape(a.id)}">${htmlEscape(a.name)}</a>`).join('\n    ');
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
    LANGUAGES_JSON: JSON.stringify(site.languages || ['English']),
    DISCLAIMER: site.disclaimer || vDef.disclaimer || '',
    PRACTICE_CARDS_HTML: practiceCardsHtml(site.practiceAreas || []),
    INTAKE_FORMS_HTML: intakeFormsHtml(site.practiceAreas || []),
    NAV_PRACTICE_LINKS: navPracticeLinksHtml(site.practiceAreas || []),
    REVIEWS_HTML: reviewsHtml(site.reviews),
    DIRECTIONS_URL: directionsUrl(site),
    GOOGLE_BUSINESS_URL: site.googleBusinessUrl || directionsUrl(site),
    GOOGLE_REVIEWS_URL: site.googleReviewsUrl || site.googleBusinessUrl || directionsUrl(site),
    GOOGLE_REVIEW_WRITE_URL: site.googleReviewWriteUrl || (site.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${site.googlePlaceId}` : (site.googleBusinessUrl || directionsUrl(site))),
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
function workerJs(html, site, sitemap, robots, blog) {
  const escapedHtml = JSON.stringify(html);
  const escapedSitemap = JSON.stringify(sitemap);
  const escapedRobots = JSON.stringify(robots);
  const blogIndex = blog.length ? JSON.stringify(blogIndexHtml(site, blog)) : '""';
  const blogPostsObj = '{' + blog.map(p => `${JSON.stringify(p.slug)}: ${JSON.stringify(blogPostHtml(site, p))}`).join(', ') + '}';
  const alertWebhook = site.chatbot?.alertWebhook ?? defaults.chatbot?.alertWebhook ?? '';
  const obdPrice = site.prices?.obd ?? defaults.prices?.obd ?? '';
  const oviPrice = site.prices?.ovi ?? defaults.prices?.ovi ?? '';
  const phone = site.phone || 'TBD';
  const city = site.city || '';
  const vertical = site.vertical || 'carb';

  return `// AUTO-GENERATED by sites/build.mjs — DO NOT EDIT.
// Edit sites/sites.json or sites/templates/${vertical}.html and re-run \`node sites/build.mjs\`.
// Site: ${site.id} (${site.domain}) · vertical: ${vertical}

const HTML = ${escapedHtml};
const SITEMAP = ${escapedSitemap};
const ROBOTS = ${escapedRobots};
const BLOG_INDEX = ${blogIndex};
const BLOG_POSTS = ${blogPostsObj};
const SITE_ID = ${JSON.stringify(site.id)};
const VERTICAL = ${JSON.stringify(vertical)};
const ALERT_WEBHOOK = ${JSON.stringify(alertWebhook)};

async function fireAlert(env, payload) {
  try {
    if (env && env.SUBMISSIONS) {
      const key = payload.kind + "_" + Date.now();
      await env.SUBMISSIONS.put(key, JSON.stringify(payload), { expirationTtl: 60 * 60 * 24 * 90 });
    }
  } catch (e) {}
  const url = (env && env.ALERT_WEBHOOK) || ALERT_WEBHOOK;
  if (url) {
    try {
      await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch (e) {}
  }
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
          if (msg.includes("price") || msg.includes("cost") || msg.includes("how much") || msg.includes("fee")) {
            reply = "First consultations are free and confidential. Fees depend on the matter — bankruptcy and personal injury usually have no upfront cost. Want to set up the free consult?";
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

# [[kv_namespaces]]
# binding = "SUBMISSIONS"
# id = "<paste-id>"

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
  writeFileSync(join(dir, 'worker.js'), workerJs(html, site, sitemap, robots, blog));
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
