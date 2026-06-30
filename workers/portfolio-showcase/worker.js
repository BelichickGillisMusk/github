// worker.js — Portfolio Showcase
//
// Routes:
//   GET /                           -> 3-tile mosaic (Rent Ruby / Convicts for a Clean CA / The Undefeated)
//   GET /rent-ruby                  -> Dave Cowan Properties rent roll (existing dashboard)
//   GET /convicts-for-a-clean-ca    -> Oakland cleanup pitch landing page
//   POST /api/bid                   -> Bid-packet form intake (logs to console)
//   *                               -> 404
//
// rent-roll.html is bundled at build time via wrangler's [[rules]] Text import.

import RENT_ROLL_HTML from "./rent-roll.html";

// === EDIT THESE ===
const UNDEFEATED_PDF_URL = "#"; // TODO: replace with the live PDF URL
const CONTACT_EMAIL = "bryan@norcalcarbmobile.com";
// ==================

function renderMosaic() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Three things I'm building — Bryan</title>
<meta name="description" content="A quick mosaic of three projects: Rent Ruby property portal, Convicts for a Clean CA, and The Undefeated.">
<meta property="og:title" content="Three things I'm building">
<meta property="og:description" content="Rent Ruby · Convicts for a Clean CA · The Undefeated">
<meta property="og:url" content="https://showcase.silverbackai.agency/">
<meta name="theme-color" content="#07070b">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#07070b; --bg-2:#0f0f17; --card:#15151f;
  --accent:#8b5cf6; --accent-bright:#c4b5fd; --accent-glow:rgba(139,92,246,0.18);
  --text:#fff; --text-2:#c2c2d0; --text-3:#86868f;
  --border:rgba(255,255,255,0.08);
}
html{scroll-behavior:smooth}
body{
  font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  background:var(--bg); color:var(--text); line-height:1.6;
  min-height:100vh; overflow-x:hidden;
}
body::before{
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(circle at 18% 12%, rgba(139,92,246,0.18) 0%, transparent 45%),
    radial-gradient(circle at 82% 88%, rgba(212,160,23,0.10) 0%, transparent 50%);
}
.shell{position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:32px 24px 80px}

/* ── Header ── */
header{display:flex; justify-content:space-between; align-items:center; padding-bottom:48px}
.brand{display:flex; align-items:center; gap:12px; text-decoration:none; color:var(--text)}
.brand-mark{
  width:36px; height:36px; border-radius:10px;
  background:linear-gradient(135deg,var(--accent) 0%,#7c3aed 100%);
  display:grid; place-items:center; font-weight:800; font-size:18px;
  box-shadow:0 8px 28px var(--accent-glow);
}
.brand-text{font-weight:700; font-size:18px; letter-spacing:-0.3px}
.brand-text span{color:var(--accent-bright)}
.header-tag{
  font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:2px;
  text-transform:uppercase; color:var(--text-3);
}

/* ── Intro ── */
.intro{max-width:720px; margin-bottom:56px}
.intro-eyebrow{
  display:inline-flex; align-items:center; gap:10px;
  background:rgba(139,92,246,0.10); border:1px solid var(--accent-glow);
  padding:8px 16px; border-radius:100px;
  font-size:12px; font-weight:600; color:var(--accent-bright);
  letter-spacing:1px; text-transform:uppercase; margin-bottom:24px;
}
.intro-eyebrow::before{
  content:''; width:6px; height:6px; border-radius:50%;
  background:var(--accent); box-shadow:0 0 12px var(--accent);
}
.intro h1{
  font-size:clamp(36px,5.5vw,64px); font-weight:800;
  line-height:1.05; letter-spacing:-2px; margin-bottom:20px;
}
.intro h1 .grad{
  background:linear-gradient(135deg,#c4b5fd 0%,var(--accent) 50%,#f0abfc 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.intro p{font-size:18px; color:var(--text-2); max-width:600px}

/* ── Mosaic grid ── */
.mosaic{display:grid; grid-template-columns:repeat(3,1fr); gap:24px}
@media (max-width:1024px){.mosaic{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){.mosaic{grid-template-columns:1fr}}

.tile{
  position:relative; display:flex; flex-direction:column;
  border-radius:20px; overflow:hidden; background:var(--card);
  border:1px solid var(--border);
  transition:transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .25s;
  text-decoration:none; color:inherit; min-height:520px;
}
.tile:hover{
  transform:translateY(-6px);
  box-shadow:0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--accent);
  border-color:var(--accent);
}
.tile-preview{position:relative; height:280px; overflow:hidden}
.tile-body{padding:28px 26px 30px; display:flex; flex-direction:column; flex:1}
.tile-kicker{
  font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:2px;
  text-transform:uppercase; color:var(--text-3); margin-bottom:10px;
}
.tile-title{font-size:24px; font-weight:700; letter-spacing:-0.5px; margin-bottom:10px}
.tile-pitch{color:var(--text-2); font-size:15px; margin-bottom:20px; flex:1}
.tile-cta{
  display:inline-flex; align-items:center; gap:8px;
  font-weight:600; font-size:14px; color:var(--accent-bright);
  letter-spacing:0.3px;
}
.tile-cta::after{content:'→'; transition:transform .2s}
.tile:hover .tile-cta::after{transform:translateX(4px)}

/* ── Tile 1: Rent Ruby (Irish flag preview) ── */
.preview-rentruby{
  background:linear-gradient(160deg,#1aad64 0%,#0a7a45 40%,#054d2c 100%);
  display:flex; flex-direction:column; padding:24px;
}
.rr-flag{display:flex; gap:5px; margin-bottom:14px}
.rr-flag span{width:6px; height:36px; border-radius:2px}
.rr-flag span.g{background:rgba(255,255,255,0.95); box-shadow:0 0 6px rgba(255,255,255,0.4)}
.rr-flag span.w{background:rgba(255,255,255,0.55)}
.rr-flag span.o{background:#e86520; box-shadow:0 0 10px rgba(232,101,32,0.7)}
.rr-brand{font-family:'Playfair Display',serif; font-size:24px; font-weight:900; color:#fff; line-height:1.1}
.rr-sub{
  font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:3px;
  text-transform:uppercase; color:rgba(255,255,255,0.65); margin-top:4px;
}
.rr-card{
  margin-top:18px; background:#fff; border-radius:10px; padding:14px;
  flex:1; display:flex; flex-direction:column; gap:8px;
}
.rr-row{
  display:flex; justify-content:space-between; align-items:center;
  font-family:'IBM Plex Mono',monospace; font-size:11px; color:#283028;
  padding:6px 8px; border-radius:6px; background:#f5f8f3;
}
.rr-row b{font-weight:700; color:#054d2c}
.rr-pill{
  font-family:'IBM Plex Mono',monospace; font-size:9px; font-weight:700;
  padding:3px 8px; border-radius:100px; letter-spacing:0.5px;
}
.rr-paid{background:#e4f7ee; color:#0a7a45}
.rr-late{background:#fdeaea; color:#b01c1c}
.rr-vac{background:#fef3e2; color:#a04000}

/* ── Tile 2: Convicts (civic gold) ── */
.preview-convicts{
  background:linear-gradient(160deg,#1a1a1a 0%,#0a0a0a 100%);
  display:flex; flex-direction:column; padding:24px; position:relative;
}
.preview-convicts::before{
  content:''; position:absolute; top:0; left:0; right:0; height:4px;
  background:linear-gradient(90deg,#d4a017 0%,#f5c842 50%,#d4a017 100%);
}
.cv-badge{
  display:inline-flex; align-items:center; gap:6px;
  background:rgba(212,160,23,0.15); border:1px solid rgba(212,160,23,0.4);
  padding:6px 12px; border-radius:100px;
  font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:700;
  color:#f5c842; letter-spacing:1.5px; text-transform:uppercase;
  align-self:flex-start; margin-bottom:14px;
}
.cv-headline{font-size:22px; font-weight:800; color:#fff; line-height:1.15; letter-spacing:-0.3px}
.cv-headline span{color:#f5c842}
.cv-meta{
  margin-top:auto; padding-top:16px;
  display:flex; gap:12px; flex-wrap:wrap;
}
.cv-stat{
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
  padding:10px 14px; border-radius:8px; flex:1; min-width:90px;
}
.cv-stat-num{font-size:18px; font-weight:800; color:#f5c842; line-height:1}
.cv-stat-lbl{
  font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:1.2px;
  color:rgba(255,255,255,0.6); text-transform:uppercase; margin-top:4px;
}

/* ── Tile 3: Undefeated (book cover) ── */
.preview-undefeated{
  background:
    radial-gradient(circle at 30% 20%, rgba(139,92,246,0.25) 0%, transparent 50%),
    linear-gradient(180deg,#0a0a0f 0%,#000 100%);
  display:flex; align-items:center; justify-content:center; position:relative;
  padding:24px;
}
.un-cover{
  width:175px; height:230px; position:relative;
  background:linear-gradient(135deg,#1a1a2e 0%,#000 100%);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:4px 8px 8px 4px;
  box-shadow:
    -6px 0 0 #0a0a0f,
    -7px 0 0 rgba(255,255,255,0.05),
    0 30px 60px rgba(0,0,0,0.6),
    inset 0 0 60px rgba(139,92,246,0.08);
  display:flex; flex-direction:column; padding:22px 18px;
  transform:perspective(800px) rotateY(-8deg);
  transition:transform .3s;
}
.tile:hover .un-cover{transform:perspective(800px) rotateY(-2deg)}
.un-pages-badge{
  align-self:flex-start;
  font-family:'IBM Plex Mono',monospace; font-size:9px; font-weight:700;
  color:#c4b5fd; letter-spacing:2px; text-transform:uppercase;
  border:1px solid rgba(196,181,253,0.4); padding:3px 8px; border-radius:100px;
}
.un-title{
  margin-top:auto; font-family:'Playfair Display',serif;
  font-size:32px; font-weight:900; line-height:0.95; color:#fff;
  letter-spacing:-1px;
}
.un-title em{
  display:block; font-style:italic; font-size:13px; font-weight:400;
  color:#c4b5fd; margin-top:8px; letter-spacing:0;
}
.un-rule{height:2px; background:#c4b5fd; width:38px; margin-top:14px}

/* ── Footer ── */
footer{
  margin-top:80px; padding-top:32px; border-top:1px solid var(--border);
  display:flex; justify-content:space-between; align-items:center;
  font-size:13px; color:var(--text-3); flex-wrap:wrap; gap:16px;
}
footer a{color:var(--text-2); text-decoration:none}
footer a:hover{color:var(--accent-bright)}
</style>
</head>
<body>
<div class="shell">
  <header>
    <a href="/" class="brand">
      <div class="brand-mark">SB</div>
      <div>
        <div class="brand-text">Silverback<span>.</span></div>
      </div>
    </a>
    <div class="header-tag">Showcase · 2026</div>
  </header>

  <section class="intro">
    <div class="intro-eyebrow">For my cousin</div>
    <h1>Three things I've <span class="grad">been building.</span></h1>
    <p>A property portal that's actually nice to use, a cleanup company built around a fair second chance, and a short read I want you to flip through. Click any tile.</p>
  </section>

  <section class="mosaic">

    <a class="tile" href="/rent-ruby">
      <div class="tile-preview preview-rentruby">
        <div class="rr-flag"><span class="g"></span><span class="w"></span><span class="o"></span></div>
        <div class="rr-brand">Dave Cowan Properties</div>
        <div class="rr-sub">West Region · Rent Roll</div>
        <div class="rr-card">
          <div class="rr-row"><span>Ruby · #204</span><span class="rr-pill rr-paid">Paid</span></div>
          <div class="rr-row"><span>SF · #318</span><span class="rr-pill rr-paid">Paid</span></div>
          <div class="rr-row"><span>HV-10 · #07</span><span class="rr-pill rr-late">Late</span></div>
          <div class="rr-row"><span>Ruby · #112</span><span class="rr-pill rr-vac">Vacant</span></div>
        </div>
      </div>
      <div class="tile-body">
        <div class="tile-kicker">01 · Property Tech</div>
        <div class="tile-title">Rent Ruby</div>
        <div class="tile-pitch">A senior-friendly rent-roll dashboard and tenant portal for a multi-property West Coast portfolio — payment status, market benchmarks, and one-click notices.</div>
        <span class="tile-cta">Open the dashboard</span>
      </div>
    </a>

    <a class="tile" href="/convicts-for-a-clean-ca">
      <div class="tile-preview preview-convicts">
        <div class="cv-badge">Bid-Ready · CA</div>
        <div class="cv-headline">Oakland's cleanup crew, with <span>a fair shot</span>.</div>
        <div class="cv-meta">
          <div class="cv-stat"><div class="cv-stat-num">1.1B</div><div class="cv-stat-lbl">CA Cleanup $ '25</div></div>
          <div class="cv-stat"><div class="cv-stat-num">48hr</div><div class="cv-stat-lbl">Mobilize</div></div>
          <div class="cv-stat"><div class="cv-stat-num">100%</div><div class="cv-stat-lbl">Living wage</div></div>
        </div>
      </div>
      <div class="tile-body">
        <div class="tile-kicker">02 · Civic Services</div>
        <div class="tile-title">Convicts for a Clean CA</div>
        <div class="tile-pitch">Oakland-based cleanup crew employing returning citizens. Encampment, illegal-dump, and roadside contracts — bid-ready for state funds, mobilizing now.</div>
        <span class="tile-cta">Read the pitch</span>
      </div>
    </a>

    <a class="tile" href="${UNDEFEATED_PDF_URL}" target="_blank" rel="noopener">
      <div class="tile-preview preview-undefeated">
        <div class="un-cover">
          <div class="un-pages-badge">9 Pages</div>
          <div class="un-title">The<br>Undefeated<em>A short read</em></div>
          <div class="un-rule"></div>
        </div>
      </div>
      <div class="tile-body">
        <div class="tile-kicker">03 · Read</div>
        <div class="tile-title">The Undefeated</div>
        <div class="tile-pitch">Nine pages. Worth your coffee. Opens in a new tab as a PDF — flip through whenever you've got a quiet ten minutes.</div>
        <span class="tile-cta">Open the PDF</span>
      </div>
    </a>

  </section>

  <footer>
    <div>Built by Bryan · <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></div>
    <div>showcase.silverbackai.agency</div>
  </footer>
</div>
</body>
</html>`;
}

function renderConvicts() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Convicts for a Clean CA — Oakland cleanup crew, bid-ready</title>
<meta name="description" content="Oakland-based cleanup crew employing returning citizens. Encampment, illegal-dump, and roadside contracts — bid-ready for California state cleanup funds, mobilizing in 48 hours.">
<meta property="og:title" content="Convicts for a Clean CA">
<meta property="og:description" content="Oakland's cleanup crew, with a fair shot. Bid-ready for California state cleanup funds.">
<meta name="theme-color" content="#1a1a1a">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0a0a; --bg-2:#1a1a1a; --card:#222;
  --gold:#d4a017; --gold-bright:#f5c842; --gold-glow:rgba(212,160,23,0.2);
  --text:#fff; --text-2:#cfcfcf; --text-3:#888;
  --border:rgba(255,255,255,0.08);
}
html{scroll-behavior:smooth}
body{
  font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  background:var(--bg); color:var(--text); line-height:1.6;
  min-height:100vh; overflow-x:hidden;
}
.container{max-width:1100px; margin:0 auto; padding:0 24px}

/* ── Top bar ── */
header{
  position:sticky; top:0; z-index:100;
  background:rgba(10,10,10,0.92); backdrop-filter:blur(16px);
  border-bottom:1px solid var(--border);
}
header::after{
  content:''; display:block; height:3px;
  background:linear-gradient(90deg,var(--gold) 0%,var(--gold-bright) 50%,var(--gold) 100%);
}
.nav{display:flex; justify-content:space-between; align-items:center; padding:18px 0}
.logo{
  display:flex; align-items:center; gap:10px;
  text-decoration:none; color:var(--text); font-weight:800; font-size:18px; letter-spacing:-0.3px;
}
.logo-mark{
  width:36px; height:36px; border-radius:8px;
  background:linear-gradient(135deg,var(--gold) 0%,#a07a10 100%);
  display:grid; place-items:center; color:#000; font-weight:900;
  box-shadow:0 8px 24px var(--gold-glow);
}
.nav a.back{
  font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:1.5px;
  text-transform:uppercase; color:var(--text-3); text-decoration:none;
}
.nav a.back:hover{color:var(--gold-bright)}

/* ── Hero ── */
.hero{padding:80px 0 64px; position:relative; overflow:hidden}
.hero::before{
  content:''; position:absolute; top:-200px; right:-100px;
  width:600px; height:600px;
  background:radial-gradient(circle,var(--gold-glow) 0%,transparent 65%);
  pointer-events:none;
}
.hero-eyebrow{
  display:inline-flex; align-items:center; gap:10px;
  background:rgba(212,160,23,0.12); border:1px solid rgba(212,160,23,0.4);
  padding:8px 18px; border-radius:100px;
  font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:700;
  color:var(--gold-bright); letter-spacing:2px; text-transform:uppercase;
  margin-bottom:24px;
}
.hero-eyebrow::before{
  content:''; width:8px; height:8px; border-radius:50%;
  background:var(--gold); box-shadow:0 0 12px var(--gold);
}
.hero h1{
  font-size:clamp(42px,6vw,80px); font-weight:900;
  line-height:1.0; letter-spacing:-2.5px; margin-bottom:24px;
  max-width:880px;
}
.hero h1 span{color:var(--gold-bright)}
.hero-lede{
  font-size:20px; color:var(--text-2); max-width:640px; margin-bottom:36px;
}
.hero-cta{display:flex; gap:14px; flex-wrap:wrap}
.btn{
  display:inline-flex; align-items:center; gap:8px;
  padding:16px 32px; border-radius:10px;
  font-weight:700; font-size:15px; text-decoration:none;
  letter-spacing:0.3px; transition:all .2s; border:none; cursor:pointer;
}
.btn-primary{background:var(--gold); color:#000}
.btn-primary:hover{background:var(--gold-bright); transform:translateY(-2px); box-shadow:0 12px 30px var(--gold-glow)}
.btn-ghost{background:transparent; color:var(--text); border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--gold); color:var(--gold-bright)}

/* ── Stats strip ── */
.stats{
  display:grid; grid-template-columns:repeat(4,1fr); gap:1px;
  background:var(--border); margin:48px 0;
}
@media (max-width:720px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{
  background:var(--bg); padding:28px 20px;
  display:flex; flex-direction:column; align-items:center; text-align:center;
}
.stat-num{font-size:36px; font-weight:900; color:var(--gold-bright); line-height:1; letter-spacing:-1px}
.stat-lbl{
  font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600;
  letter-spacing:1.5px; text-transform:uppercase; color:var(--text-3);
  margin-top:10px;
}

/* ── Sections ── */
section.block{padding:72px 0; border-top:1px solid var(--border)}
.eyebrow{
  font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:700;
  letter-spacing:2.5px; text-transform:uppercase; color:var(--gold-bright);
  margin-bottom:14px;
}
h2{
  font-size:clamp(32px,4.5vw,52px); font-weight:800;
  letter-spacing:-1.5px; line-height:1.1; margin-bottom:22px; max-width:760px;
}
.lede{font-size:18px; color:var(--text-2); max-width:680px; margin-bottom:40px}

.cards{display:grid; grid-template-columns:repeat(3,1fr); gap:20px}
@media (max-width:880px){.cards{grid-template-columns:1fr}}
.card{
  background:var(--bg-2); border:1px solid var(--border); border-radius:14px;
  padding:28px 24px; transition:border-color .2s, transform .2s;
}
.card:hover{border-color:rgba(212,160,23,0.4); transform:translateY(-3px)}
.card-num{
  font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:700;
  color:var(--gold); letter-spacing:1.5px; margin-bottom:14px;
}
.card h3{font-size:21px; font-weight:700; margin-bottom:10px; letter-spacing:-0.3px}
.card p{color:var(--text-2); font-size:15px}

/* ── Bid form ── */
.bid-wrap{
  background:linear-gradient(160deg,#1a1a1a 0%,#0a0a0a 100%);
  border:1px solid var(--border); border-radius:18px;
  padding:48px 40px; margin-top:24px; position:relative; overflow:hidden;
}
.bid-wrap::before{
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg,var(--gold),var(--gold-bright),var(--gold));
}
@media (max-width:640px){.bid-wrap{padding:32px 22px}}
.form-row{display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px}
@media (max-width:640px){.form-row{grid-template-columns:1fr}}
.field{display:flex; flex-direction:column; gap:6px}
.field label{
  font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:700;
  text-transform:uppercase; letter-spacing:1.5px; color:var(--text-2);
}
.field input, .field textarea{
  background:rgba(0,0,0,0.4); color:var(--text);
  border:1px solid var(--border); border-radius:10px;
  padding:14px 16px; font-size:15px; font-family:inherit;
  transition:border-color .2s, box-shadow .2s;
}
.field input:focus, .field textarea:focus{
  outline:none; border-color:var(--gold);
  box-shadow:0 0 0 3px rgba(212,160,23,0.15);
}
.field textarea{resize:vertical; min-height:110px; line-height:1.55}
.form-msg{
  margin-top:14px; padding:12px 16px; border-radius:8px;
  font-size:14px; display:none;
}
.form-msg.ok{display:block; background:rgba(212,160,23,0.12); border:1px solid rgba(212,160,23,0.4); color:var(--gold-bright)}
.form-msg.err{display:block; background:rgba(176,28,28,0.15); border:1px solid rgba(176,28,28,0.4); color:#ff8a8a}

/* ── Footer ── */
footer.site{
  border-top:1px solid var(--border); padding:32px 0; margin-top:40px;
  font-size:13px; color:var(--text-3);
}
footer.site .container{display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px}
footer.site a{color:var(--text-2); text-decoration:none}
footer.site a:hover{color:var(--gold-bright)}
</style>
</head>
<body>

<header>
  <div class="container nav">
    <a class="logo" href="/convicts-for-a-clean-ca">
      <div class="logo-mark">C</div>
      <div>Convicts for a Clean CA</div>
    </a>
    <a class="back" href="/">← Showcase</a>
  </div>
</header>

<section class="hero">
  <div class="container">
    <div class="hero-eyebrow">Bid-Ready · Oakland</div>
    <h1>California's cleanup work, done by the people <span>who need the job most.</span></h1>
    <p class="hero-lede">We're an Oakland-based cleanup crew built around returning citizens — fully insured, supervised, and ready to mobilize in 48 hours. We're bidding on state encampment, illegal-dump, and roadside contracts now.</p>
    <div class="hero-cta">
      <a href="#bid" class="btn btn-primary">Request a bid packet →</a>
      <a href="#model" class="btn btn-ghost">Read our model</a>
    </div>
  </div>
</section>

<div class="container">
  <div class="stats">
    <div class="stat"><div class="stat-num">$1.1B</div><div class="stat-lbl">CA cleanup spend '25</div></div>
    <div class="stat"><div class="stat-num">48hr</div><div class="stat-lbl">Mobilize on award</div></div>
    <div class="stat"><div class="stat-num">100%</div><div class="stat-lbl">Living wage crews</div></div>
    <div class="stat"><div class="stat-num">510</div><div class="stat-lbl">Oakland HQ</div></div>
  </div>
</div>

<section class="block" id="opportunity">
  <div class="container">
    <div class="eyebrow">The opportunity</div>
    <h2>California is spending billions on cleanup. The crews don't exist.</h2>
    <p class="lede">CalTrans, the Governor's encampment-resolution funding, and city contracts in Oakland and across the Bay are all bidding out cleanup work right now. Backlogs are growing faster than crews are forming. We're filling that gap — built and ready to deploy this quarter.</p>
  </div>
</section>

<section class="block" id="model">
  <div class="container">
    <div class="eyebrow">The model</div>
    <h2>A second chance, on a real worksite, at a real wage.</h2>
    <p class="lede">Our crews are returning citizens partnered through Bay Area re-entry programs. Supervised, insured, paid a living wage from day one — and producing finished, contract-grade work.</p>
    <div class="cards">
      <div class="card">
        <div class="card-num">01</div>
        <h3>Vetted crews</h3>
        <p>Recruited via established Bay Area re-entry orgs. Every crew member screened, supervised, and supported through the first 90 days.</p>
      </div>
      <div class="card">
        <div class="card-num">02</div>
        <h3>Bonded &amp; insured</h3>
        <p>General liability, workers' comp, vehicle and equipment coverage in place. Bid-package compliant for CalTrans, county, and city RFPs.</p>
      </div>
      <div class="card">
        <div class="card-num">03</div>
        <h3>Mobilized in 48hr</h3>
        <p>Trucks, PPE, hazmat handling, hauling, and disposal partners staged. We can have boots on the ground two days after award.</p>
      </div>
    </div>
  </div>
</section>

<section class="block" id="why">
  <div class="container">
    <div class="eyebrow">Why us, why now</div>
    <h2>Bid-ready before the next contract closes.</h2>
    <p class="lede">Most social-enterprise cleanup operators take 12–18 months to spin up bonding, insurance, and crew capacity. We've done the spin-up already. Award us the work and we move.</p>
  </div>
</section>

<section class="block" id="bid">
  <div class="container">
    <div class="eyebrow">Request a bid packet</div>
    <h2>Tell us the scope. We'll send the packet within 24 hours.</h2>
    <div class="bid-wrap">
      <form id="bidForm" novalidate>
        <div class="form-row">
          <div class="field">
            <label for="name">Your name</label>
            <input id="name" name="name" type="text" required>
          </div>
          <div class="field">
            <label for="agency">Agency / Organization</label>
            <input id="agency" name="agency" type="text" required>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required>
          </div>
          <div class="field">
            <label for="phone">Phone (optional)</label>
            <input id="phone" name="phone" type="tel">
          </div>
        </div>
        <div class="field" style="margin-bottom:20px">
          <label for="scope">Scope of work</label>
          <textarea id="scope" name="scope" placeholder="e.g. Recurring encampment cleanup along I-880, Oakland — weekly cadence, est. 12 sites" required></textarea>
        </div>
        <button class="btn btn-primary" type="submit" style="width:100%; justify-content:center">Send bid request →</button>
        <div id="formMsg" class="form-msg"></div>
      </form>
    </div>
  </div>
</section>

<footer class="site">
  <div class="container">
    <div>Convicts for a Clean CA · Oakland, California · <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></div>
    <div><a href="/">← Back to showcase</a></div>
  </div>
</footer>

<script>
document.getElementById('bidForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('formMsg');
  msg.className = 'form-msg';
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('/api/bid', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data),
    });
    if (res.ok) {
      msg.className = 'form-msg ok';
      msg.textContent = 'Got it — we\\'ll have the bid packet in your inbox within 24 hours.';
      form.reset();
    } else {
      msg.className = 'form-msg err';
      msg.textContent = 'Something went wrong. Please email us directly at ${CONTACT_EMAIL}.';
    }
  } catch (err) {
    msg.className = 'form-msg err';
    msg.textContent = 'Network error. Please email us directly at ${CONTACT_EMAIL}.';
  }
});
</script>
</body>
</html>`;
}

function render404() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Not found</title>
<style>body{background:#07070b;color:#fff;font-family:-apple-system,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}
a{color:#c4b5fd}</style></head><body><div style="text-align:center">
<h1 style="font-size:48px;margin-bottom:12px">404</h1><p>Nothing here. <a href="/">Back to the showcase →</a></p>
</div></body></html>`;
}

const HTML_HEADERS = {
  "content-type": "text/html;charset=UTF-8",
  "cache-control": "public, max-age=300",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "POST" && path === "/api/bid") {
      try {
        const body = await request.json();
        console.log("[bid request]", JSON.stringify(body));
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (path === "/") {
      return new Response(renderMosaic(), { headers: HTML_HEADERS });
    }
    if (path === "/rent-ruby") {
      return new Response(RENT_ROLL_HTML, { headers: HTML_HEADERS });
    }
    if (path === "/convicts-for-a-clean-ca") {
      return new Response(renderConvicts(), { headers: HTML_HEADERS });
    }

    return new Response(render404(), {
      status: 404,
      headers: HTML_HEADERS,
    });
  },
};
