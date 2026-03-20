export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/robots.txt') {
      return new Response(
        `User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml`,
        { headers: { 'Content-Type': 'text/plain' } }
      );
    }

    if (url.pathname === '/sitemap.xml') {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url.origin}/</loc>
    <lastmod>2026-03-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
        { headers: { 'Content-Type': 'application/xml' } }
      );
    }

    if (url.pathname === '/api/book' && request.method === 'POST') {
      try {
        const data = await request.json();
        const id = crypto.randomUUID();
        await env.HTML_STORE.put(`booking:${id}`, JSON.stringify({ ...data, id, createdAt: new Date().toISOString() }));
        return new Response(JSON.stringify({ success: true, id }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clean Truck Check Fairfield | Mobile CARB Testing in Fairfield, CA</title>
<meta name="description" content="Mobile Clean Truck Check CARB testing in Fairfield, CA. HD-OBD &amp; Smoke Opacity testing. Licensed CARB tester comes to you. Call 916-890-4427.">
<meta name="geo.position" content="38.2494;-122.0400">
<meta name="geo.placename" content="Fairfield, CA">
<meta name="geo.region" content="US-CA">
<meta name="zipcode" content="94533">
<link rel="canonical" href="${url.origin}/">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0f1b2e;--bg-card:#162340;--bg-card-hover:#1a2d52;--green:#1a8c4a;--green-light:#22b15e;--green-dark:#14703b;--text:#e8ecf1;--text-muted:#8a9bb5;--white:#ffffff;--border:#243352;--shadow:0 4px 24px rgba(0,0,0,0.3);--radius:12px}
html{scroll-behavior:smooth;scroll-padding-top:80px}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}
a{color:var(--green-light);text-decoration:none;transition:color .2s}
a:hover{color:var(--white)}
img{max-width:100%;display:block}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.fade-up{opacity:0;transform:translateY(30px);transition:opacity .6s ease,transform .6s ease}
.fade-up.visible{opacity:1;transform:translateY(0)}

/* Header */
.header{position:sticky;top:0;z-index:1000;background:rgba(15,27,46,0.95);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:border-color .3s,box-shadow .3s}
.header.scrolled{border-bottom-color:var(--border);box-shadow:0 2px 20px rgba(0,0,0,0.4)}
.header-inner{max-width:1200px;margin:0 auto;padding:0.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:0.5rem;font-size:1.25rem;font-weight:700;color:var(--white)}
.logo span{font-size:1.5rem}
.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.5rem;border-radius:50px;font-weight:600;font-size:0.95rem;border:none;cursor:pointer;transition:all .25s;text-decoration:none}
.btn-green{background:var(--green);color:var(--white)}
.btn-green:hover{background:var(--green-light);color:var(--white);transform:translateY(-2px);box-shadow:0 4px 15px rgba(26,140,74,0.4)}
.btn-outline{border:2px solid var(--green);color:var(--green-light);background:transparent}
.btn-outline:hover{background:var(--green);color:var(--white);transform:translateY(-2px)}
.btn-lg{padding:0.85rem 2rem;font-size:1.05rem}

/* Hero */
.hero{padding:5rem 1.5rem 4rem;text-align:center;background:linear-gradient(180deg,rgba(26,140,74,0.08) 0%,transparent 60%)}
.hero h1{font-size:2.75rem;font-weight:800;line-height:1.15;margin-bottom:1rem;animation:fadeUp .8s ease}
.hero h1 .highlight{color:var(--green-light)}
.hero p{font-size:1.15rem;color:var(--text-muted);max-width:640px;margin:0 auto 1.5rem;animation:fadeUp .8s ease .15s both}
.compliance-alert{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(255,171,0,0.12);border:1px solid rgba(255,171,0,0.3);color:#ffab00;padding:0.6rem 1.25rem;border-radius:50px;font-weight:600;font-size:0.95rem;margin-bottom:2rem;animation:fadeUp .8s ease .3s both}
.cta-group{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;animation:fadeUp .8s ease .45s both}

/* Trust Badges */
.trust{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;padding:2.5rem 1.5rem;max-width:900px;margin:0 auto}
.trust-badge{display:flex;align-items:center;gap:0.5rem;background:var(--bg-card);padding:0.75rem 1.25rem;border-radius:50px;border:1px solid var(--border);font-weight:600;font-size:0.9rem}
.trust-badge .icon{font-size:1.2rem}

/* Section */
.section{padding:4rem 1.5rem;max-width:1200px;margin:0 auto}
.section-title{text-align:center;font-size:2rem;font-weight:700;margin-bottom:0.5rem}
.section-sub{text-align:center;color:var(--text-muted);margin-bottom:3rem;font-size:1.05rem}

/* Services Grid */
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem}
.service-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;transition:all .3s;position:relative;overflow:hidden}
.service-card:hover{transform:translateY(-4px);border-color:var(--green);box-shadow:0 8px 30px rgba(26,140,74,0.15)}
.service-card .emoji{font-size:2.5rem;margin-bottom:1rem}
.service-card h3{font-size:1.2rem;margin-bottom:0.5rem}
.service-card .price{color:var(--green-light);font-size:1.5rem;font-weight:700;margin:0.75rem 0}
.service-card p{color:var(--text-muted);font-size:0.9rem;line-height:1.5}

/* Benefits */
.benefits-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem}
.benefit{display:flex;gap:1rem;padding:1.5rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);transition:all .3s}
.benefit:hover{border-color:var(--green);transform:translateY(-2px)}
.benefit .icon{font-size:1.5rem;flex-shrink:0;width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:rgba(26,140,74,0.15);border-radius:10px}
.benefit h3{font-size:1rem;margin-bottom:0.25rem}
.benefit p{color:var(--text-muted);font-size:0.9rem}

/* Local Content */
.local-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start}
.area-list{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.area-list li{display:flex;align-items:center;gap:0.5rem;font-size:1rem}
.area-list li::before{content:'\\2713';color:var(--green-light);font-weight:700}
.info-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:2rem}
.info-card h3{font-size:1.25rem;margin-bottom:1rem;color:var(--green-light)}
.info-row{display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid var(--border);font-size:0.95rem}
.info-row:last-child{border-bottom:none}
.info-row .label{color:var(--text-muted)}

/* FAQ */
.faq-list{max-width:800px;margin:0 auto}
.faq-item{border:1px solid var(--border);border-radius:var(--radius);margin-bottom:0.75rem;overflow:hidden;background:var(--bg-card)}
.faq-q{padding:1.25rem 1.5rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:1rem;transition:background .2s;user-select:none}
.faq-q:hover{background:var(--bg-card-hover)}
.faq-q::after{content:'+';font-size:1.25rem;color:var(--green-light);transition:transform .3s;flex-shrink:0;margin-left:1rem}
.faq-item.open .faq-q::after{transform:rotate(45deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:0 1.5rem}
.faq-item.open .faq-a{max-height:300px;padding:0 1.5rem 1.25rem}
.faq-a p{color:var(--text-muted);font-size:0.95rem;line-height:1.7}

/* Final CTA */
.final-cta{text-align:center;padding:4rem 1.5rem;background:linear-gradient(180deg,transparent 0%,rgba(26,140,74,0.1) 100%)}
.final-cta h2{font-size:2rem;margin-bottom:0.75rem}
.final-cta p{color:var(--text-muted);margin-bottom:2rem;font-size:1.05rem}

/* Footer */
.footer{background:#0a1320;border-top:1px solid var(--border);padding:3rem 1.5rem 1.5rem}
.footer-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem}
.footer h4{font-size:1rem;margin-bottom:1rem;color:var(--white)}
.footer p,.footer li{color:var(--text-muted);font-size:0.9rem}
.footer ul{list-style:none}
.footer li{margin-bottom:0.5rem}
.footer-bottom{max-width:1200px;margin:2rem auto 0;padding-top:1.5rem;border-top:1px solid var(--border);text-align:center;color:var(--text-muted);font-size:0.85rem}

/* Responsive */
@media(max-width:768px){
  .hero h1{font-size:1.85rem}
  .local-grid{grid-template-columns:1fr}
  .area-list{grid-template-columns:1fr}
  .trust{gap:0.75rem}
  .trust-badge{font-size:0.8rem;padding:0.6rem 1rem}
  .section-title{font-size:1.5rem}
  .header-inner{padding:0.6rem 1rem}
  .logo{font-size:1rem}
}
</style>
</head>
<body>

<!-- Header -->
<header class="header" id="header">
  <div class="header-inner">
    <div class="logo"><span>🚚</span> Clean Truck Check Fairfield</div>
    <a href="tel:9168904427" class="btn btn-green">📞 Call Now</a>
  </div>
</header>

<!-- Hero -->
<section class="hero">
  <h1>Mobile CARB Testing in <span class="highlight">Fairfield, CA</span></h1>
  <p>Licensed CARB tester comes directly to your location. HD-OBD &amp; Smoke Opacity testing for trucks, fleets, and RVs across Solano County and the I-80 Corridor.</p>
  <div class="compliance-alert">⚠️ Biannual testing NOW REQUIRED in 2026</div>
  <div class="cta-group">
    <a href="tel:9168904427" class="btn btn-green btn-lg">📞 Call Now — 916-890-4427</a>
    <a href="https://norcalcarbmobile.com/#book" class="btn btn-outline btn-lg">📅 Schedule Online</a>
  </div>
</section>

<!-- Trust Badges -->
<div class="trust">
  <div class="trust-badge"><span class="icon">⭐</span> 4.9★ / 47+ Reviews</div>
  <div class="trust-badge"><span class="icon">🏛️</span> Licensed CARB Tester</div>
  <div class="trust-badge"><span class="icon">🚚</span> Mobile Service — We Come to You</div>
</div>

<!-- Services -->
<section class="section fade-up">
  <h2 class="section-title">Our Services</h2>
  <p class="section-sub">Complete CARB compliance testing — we bring the equipment to you</p>
  <div class="services-grid">
    <div class="service-card">
      <div class="emoji">🔧</div>
      <h3>HD-OBD Testing</h3>
      <div class="price">$75</div>
      <p>On-board diagnostics test for 2013+ heavy-duty diesel engines. Quick plug-in scan with instant CARB-compliant results.</p>
    </div>
    <div class="service-card">
      <div class="emoji">💨</div>
      <h3>Smoke / Opacity Test</h3>
      <div class="price">$199</div>
      <p>Full smoke opacity measurement for pre-2013 diesel trucks. Required for older engines not equipped with OBD systems.</p>
    </div>
    <div class="service-card">
      <div class="emoji">🚛</div>
      <h3>Fleet Opacity Testing</h3>
      <div class="price">$149+</div>
      <p>Volume discounts for fleets of 3+ vehicles. On-site testing at your yard or depot — minimal fleet downtime.</p>
    </div>
    <div class="service-card">
      <div class="emoji">🏠</div>
      <h3>RV / Motorhome Testing</h3>
      <div class="price">$300</div>
      <p>Diesel motorhome and RV emission testing. We come to your storage lot or residence — no need to move your vehicle.</p>
    </div>
  </div>
</section>

<!-- Why Mobile -->
<section class="section fade-up">
  <h2 class="section-title">Why Choose Mobile Testing?</h2>
  <p class="section-sub">Skip the trip to a testing center — we bring certified CARB testing to your door</p>
  <div class="benefits-grid">
    <div class="benefit">
      <div class="icon">⏱️</div>
      <div>
        <h3>Zero Downtime</h3>
        <p>Your trucks stay on the job. We test while you work — no trips to a testing center required.</p>
      </div>
    </div>
    <div class="benefit">
      <div class="icon">💰</div>
      <div>
        <h3>Cost Effective</h3>
        <p>Save on fuel, driver time, and lost productivity. Fleet discounts available for 3+ vehicles.</p>
      </div>
    </div>
    <div class="benefit">
      <div class="icon">🏛️</div>
      <div>
        <h3>Licensed CARB Tester</h3>
        <p>CARB Tester ID: IF530523. Fully licensed and insured for all heavy-duty diesel emission tests.</p>
      </div>
    </div>
    <div class="benefit">
      <div class="icon">📄</div>
      <div>
        <h3>Instant Documentation</h3>
        <p>Receive your official CARB compliance certificate on the spot — digital and printed copies available.</p>
      </div>
    </div>
    <div class="benefit">
      <div class="icon">🗺️</div>
      <div>
        <h3>I-80 Corridor Coverage</h3>
        <p>Serving Fairfield, Vacaville, Suisun City, Dixon, Vallejo, Benicia, Travis AFB area, and Napa.</p>
      </div>
    </div>
    <div class="benefit">
      <div class="icon">🔬</div>
      <div>
        <h3>Expert Diagnostics</h3>
        <p>If your vehicle doesn't pass, we provide guidance on repairs and offer affordable re-testing.</p>
      </div>
    </div>
  </div>
</section>

<!-- Local Content -->
<section class="section fade-up">
  <h2 class="section-title">Fairfield &amp; Solano County Service Area</h2>
  <p class="section-sub">Fast, reliable mobile CARB testing throughout Solano County and the I-80 / I-680 Corridor</p>
  <div class="local-grid">
    <div>
      <ul class="area-list">
        <li>Fairfield</li>
        <li>Vacaville</li>
        <li>Suisun City</li>
        <li>Dixon</li>
        <li>Vallejo</li>
        <li>Benicia</li>
        <li>Travis AFB Area</li>
        <li>Napa</li>
      </ul>
    </div>
    <div class="info-card">
      <h3>Fairfield Service Info</h3>
      <div class="info-row"><span class="label">Phone</span><span>916-890-4427</span></div>
      <div class="info-row"><span class="label">CARB Tester ID</span><span>IF530523</span></div>
      <div class="info-row"><span class="label">Mon – Fri</span><span>6:00 AM – 5:00 PM</span></div>
      <div class="info-row"><span class="label">Saturday</span><span>8:00 AM – 4:00 PM</span></div>
      <div class="info-row"><span class="label">Sunday</span><span>Closed</span></div>
      <div class="info-row"><span class="label">Rating</span><span>4.9★ (47+ Reviews)</span></div>
      <div class="info-row"><span class="label">Website</span><a href="https://norcalcarbmobile.com">norcalcarbmobile.com</a></div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section fade-up">
  <h2 class="section-title">Frequently Asked Questions</h2>
  <p class="section-sub">Everything you need to know about Clean Truck Check testing in Fairfield</p>
  <div class="faq-list">
    <div class="faq-item">
      <div class="faq-q">What is a CARB Clean Truck Check?</div>
      <div class="faq-a"><p>The Clean Truck Check is California's heavy-duty vehicle inspection program administered by CARB (California Air Resources Board). It requires periodic emissions testing of diesel trucks and buses to ensure they meet state air quality standards.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How long does testing take?</div>
      <div class="faq-a"><p>HD-OBD testing typically takes 15–20 minutes per vehicle. Smoke opacity testing takes around 20–30 minutes. Fleet testing is streamlined so we can process multiple vehicles efficiently at your location.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do you really come to my location?</div>
      <div class="faq-a"><p>Yes! We are a fully mobile CARB testing service. We bring all required equipment directly to your yard, depot, job site, or residence anywhere in the Fairfield and Solano County area.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What is the difference between HD-OBD and Opacity testing?</div>
      <div class="faq-a"><p>HD-OBD (Heavy-Duty On-Board Diagnostics) is a plug-in scan for 2013+ model year engines that checks the vehicle's built-in emissions monitoring system. Opacity testing uses a smoke meter to measure exhaust opacity for pre-2013 engines without OBD capability.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How much does testing cost?</div>
      <div class="faq-a"><p>HD-OBD testing is $75 per vehicle. Smoke/Opacity testing is $199. Fleet opacity testing starts at $149+ per vehicle (3+ vehicles). RV and motorhome testing is $300. All prices include the mobile service — no hidden fees.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Are you a licensed CARB tester?</div>
      <div class="faq-a"><p>Yes. We are a fully licensed and insured CARB tester. Our CARB Tester ID is IF530523. All test results are submitted directly to CARB and you receive official compliance documentation on-site.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How do I schedule an appointment?</div>
      <div class="faq-a"><p>You can call us directly at 916-890-4427 or schedule online through our website at norcalcarbmobile.com. We typically offer same-week appointments and can often accommodate next-day requests.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What happens if my truck fails the test?</div>
      <div class="faq-a"><p>If your vehicle does not pass, we provide a detailed report explaining the failure and recommend trusted repair shops in the Fairfield area. After repairs, we offer discounted re-testing to get you back in compliance quickly.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do you offer weekend testing?</div>
      <div class="faq-a"><p>Yes, we are available on Saturdays from 8:00 AM to 4:00 PM. We are closed on Sundays. For urgent fleet needs, contact us to discuss availability.</p></div>
    </div>
  </div>
</section>

<!-- Final CTA -->
<section class="final-cta fade-up">
  <h2>Get Your Truck Tested in Fairfield Today</h2>
  <p>Stay CARB compliant — licensed mobile testing at your location across Solano County and the I-80 Corridor.</p>
  <div class="cta-group">
    <a href="tel:9168904427" class="btn btn-green btn-lg">📞 Call 916-890-4427</a>
    <a href="https://norcalcarbmobile.com/#book" class="btn btn-outline btn-lg">📅 Schedule Online</a>
  </div>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-inner">
    <div>
      <h4>About</h4>
      <p>Clean Truck Check Fairfield provides licensed mobile CARB emission testing for heavy-duty diesel trucks, fleets, and RVs in Fairfield and Solano County.</p>
    </div>
    <div>
      <h4>Services</h4>
      <ul>
        <li>HD-OBD Testing</li>
        <li>Smoke / Opacity Testing</li>
        <li>Fleet Testing</li>
        <li>RV / Motorhome Testing</li>
      </ul>
    </div>
    <div>
      <h4>Service Area</h4>
      <ul>
        <li>Fairfield</li>
        <li>Vacaville &amp; Suisun City</li>
        <li>Dixon</li>
        <li>Vallejo &amp; Benicia</li>
        <li>Travis AFB &amp; Napa</li>
      </ul>
    </div>
    <div>
      <h4>Company</h4>
      <ul>
        <li><a href="tel:9168904427">916-890-4427</a></li>
        <li>CARB ID: IF530523</li>
        <li><a href="https://norcalcarbmobile.com">norcalcarbmobile.com</a></li>
        <li>Mon–Fri 6am–5pm</li>
        <li>Sat 8am–4pm</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">&copy; 2026 Clean Truck Check Fairfield. All rights reserved.</div>
</footer>

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "name": "Clean Truck Check Fairfield",
      "description": "Mobile CARB Clean Truck Check emission testing in Fairfield, CA. Licensed tester for HD-OBD and Smoke Opacity testing.",
      "url": "${url.origin}",
      "telephone": "+1-916-890-4427",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Fairfield",
        "addressRegion": "CA",
        "postalCode": "94533",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.2494,
        "longitude": -122.0400
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "06:00",
          "closes": "17:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "08:00",
          "closes": "16:00"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "47"
      },
      "areaServed": [
        {"@type": "City", "name": "Fairfield"},
        {"@type": "City", "name": "Vacaville"},
        {"@type": "City", "name": "Suisun City"},
        {"@type": "City", "name": "Dixon"},
        {"@type": "City", "name": "Vallejo"},
        {"@type": "City", "name": "Benicia"},
        {"@type": "City", "name": "Napa"}
      ],
      "sameAs": ["https://norcalcarbmobile.com"]
    },
    {
      "@type": "Service",
      "serviceType": "Mobile CARB Clean Truck Check Testing",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Clean Truck Check Fairfield"
      },
      "areaServed": {
        "@type": "City",
        "name": "Fairfield"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "CARB Testing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {"@type": "Service", "name": "HD-OBD Testing"},
            "price": "75.00",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {"@type": "Service", "name": "Smoke / Opacity Testing"},
            "price": "199.00",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {"@type": "Service", "name": "Fleet Opacity Testing"},
            "price": "149.00",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {"@type": "Service", "name": "RV / Motorhome Testing"},
            "price": "300.00",
            "priceCurrency": "USD"
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a CARB Clean Truck Check?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Clean Truck Check is California's heavy-duty vehicle inspection program administered by CARB (California Air Resources Board). It requires periodic emissions testing of diesel trucks and buses to ensure they meet state air quality standards."
          }
        },
        {
          "@type": "Question",
          "name": "How long does testing take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HD-OBD testing typically takes 15–20 minutes per vehicle. Smoke opacity testing takes around 20–30 minutes. Fleet testing is streamlined so we can process multiple vehicles efficiently at your location."
          }
        },
        {
          "@type": "Question",
          "name": "Do you really come to my location?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We are a fully mobile CARB testing service. We bring all required equipment directly to your yard, depot, job site, or residence anywhere in the Fairfield and Solano County area."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between HD-OBD and Opacity testing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HD-OBD (Heavy-Duty On-Board Diagnostics) is a plug-in scan for 2013+ model year engines that checks the vehicle's built-in emissions monitoring system. Opacity testing uses a smoke meter to measure exhaust opacity for pre-2013 engines without OBD capability."
          }
        },
        {
          "@type": "Question",
          "name": "How much does testing cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HD-OBD testing is $75 per vehicle. Smoke/Opacity testing is $199. Fleet opacity testing starts at $149+ per vehicle (3+ vehicles). RV and motorhome testing is $300. All prices include the mobile service — no hidden fees."
          }
        },
        {
          "@type": "Question",
          "name": "Are you a licensed CARB tester?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We are a fully licensed and insured CARB tester. Our CARB Tester ID is IF530523. All test results are submitted directly to CARB and you receive official compliance documentation on-site."
          }
        },
        {
          "@type": "Question",
          "name": "How do I schedule an appointment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can call us directly at 916-890-4427 or schedule online through our website at norcalcarbmobile.com. We typically offer same-week appointments and can often accommodate next-day requests."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if my truck fails the test?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If your vehicle does not pass, we provide a detailed report explaining the failure and recommend trusted repair shops in the Fairfield area. After repairs, we offer discounted re-testing to get you back in compliance quickly."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer weekend testing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we are available on Saturdays from 8:00 AM to 4:00 PM. We are closed on Sundays. For urgent fleet needs, contact us to discuss availability."
          }
        }
      ]
    }
  ]
}
</script>

<!-- JavaScript -->
<script>
// FAQ Accordion
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Intersection Observer for fade-up animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
</script>

</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};
