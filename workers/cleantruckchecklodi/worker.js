// worker.js - Clean Truck Check Lodi | Mobile CARB Test
var worker_default = {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle contact form POST
    if (request.method === 'POST' && url.pathname === '/contact') {
      const formData = await request.formData();
      const name    = (formData.get('name')    || '').slice(0, 200);
      const phone   = (formData.get('phone')   || '').slice(0, 50);
      const email   = (formData.get('email')   || '').slice(0, 200);
      const service = (formData.get('service') || '').slice(0, 200);
      const trucks  = (formData.get('trucks')  || '').slice(0, 20);
      const message = (formData.get('message') || '').slice(0, 1000);

      // Send notification email via MailChannels
      const emailBody = [
        `New CARB Test Request — Lodi`,
        ``,
        `Name:     ${name}`,
        `Phone:    ${phone}`,
        `Email:    ${email || '(not provided)'}`,
        `Service:  ${service}`,
        `Trucks:   ${trucks || '1'}`,
        `Notes:    ${message || '(none)'}`,
        ``,
        `Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`,
        `Source: cleantruckcheckhayward.com (Lodi)`,
      ].join('\n');

      try {
        await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: 'bryan@norcalcarbmobile.com', name: 'Bryan' }] }],
            from: { email: 'noreply@cleantruckcheckhayward.com', name: 'Clean Truck Check Lodi' },
            reply_to: email ? { email, name } : undefined,
            subject: `New Test Request: ${name} — ${service || 'Lodi'}`,
            content: [{ type: 'text/plain', value: emailBody }],
          }),
        });
      } catch (_) { /* email delivery failure is non-fatal */ }

      const thanks = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Thanks! | Clean Truck Check Lodi</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:#003DA5;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.card{background:#fff;color:#1a1a1a;border-radius:12px;padding:50px 40px;text-align:center;max-width:500px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.3)}
h1{font-family:'Oswald',sans-serif;color:#003DA5;font-size:36px;margin-bottom:15px}
p{color:#555;margin-bottom:25px;line-height:1.6}
a{display:inline-block;background:#003DA5;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-family:'Oswald',sans-serif;letter-spacing:.5px}
</style></head><body>
<div class="card">
  <h1>&#10003; Got It!</h1>
  <p>Thanks ${name ? name.split(' ')[0] : 'there'} — we'll call you back at <strong>${phone || 'the number you provided'}</strong> shortly.<br><br>Or reach us directly: <strong>(209) 818-1371</strong></p>
  <a href="/">&#8592; Back to Home</a>
</div></body></html>`;
      return new Response(thanks, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mobile CARB Clean Truck Check in Lodi, CA. Licensed HD-OBD and smoke/opacity testing for heavy-duty diesel trucks. We come to you — no downtime. CARB Tester ID: IF530523.">
    <meta name="keywords" content="CARB testing Lodi, Clean Truck Check Lodi, mobile emissions testing Lodi CA, HD-OBD testing San Joaquin, smoke opacity test Lodi, mobile CARB tester Stockton area">
    <meta name="geo.position" content="38.1302;-121.2724">
    <meta name="ICBM" content="38.1302,-121.2724">
    <meta name="geo.placename" content="Lodi, California">
    <meta name="geo.region" content="US-CA">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Mobile CARB Testing Lodi, CA | Clean Truck Check">
    <meta property="og:description" content="Licensed mobile CARB emissions testing in Lodi, CA. HD-OBD and smoke/opacity — we come to your yard. Tester ID: IF530523.">
    <meta property="og:type" content="business.business">
    <meta property="og:url" content="https://cleantruckcheckhayward.com">
    <meta name="theme-color" content="#003DA5">
    <title>Mobile CARB Testing Lodi CA | Clean Truck Check — HD-OBD &amp; Opacity</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }

        :root {
            --blue:      #003DA5;
            --blue-dark: #00277a;
            --blue-mid:  #0050cc;
            --white:     #FFFFFF;
            --silver:    #A5ACAF;
            --text:      #1a1a2e;
            --text-soft: #4a4a68;
            --bg:        #f5f7fc;
            --gold:      #EBB82B;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            color: var(--text);
            background: var(--white);
            line-height: 1.6;
            overflow-x: hidden;
        }

        h1,h2,h3,h4 { font-family:'Oswald',sans-serif; letter-spacing:.5px; }

        .container       { max-width:1200px; margin:0 auto; padding:0 20px; }
        .section-padding { padding:70px 0; }
        @media(max-width:768px){ .section-padding{ padding:44px 0; } }

        /* ── HEADER ── */
        header {
            background: var(--blue);
            border-bottom: 4px solid var(--gold);
            position: sticky; top:0; z-index:1000;
            box-shadow: 0 2px 12px rgba(0,0,0,.35);
        }
        .header-content { display:flex; justify-content:space-between; align-items:center; padding:14px 0; }
        .logo {
            font-family:'Oswald',sans-serif; font-size:26px; font-weight:700;
            color:var(--white); text-decoration:none; display:flex; align-items:center;
            gap:10px; letter-spacing:1px; text-transform:uppercase;
        }
        .logo span { color:var(--gold); font-size:15px; font-weight:500; text-transform:none; letter-spacing:0; }
        .call-btn {
            background:var(--gold); color:var(--blue-dark); padding:12px 26px; border-radius:5px;
            text-decoration:none; font-family:'Oswald',sans-serif; font-weight:700; font-size:17px;
            letter-spacing:.5px; transition:all .25s; display:flex; align-items:center; gap:8px;
        }
        .call-btn:hover { background:var(--white); transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,0,0,.25); }
        @media(max-width:600px){ .logo span{display:none;} .call-btn{padding:10px 18px;font-size:15px;} }

        /* ── HERO ── */
        .hero {
            background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 60%, var(--blue-mid) 100%);
            padding:110px 0 90px; text-align:center; position:relative; overflow:hidden;
        }
        .hero::before {
            content:''; position:absolute; inset:0;
            background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
            pointer-events:none;
        }
        .hero::after {
            content:''; position:absolute; bottom:-1px; left:0; right:0; height:60px;
            background:var(--white); clip-path:ellipse(55% 100% at 50% 100%);
        }
        .hero-content { position:relative; z-index:2; animation:fadeUp .8s ease; }

        .hero-eyebrow {
            display:inline-block; background:rgba(235,184,43,.2); border:1px solid var(--gold);
            color:var(--gold); font-family:'Oswald',sans-serif; font-size:13px; letter-spacing:2px;
            text-transform:uppercase; padding:6px 16px; border-radius:20px; margin-bottom:22px;
        }
        .hero h1 { font-size:60px; font-weight:700; color:var(--white); line-height:1.1; margin-bottom:22px; text-transform:uppercase; }
        .hero h1 .hl { color:var(--gold); }
        .hero p { font-size:19px; color:rgba(255,255,255,.82); margin-bottom:32px; max-width:680px; margin-left:auto; margin-right:auto; }

        .compliance-alert {
            display:inline-block; background:rgba(235,184,43,.15); border:1px solid rgba(235,184,43,.5);
            border-left:4px solid var(--gold); color:#ffe899; padding:14px 22px; border-radius:6px;
            font-size:15px; margin-bottom:36px; max-width:600px;
        }

        .cta-buttons { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-bottom:52px; }
        .btn-primary {
            background:var(--gold); color:var(--blue-dark); padding:17px 42px;
            font-family:'Oswald',sans-serif; font-size:18px; font-weight:700; letter-spacing:.5px;
            border-radius:6px; text-decoration:none; transition:all .25s; border:none; cursor:pointer;
        }
        .btn-primary:hover { background:var(--white); transform:translateY(-3px); box-shadow:0 6px 22px rgba(0,0,0,.3); }
        .btn-secondary {
            background:transparent; color:var(--white); padding:17px 42px;
            font-family:'Oswald',sans-serif; font-size:18px; font-weight:600; letter-spacing:.5px;
            border-radius:6px; text-decoration:none; border:2px solid rgba(255,255,255,.6); transition:all .25s;
        }
        .btn-secondary:hover { border-color:var(--white); background:rgba(255,255,255,.1); transform:translateY(-3px); }
        @media(max-width:600px){
            .hero h1{font-size:38px;} .hero p{font-size:16px;}
            .btn-primary,.btn-secondary{width:100%;text-align:center;padding:15px 20px;}
        }

        .trust-row { display:flex; justify-content:center; gap:40px; flex-wrap:wrap; }
        .badge { text-align:center; color:rgba(255,255,255,.85); }
        .badge-icon  { font-size:30px; margin-bottom:6px; }
        .badge-label { font-size:12px; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,.55); }
        .badge-val   { font-family:'Oswald',sans-serif; font-size:18px; color:var(--gold); font-weight:600; }

        /* ── STATS BAR ── */
        .stats-bar {
            background:var(--blue-dark); padding:22px 0;
            border-top:1px solid rgba(255,255,255,.1); border-bottom:4px solid var(--gold);
        }
        .stats-inner { display:flex; justify-content:center; gap:60px; flex-wrap:wrap; }
        .stat { text-align:center; }
        .stat-num  { font-family:'Oswald',sans-serif; font-size:36px; font-weight:700; color:var(--gold); }
        .stat-desc { font-size:13px; color:rgba(255,255,255,.6); text-transform:uppercase; letter-spacing:1px; }
        @media(max-width:600px){ .stats-inner{gap:28px;} .stat-num{font-size:28px;} }

        /* ── SERVICES ── */
        .services { background:var(--bg); }
        .section-title    { font-size:44px; font-weight:700; text-align:center; margin-bottom:12px; color:var(--blue); text-transform:uppercase; }
        .section-subtitle { text-align:center; color:var(--text-soft); font-size:17px; margin-bottom:50px; max-width:600px; margin-left:auto; margin-right:auto; }
        @media(max-width:600px){ .section-title{font-size:32px;} }

        .services-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:26px; }
        .service-card {
            background:var(--white); border:2px solid #dde3f0; border-radius:10px;
            padding:36px 28px; text-align:center; transition:all .25s;
        }
        .service-card:hover { border-color:var(--blue); transform:translateY(-6px); box-shadow:0 10px 30px rgba(0,61,165,.12); }
        .service-icon { font-size:46px; margin-bottom:16px; }
        .service-card h3   { font-size:22px; color:var(--blue); margin-bottom:12px; }
        .service-card p    { color:var(--text-soft); font-size:14px; margin-bottom:18px; }
        .service-price     { font-family:'Oswald',sans-serif; font-size:32px; font-weight:700; color:var(--blue); margin-bottom:16px; }
        .service-cta {
            display:inline-block; color:var(--white); background:var(--blue); padding:9px 22px;
            border-radius:4px; text-decoration:none; font-family:'Oswald',sans-serif;
            font-weight:600; font-size:14px; letter-spacing:.5px; transition:background .2s;
        }
        .service-cta:hover { background:var(--blue-dark); }

        /* ── WHY MOBILE ── */
        .why-mobile { background:var(--white); }
        .benefits-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:32px; margin-top:48px; }
        .benefit-item  { display:flex; gap:18px; }
        .benefit-icon  {
            flex-shrink:0; width:52px; height:52px; background:var(--blue); border-radius:10px;
            display:flex; align-items:center; justify-content:center; font-size:24px; color:var(--white);
        }
        .benefit-content h4 { font-size:18px; color:var(--blue); margin-bottom:6px; }
        .benefit-content p  { color:var(--text-soft); font-size:14px; }

        /* ── SERVICE AREA ── */
        .service-area { background:var(--bg); }
        .area-layout  { display:grid; grid-template-columns:1fr 1fr; gap:50px; align-items:start; margin-top:48px; }
        @media(max-width:768px){ .area-layout{grid-template-columns:1fr;gap:32px;} }
        .area-text h3 { font-size:28px; color:var(--blue); margin-bottom:16px; }
        .area-text p  { color:var(--text-soft); font-size:15px; margin-bottom:24px; line-height:1.7; }

        .coverage-list { list-style:none; margin-bottom:28px; }
        .coverage-list li {
            padding:11px 0; border-bottom:1px solid #dde3f0; color:var(--text-soft);
            display:flex; align-items:center; gap:12px; font-size:15px;
        }
        .coverage-list li::before { content:'✓'; color:var(--blue); font-weight:700; font-size:16px; }

        .info-card { background:var(--blue); border-radius:12px; padding:40px; text-align:center; color:var(--white); }
        .info-card h3  { font-size:26px; margin-bottom:24px; color:var(--gold); }
        .info-row      { margin-bottom:24px; }
        .info-label    { font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:rgba(255,255,255,.5); margin-bottom:6px; }
        .info-phone    { font-family:'Oswald',sans-serif; font-size:28px; font-weight:700; color:var(--gold); text-decoration:none; }
        .info-val      { font-family:'Oswald',sans-serif; font-size:18px; font-weight:600; color:var(--white); }
        .info-soft     { font-size:14px; color:rgba(255,255,255,.7); }
        .info-book-btn {
            display:inline-block; background:var(--gold); color:var(--blue-dark); padding:13px 30px;
            border-radius:6px; text-decoration:none; font-family:'Oswald',sans-serif;
            font-weight:700; font-size:16px; letter-spacing:.5px; transition:all .2s; margin-top:8px;
        }
        .info-book-btn:hover { background:var(--white); transform:translateY(-2px); }

        /* ── FAQ ── */
        .faq { background:var(--white); }
        .faq-wrap { max-width:820px; margin:0 auto; }
        .faq-item { border:1px solid #dde3f0; border-radius:8px; margin-bottom:12px; overflow:hidden; transition:border-color .2s; }
        .faq-item:hover { border-color:var(--blue); }
        .faq-question { padding:20px 22px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; background:#f8f9fe; transition:background .2s; }
        .faq-question:hover { background:#eef1fb; }
        .faq-item.active .faq-question { background:var(--blue); }
        .faq-question h4 { font-size:16px; color:var(--text); margin:0; flex:1; }
        .faq-item.active .faq-question h4 { color:var(--white); }
        .faq-toggle { color:var(--blue); font-size:22px; font-weight:700; transition:transform .3s; }
        .faq-item.active .faq-toggle { transform:rotate(45deg); color:var(--gold); }
        .faq-answer { max-height:0; overflow:hidden; transition:max-height .35s ease; }
        .faq-item.active .faq-answer { max-height:400px; }
        .faq-answer p { padding:18px 22px; color:var(--text-soft); font-size:15px; line-height:1.7; }

        /* ── CONTACT ── */
        .contact-section { background:var(--bg); }
        .contact-layout  { display:grid; grid-template-columns:1fr 1fr; gap:50px; align-items:start; margin-top:48px; }
        @media(max-width:768px){ .contact-layout{grid-template-columns:1fr;gap:36px;} }
        .contact-info h3 { font-size:28px; color:var(--blue); margin-bottom:16px; }
        .contact-info p  { color:var(--text-soft); font-size:15px; line-height:1.7; margin-bottom:24px; }
        .contact-detail  { display:flex; align-items:center; gap:14px; margin-bottom:16px; }
        .contact-detail-icon {
            width:44px; height:44px; background:var(--blue); border-radius:8px;
            display:flex; align-items:center; justify-content:center; font-size:20px; color:var(--white); flex-shrink:0;
        }
        .contact-detail a { color:var(--blue); text-decoration:none; font-weight:600; font-size:17px; }
        .contact-detail a:hover { color:var(--blue-dark); }
        .contact-detail small { color:var(--text-soft); font-size:13px; display:block; }

        .form-card { background:var(--white); border:2px solid #dde3f0; border-radius:12px; padding:36px 32px; box-shadow:0 4px 20px rgba(0,61,165,.07); }
        .form-card h3 { font-size:24px; color:var(--blue); margin-bottom:22px; }
        .form-group { margin-bottom:18px; }
        .form-group label { display:block; font-size:13px; font-weight:600; color:var(--text); margin-bottom:7px; text-transform:uppercase; letter-spacing:.5px; }
        .form-group input,
        .form-group textarea,
        .form-group select { width:100%; padding:12px 14px; border:2px solid #dde3f0; border-radius:6px; font-size:15px; color:var(--text); font-family:inherit; transition:border-color .2s; background:var(--white); }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus { outline:none; border-color:var(--blue); }
        .form-group textarea { resize:vertical; min-height:100px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:500px){ .form-row{grid-template-columns:1fr;} }
        .form-submit {
            width:100%; background:var(--blue); color:var(--white); padding:15px; border:none;
            border-radius:6px; font-family:'Oswald',sans-serif; font-size:18px; font-weight:700;
            letter-spacing:.5px; cursor:pointer; transition:all .25s; margin-top:6px;
        }
        .form-submit:hover { background:var(--blue-dark); transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,61,165,.3); }

        /* ── CTA BANNER ── */
        .cta-banner { background:var(--blue); padding:60px 0; text-align:center; border-top:4px solid var(--gold); }
        .cta-banner h2 { font-size:40px; color:var(--white); margin-bottom:14px; text-transform:uppercase; }
        .cta-banner p  { font-size:18px; color:rgba(255,255,255,.8); margin-bottom:32px; max-width:580px; margin-left:auto; margin-right:auto; }
        .cta-pair { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
        @media(max-width:600px){ .cta-banner h2{font-size:30px;} .cta-pair a{width:100%;text-align:center;} }

        /* ── FOOTER ── */
        footer { background:var(--blue-dark); border-top:4px solid var(--gold); padding:52px 0 28px; }
        .footer-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:36px; margin-bottom:40px; }
        .footer-section h4 { font-family:'Oswald',sans-serif; font-size:15px; color:var(--gold); margin-bottom:16px; letter-spacing:1px; text-transform:uppercase; }
        .footer-section ul { list-style:none; }
        .footer-section ul li { margin-bottom:10px; }
        .footer-section a { color:rgba(255,255,255,.65); text-decoration:none; font-size:14px; transition:color .2s; }
        .footer-section a:hover { color:var(--gold); }
        .footer-contact-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .footer-contact-row span { color:var(--gold); font-size:18px; }
        .footer-contact-row a { color:rgba(255,255,255,.7); text-decoration:none; font-size:14px; }
        .footer-contact-row a:hover { color:var(--gold); }
        .footer-bottom { text-align:center; padding-top:26px; border-top:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.4); font-size:13px; line-height:1.8; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .reveal   { opacity:0; transform:translateY(22px); transition:opacity .6s ease,transform .6s ease; }
        .revealed { opacity:1; transform:translateY(0); }
    </style>
</head>
<body>

<!-- HEADER -->
<header>
    <div class="container">
        <div class="header-content">
            <a href="#hero" class="logo">🚛 Clean Truck Check <span>Lodi, CA</span></a>
            <a href="tel:2098181371" class="call-btn">📞 (209) 818-1371</a>
        </div>
    </div>
</header>

<!-- HERO -->
<section class="hero" id="hero">
    <div class="container">
        <div class="hero-content">
            <div class="hero-eyebrow">&#9733; 4.9 Rated &nbsp;|&nbsp; CARB Tester ID: IF530523 &nbsp;|&nbsp; Lodi, CA</div>
            <h1>Mobile CARB Testing<br>in <span class="hl">Lodi, CA</span></h1>
            <p>We bring the equipment to your yard. No downtime, no shop trips. HD-OBD &amp; smoke/opacity testing for Lodi, Stockton, Galt, and the San Joaquin Valley.</p>
            <div class="compliance-alert">
                ⚠️ 2026 biannual testing is NOW REQUIRED. Get compliant before citations start.
            </div>
            <div class="cta-buttons">
                <a href="tel:2098181371" class="btn-primary">📞 Call Now: (209) 818-1371</a>
                <a href="#contact" class="btn-secondary">Schedule Online ↓</a>
            </div>
            <div class="trust-row">
                <div class="badge"><div class="badge-icon">⭐</div><div class="badge-val">4.9 / 47+</div><div class="badge-label">Verified Reviews</div></div>
                <div class="badge"><div class="badge-icon">✔</div><div class="badge-val">IF530523</div><div class="badge-label">CARB Tester ID</div></div>
                <div class="badge"><div class="badge-icon">🚛</div><div class="badge-val">We Come to You</div><div class="badge-label">Mobile Service</div></div>
                <div class="badge"><div class="badge-icon">⚡</div><div class="badge-val">Same-Day</div><div class="badge-label">Often Available</div></div>
            </div>
        </div>
    </div>
</section>

<!-- STATS -->
<div class="stats-bar">
    <div class="container">
        <div class="stats-inner">
            <div class="stat"><div class="stat-num">500+</div><div class="stat-desc">Trucks Tested</div></div>
            <div class="stat"><div class="stat-num">4.9★</div><div class="stat-desc">Average Rating</div></div>
            <div class="stat"><div class="stat-num">100%</div><div class="stat-desc">Licensed &amp; Certified</div></div>
            <div class="stat"><div class="stat-num">Same-Day</div><div class="stat-desc">Often Available</div></div>
        </div>
    </div>
</div>

<!-- SERVICES -->
<section class="services section-padding" id="services">
    <div class="container">
        <h2 class="section-title reveal">Our Services</h2>
        <p class="section-subtitle reveal">Professional mobile CARB emissions testing for trucks, fleets &amp; RVs — serving Lodi and the San Joaquin Valley.</p>
        <div class="services-grid">
            <div class="service-card reveal">
                <div class="service-icon">🔧</div>
                <h3>HD-OBD Testing</h3>
                <p>Heavy-duty on-board diagnostic testing for 2013+ trucks. Full compliance certification on the spot.</p>
                <div class="service-price">$75</div>
                <a href="tel:2098181371" class="service-cta">Book Now →</a>
            </div>
            <div class="service-card reveal">
                <div class="service-icon">💨</div>
                <h3>Smoke / Opacity Testing</h3>
                <p>Professional smoke and opacity testing with official CARB documentation delivered same day.</p>
                <div class="service-price">$199</div>
                <a href="tel:2098181371" class="service-cta">Book Now →</a>
            </div>
            <div class="service-card reveal">
                <div class="service-icon">🚛</div>
                <h3>Fleet Opacity Testing</h3>
                <p>Multi-vehicle fleet testing at your yard with volume pricing. Minimal disruption to operations.</p>
                <div class="service-price">$149+</div>
                <a href="tel:2098181371" class="service-cta">Get Fleet Quote →</a>
            </div>
            <div class="service-card reveal">
                <div class="service-icon">🏠</div>
                <h3>RV / Motorhome Testing</h3>
                <p>Full CARB testing for RVs and motorhomes. We handle all documentation and compliance paperwork.</p>
                <div class="service-price">$300</div>
                <a href="tel:2098181371" class="service-cta">Book Now →</a>
            </div>
        </div>
    </div>
</section>

<!-- WHY MOBILE -->
<section class="why-mobile section-padding" id="why-mobile">
    <div class="container">
        <h2 class="section-title reveal">Why Mobile CARB Testing?</h2>
        <p class="section-subtitle reveal">Stop taking trucks out of service. We bring certified testing equipment directly to you.</p>
        <div class="benefits-grid">
            <div class="benefit-item reveal"><div class="benefit-icon">⏱</div><div class="benefit-content"><h4>Zero Downtime</h4><p>Testing happens at your location, on your schedule. Keep your trucks moving.</p></div></div>
            <div class="benefit-item reveal"><div class="benefit-icon">💰</div><div class="benefit-content"><h4>Save Money</h4><p>No fuel costs driving to a shop. Volume discounts for fleets of 3+ vehicles.</p></div></div>
            <div class="benefit-item reveal"><div class="benefit-icon">✔</div><div class="benefit-content"><h4>100% Licensed</h4><p>CARB Tester ID IF530523. Every test meets 2026 biannual compliance requirements.</p></div></div>
            <div class="benefit-item reveal"><div class="benefit-icon">📋</div><div class="benefit-content"><h4>Instant Docs</h4><p>Official certificates delivered on the spot — digital and printed. No waiting.</p></div></div>
            <div class="benefit-item reveal"><div class="benefit-icon">📍</div><div class="benefit-content"><h4>Valley-Wide Coverage</h4><p>Lodi, Stockton, Galt, Woodbridge, Lathrop, Manteca, Modesto — the whole San Joaquin corridor.</p></div></div>
            <div class="benefit-item reveal"><div class="benefit-icon">⭐</div><div class="benefit-content"><h4>Top-Rated Service</h4><p>4.9★ from 47+ verified reviews. Fast, professional, reliable — every time.</p></div></div>
        </div>
    </div>
</section>

<!-- SERVICE AREA -->
<section class="service-area section-padding" id="service-area">
    <div class="container">
        <h2 class="section-title reveal">Serving Lodi &amp; the San Joaquin Valley</h2>
        <div class="area-layout">
            <div class="area-text reveal">
                <h3>Your Local Mobile CARB Tester</h3>
                <p>Mobile CARB Test serves Lodi and the surrounding San Joaquin Valley. Our technicians drive to your location — fleet yard, farm, warehouse, or job site — so your trucks don't lose a minute of operational time. Lodi sits at the heart of California's busiest trucking corridors, making timely CARB compliance critical.</p>
                <ul class="coverage-list">
                    <li>Lodi (Primary Service City)</li>
                    <li>Stockton &amp; South Stockton</li>
                    <li>Galt &amp; Elk Grove</li>
                    <li>Woodbridge &amp; Acampo</li>
                    <li>Lathrop &amp; Manteca</li>
                    <li>Modesto &amp; Turlock</li>
                    <li>I-5 &amp; Hwy 99 Corridor</li>
                    <li>San Joaquin County Ag Areas</li>
                </ul>
            </div>
            <div class="info-card reveal">
                <h3>Lodi Service Info</h3>
                <div class="info-row">
                    <div class="info-label">Call or Text</div>
                    <a href="tel:2098181371" class="info-phone">(209) 818-1371</a>
                </div>
                <div class="info-row">
                    <div class="info-label">CARB Tester ID</div>
                    <div class="info-val">IF530523</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Service Hours</div>
                    <div class="info-soft">Mon – Fri: 6am – 5pm<br>Saturday: 8am – 4pm</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Company</div>
                    <div class="info-val">Mobile CARB Test</div>
                </div>
                <a href="#contact" class="info-book-btn">Book Your Test ↓</a>
            </div>
        </div>
    </div>
</section>

<!-- FAQ -->
<section class="faq section-padding" id="faq">
    <div class="container">
        <h2 class="section-title reveal">Frequently Asked Questions</h2>
        <p class="section-subtitle reveal">Everything you need to know about CARB testing in Lodi.</p>
        <div class="faq-wrap">
            <div class="faq-item reveal">
                <div class="faq-question"><h4>What is CARB Clean Truck Check testing?</h4><span class="faq-toggle">+</span></div>
                <div class="faq-answer"><p>California's Clean Truck Check program requires biannual emissions testing for heavy-duty diesel trucks. As of 2026, all qualifying vehicles must undergo HD-OBD or smoke/opacity testing every two years. Failure to comply can result in citations and registration holds.</p></div>
            </div>
            <div class="faq-item reveal">
                <div class="faq-question"><h4>Do you actually come to Lodi, or do I need to drive somewhere?</h4><span class="faq-toggle">+</span></div>
                <div class="faq-answer"><p>We come to you — that's the whole point. Our mobile unit drives to your location in Lodi, your fleet yard, a job site, or anywhere else in the San Joaquin Valley. No need to haul your truck to a testing station.</p></div>
            </div>
            <div class="faq-item reveal">
                <div class="faq-question"><h4>How long does testing take?</h4><span class="faq-toggle">+</span></div>
                <div class="faq-answer"><p>HD-OBD testing runs 30–45 minutes per truck. Smoke/opacity is faster at 15–30 minutes. For fleet jobs we stack tests efficiently to minimize downtime. You'll have official certificates before we leave.</p></div>
            </div>
            <div class="faq-item reveal">
                <div class="faq-question"><h4>What's the difference between HD-OBD and smoke/opacity testing?</h4><span class="faq-toggle">+</span></div>
                <div class="faq-answer"><p>HD-OBD reads the truck's onboard computer — required for 2013 and newer. Smoke/opacity tests visible exhaust emissions during load acceleration — typically for older trucks. Call us and we'll tell you which one your vehicle needs.</p></div>
            </div>
            <div class="faq-item reveal">
                <div class="faq-question"><h4>How much does it cost?</h4><span class="faq-toggle">+</span></div>
                <div class="faq-answer"><p>HD-OBD: <strong>$75</strong> · Smoke/Opacity: <strong>$199</strong> · Fleet Opacity: <strong>from $149</strong> with volume discounts · RV/Motorhome: <strong>$300</strong>. Call (209) 818-1371 for a fleet quote.</p></div>
            </div>
            <div class="faq-item reveal">
                <div class="faq-question"><h4>What if my truck doesn't pass?</h4><span class="faq-toggle">+</span></div>
                <div class="faq-answer"><p>We document the failure and explain what triggered it. Most failures trace to a maintenance issue — DPF cleaning, EGR service, or a fault code. Once repaired, call us to schedule a retest. We keep your file on record.</p></div>
            </div>
            <div class="faq-item reveal">
                <div class="faq-question"><h4>Are you available on weekends?</h4><span class="faq-toggle">+</span></div>
                <div class="faq-answer"><p>Yes — Saturdays 8am to 4pm. Call (209) 818-1371 to check availability. We fill up on Saturdays, so call ahead to lock in your slot.</p></div>
            </div>
        </div>
    </div>
</section>

<!-- CONTACT -->
<section class="contact-section section-padding" id="contact">
    <div class="container">
        <h2 class="section-title reveal">Schedule Your Test</h2>
        <p class="section-subtitle reveal">Fill out the form and we'll call you back to confirm — usually within the hour.</p>
        <div class="contact-layout">
            <div class="contact-info reveal">
                <h3>Get in Touch</h3>
                <p>Prefer to talk? Call or text us directly. We serve Lodi, Stockton, Galt, Woodbridge, Lathrop, Manteca, and throughout San Joaquin County.</p>
                <div class="contact-detail">
                    <div class="contact-detail-icon">📞</div>
                    <div><a href="tel:2098181371">(209) 818-1371</a><small>Call or text — Mon–Sat</small></div>
                </div>
                <div class="contact-detail">
                    <div class="contact-detail-icon">✉️</div>
                    <div><a href="mailto:info@mobilecarbtest.com">info@mobilecarbtest.com</a><small>Same business day response</small></div>
                </div>
                <div class="contact-detail">
                    <div class="contact-detail-icon">📍</div>
                    <div><span style="color:var(--blue);font-weight:600;">Lodi, CA 95240</span><small>Mobile — we come to you</small></div>
                </div>
                <div class="contact-detail">
                    <div class="contact-detail-icon">🕐</div>
                    <div><span style="color:var(--blue);font-weight:600;">Mon–Fri 6am–5pm · Sat 8am–4pm</span><small>Often same-day available</small></div>
                </div>
            </div>
            <div class="form-card reveal">
                <h3>Request a Test</h3>
                <form action="/contact" method="POST">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Your Name *</label>
                            <input type="text" id="name" name="name" required placeholder="John Smith">
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone / Text *</label>
                            <input type="tel" id="phone" name="phone" required placeholder="(209) 555-0100">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@example.com">
                    </div>
                    <div class="form-group">
                        <label for="service">Service Needed *</label>
                        <select id="service" name="service" required>
                            <option value="">— Select a Service —</option>
                            <option>HD-OBD Testing ($75)</option>
                            <option>Smoke / Opacity Testing ($199)</option>
                            <option>Fleet Opacity Testing ($149+)</option>
                            <option>RV / Motorhome Testing ($300)</option>
                            <option>Not Sure — Need Advice</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="trucks">Number of Trucks</label>
                        <input type="number" id="trucks" name="trucks" min="1" placeholder="1">
                    </div>
                    <div class="form-group">
                        <label for="message">Location / Notes</label>
                        <textarea id="message" name="message" placeholder="Your address in Lodi or nearby, preferred dates, truck year/make, etc."></textarea>
                    </div>
                    <button type="submit" class="form-submit">Send Request ↗</button>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- CTA BANNER -->
<section class="cta-banner">
    <div class="container">
        <h2>Ready to Get Compliant?</h2>
        <p>Mobile CARB testing in Lodi. Quick, professional, certified — we come to your yard. Don't wait for a citation.</p>
        <div class="cta-pair">
            <a href="tel:2098181371" class="btn-primary">📞 Call (209) 818-1371</a>
            <a href="#contact" class="btn-secondary" style="border-color:rgba(255,255,255,.6);color:#fff;">Schedule Online ↓</a>
        </div>
    </div>
</section>

<!-- FOOTER -->
<footer>
    <div class="container">
        <div class="footer-grid">
            <div class="footer-section">
                <h4>Clean Truck Check Lodi</h4>
                <p style="color:rgba(255,255,255,.55);font-size:14px;margin-bottom:14px;line-height:1.6;">Mobile CARB emissions testing serving Lodi, Stockton, Galt, Woodbridge, Lathrop, and San Joaquin County.</p>
                <div class="footer-contact-row"><span>📞</span><a href="tel:2098181371">(209) 818-1371</a></div>
                <div class="footer-contact-row"><span>✉️</span><a href="mailto:info@mobilecarbtest.com">info@mobilecarbtest.com</a></div>
            </div>
            <div class="footer-section">
                <h4>Services</h4>
                <ul>
                    <li><a href="#services">HD-OBD Testing</a></li>
                    <li><a href="#services">Smoke / Opacity Testing</a></li>
                    <li><a href="#services">Fleet Testing</a></li>
                    <li><a href="#services">RV / Motorhome Testing</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Service Area</h4>
                <ul>
                    <li><a href="#service-area">Lodi, CA</a></li>
                    <li><a href="#service-area">Stockton, CA</a></li>
                    <li><a href="#service-area">Galt &amp; Elk Grove</a></li>
                    <li><a href="#service-area">Lathrop &amp; Manteca</a></li>
                    <li><a href="#service-area">Modesto &amp; Turlock</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Info</h4>
                <ul>
                    <li><a href="#faq">FAQ</a></li>
                    <li><a href="#why-mobile">Why Mobile?</a></li>
                    <li><a href="#contact">Schedule a Test</a></li>
                    <li><a href="https://cleantruckcheck.arb.ca.gov" target="_blank" rel="noopener">CARB Official Site ↗</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p><strong style="color:rgba(255,255,255,.7);">Mobile CARB Test</strong> &nbsp;|&nbsp; CARB Tester ID: IF530523 &nbsp;|&nbsp; Licensed Emissions Testing</p>
            <p>Serving Lodi · Stockton · Galt · Woodbridge · Lathrop · Manteca · San Joaquin County</p>
            <p>&copy; 2026 Clean Truck Check Lodi. All rights reserved.</p>
        </div>
    </div>
</footer>

<!-- SCHEMA -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Clean Truck Check Lodi",
    "description": "Mobile CARB emissions testing in Lodi, CA. HD-OBD and smoke/opacity testing for trucks and fleets. Licensed CARB tester IF530523.",
    "telephone": "209-818-1371",
    "email": "info@mobilecarbtest.com",
    "url": "https://cleantruckcheckhayward.com",
    "address": {"@type":"PostalAddress","addressLocality":"Lodi","addressRegion":"CA","postalCode":"95240","addressCountry":"US"},
    "geo": {"@type":"GeoCoordinates","latitude":38.1302,"longitude":-121.2724},
    "areaServed": [
        {"@type":"City","name":"Lodi","addressRegion":"CA"},
        {"@type":"City","name":"Stockton","addressRegion":"CA"},
        {"@type":"City","name":"Galt","addressRegion":"CA"},
        {"@type":"City","name":"Manteca","addressRegion":"CA"},
        {"@type":"City","name":"Lathrop","addressRegion":"CA"}
    ],
    "aggregateRating": {"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"47"},
    "openingHoursSpecification": [
        {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"06:00","closes":"17:00"},
        {"@type":"OpeningHoursSpecification","dayOfWeek":["Saturday"],"opens":"08:00","closes":"16:00"}
    ],
    "priceRange": "$75-$300"
}
<\/script>

<script>
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', function () {
            const item = this.closest('.faq-item');
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' }); }
        });
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
<\/script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow',
      }
    });
  }
};

export { worker_default as default };
