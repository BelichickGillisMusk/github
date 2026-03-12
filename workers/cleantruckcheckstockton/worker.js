// worker.js - Clean Truck Check Stockton
var worker_default = {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mobile CARB emissions testing in Stockton, CA. HD-OBD testing, smoke/opacity testing for trucks. We come to you - no downtime. Licensed CARB Tester ID: IF530523. 4.9&#9733; rated.">
    <meta name="keywords" content="CARB testing Stockton, Clean Truck Check Stockton, mobile emissions testing Stockton CA, HD-OBD testing Central Valley, smoke opacity test Stockton, mobile CARB tester San Joaquin">
    <meta name="geo.position" content="37.9577;-121.2908">
    <meta name="ICBM" content="37.9577,-121.2908">
    <meta name="geo.placename" content="Stockton, California">
    <meta name="geo.region" content="US-CA">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Mobile CARB Testing Stockton, CA | Clean Truck Check">
    <meta property="og:description" content="Professional CARB emissions testing in Stockton. Mobile service - we come to you. HD-OBD, smoke/opacity testing. Licensed tester. 4.9&#9733; rated.">
    <meta property="og:type" content="business.business">
    <meta property="og:url" content="https://carbteststockton.com">
    <meta name="theme-color" content="#5B2B82">
    <title>Mobile CARB Testing Stockton CA | Clean Truck Check - HD-OBD &amp; Opacity</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #e0e0e0;
            background-color: #1a0a2e;
            line-height: 1.6;
            overflow-x: hidden;
        }

        html {
            scroll-behavior: smooth;
        }

        /* Utility Classes */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .section-padding {
            padding: 60px 0;
        }

        @media (max-width: 768px) {
            .section-padding {
                padding: 40px 0;
            }
        }

        /* Header & Navigation */
        header {
            background-color: rgba(26, 10, 46, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 2px solid #5B2B82;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #5B2B82;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            letter-spacing: -0.5px;
        }

        .logo span {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
        }

        .call-btn {
            background-color: #5B2B82;
            color: #fff;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .call-btn:hover {
            background-color: #4a2268;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(91, 43, 130, 0.3);
        }

        @media (max-width: 768px) {
            .call-btn {
                padding: 10px 20px;
                font-size: 14px;
            }
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, rgba(26, 10, 46, 0.9) 0%, rgba(91, 43, 130, 0.1) 100%),
                        radial-gradient(circle at top right, rgba(91, 43, 130, 0.15) 0%, transparent 60%);
            padding: 100px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(91, 43, 130, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        .hero::after {
            content: '';
            position: absolute;
            bottom: -20%;
            left: -5%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(91, 43, 130, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        .hero-content {
            position: relative;
            z-index: 2;
            animation: fadeInUp 0.8s ease;
        }

        .hero h1 {
            font-size: 56px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #fff;
            line-height: 1.2;
        }

        .hero .highlight {
            color: #5B2B82;
        }

        .hero p {
            font-size: 20px;
            color: #A2AAAD;
            margin-bottom: 30px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .compliance-alert {
            background-color: rgba(91, 43, 130, 0.1);
            border-left: 4px solid #5B2B82;
            padding: 15px 20px;
            margin-bottom: 30px;
            border-radius: 4px;
            font-size: 16px;
            color: #e8d5f5;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
            padding: 16px 40px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 4px;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-block;
        }

        .btn-primary {
            background-color: #5B2B82;
            color: #fff;
        }

        .btn-primary:hover {
            background-color: #4a2268;
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(91, 43, 130, 0.4);
        }

        .btn-secondary {
            background-color: transparent;
            color: #5B2B82;
            border: 2px solid #5B2B82;
        }

        .btn-secondary:hover {
            background-color: rgba(91, 43, 130, 0.1);
            transform: translateY(-3px);
        }

        @media (max-width: 768px) {
            .hero {
                padding: 60px 0;
            }

            .hero h1 {
                font-size: 36px;
            }

            .hero p {
                font-size: 18px;
            }

            .cta-buttons {
                flex-direction: column;
            }

            .btn-primary, .btn-secondary {
                width: 100%;
            }
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Trust Badges */
        .trust-badges {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 40px;
            margin-top: 50px;
            flex-wrap: wrap;
        }

        .badge {
            text-align: center;
        }

        .badge-icon {
            font-size: 32px;
            margin-bottom: 8px;
        }

        .badge-text {
            font-size: 14px;
            color: #A2AAAD;
        }

        .badge-highlight {
            color: #5B2B82;
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .trust-badges {
                gap: 20px;
            }

            .badge-icon {
                font-size: 24px;
            }
        }

        /* Services Section */
        .services {
            background-color: #0d0514;
            border-top: 1px solid rgba(91, 43, 130, 0.2);
        }

        .section-title {
            font-size: 42px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 15px;
            color: #fff;
        }

        .section-subtitle {
            text-align: center;
            color: #A2AAAD;
            font-size: 18px;
            margin-bottom: 50px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .service-card {
            background: linear-gradient(135deg, rgba(91, 43, 130, 0.1) 0%, rgba(91, 43, 130, 0.05) 100%);
            border: 1px solid rgba(91, 43, 130, 0.3);
            border-radius: 8px;
            padding: 35px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            animation: slideInRight 0.6s ease;
        }

        .service-card:hover {
            border-color: #5B2B82;
            background: linear-gradient(135deg, rgba(91, 43, 130, 0.15) 0%, rgba(91, 43, 130, 0.08) 100%);
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(91, 43, 130, 0.2);
        }

        .service-icon {
            font-size: 48px;
            margin-bottom: 20px;
            color: #5B2B82;
        }

        .service-card h3 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #fff;
        }

        .service-card p {
            color: #A2AAAD;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .service-price {
            font-size: 28px;
            color: #5B2B82;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .service-cta {
            display: inline-block;
            color: #5B2B82;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .service-cta:hover {
            color: #fff;
        }

        @media (max-width: 768px) {
            .section-title {
                font-size: 32px;
            }

            .services-grid {
                gap: 20px;
            }

            .service-card {
                padding: 25px;
            }
        }

        /* Why Mobile Section */
        .why-mobile {
            background-color: #1a0a2e;
            border-top: 1px solid rgba(91, 43, 130, 0.2);
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 35px;
            margin-top: 50px;
        }

        .benefit-item {
            display: flex;
            gap: 20px;
            animation: fadeInUp 0.8s ease;
        }

        .benefit-icon {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            background-color: rgba(91, 43, 130, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .benefit-content h4 {
            font-size: 18px;
            color: #fff;
            margin-bottom: 8px;
        }

        .benefit-content p {
            color: #A2AAAD;
            font-size: 14px;
        }

        /* Local Content */
        .local-content {
            background-color: #0d0514;
            border-top: 1px solid rgba(91, 43, 130, 0.2);
        }

        .local-coverage {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            align-items: start;
        }

        @media (max-width: 768px) {
            .local-coverage {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }

        .coverage-text h3 {
            font-size: 28px;
            color: #fff;
            margin-bottom: 20px;
        }

        .coverage-list {
            list-style: none;
            margin-bottom: 25px;
        }

        .coverage-list li {
            color: #A2AAAD;
            padding: 8px 0;
            border-bottom: 1px solid rgba(91, 43, 130, 0.1);
            font-size: 15px;
        }

        .coverage-list li::before {
            content: '&#10003; ';
            color: #5B2B82;
            font-weight: bold;
        }

        .coverage-highlight {
            background-color: rgba(91, 43, 130, 0.1);
            border: 1px solid rgba(91, 43, 130, 0.3);
            border-radius: 6px;
            padding: 20px;
            color: #e8d5f5;
            font-size: 14px;
            line-height: 1.7;
        }

        /* FAQ */
        .faq {
            background-color: #1a0a2e;
            border-top: 1px solid rgba(91, 43, 130, 0.2);
        }

        .faq-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .faq-item {
            border: 1px solid rgba(91, 43, 130, 0.2);
            border-radius: 6px;
            margin-bottom: 15px;
            overflow: hidden;
        }

        .faq-question {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            cursor: pointer;
            background-color: rgba(91, 43, 130, 0.05);
            transition: background-color 0.3s ease;
        }

        .faq-question:hover {
            background-color: rgba(91, 43, 130, 0.1);
        }

        .faq-question h4 {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        }

        .faq-toggle {
            color: #5B2B82;
            font-size: 24px;
            font-weight: 300;
            flex-shrink: 0;
            transition: transform 0.3s ease;
        }

        .faq-item.active .faq-toggle {
            transform: rotate(45deg);
        }

        .faq-answer {
            display: none;
            padding: 20px 25px;
            color: #A2AAAD;
            font-size: 15px;
            line-height: 1.7;
            border-top: 1px solid rgba(91, 43, 130, 0.1);
        }

        .faq-item.active .faq-answer {
            display: block;
        }

        /* CTA Section */
        .cta-section {
            text-align: center;
            padding: 60px 20px;
        }

        .cta-section h2 {
            font-size: 42px;
            color: #fff;
            margin-bottom: 20px;
        }

        .cta-section p {
            color: #A2AAAD;
            font-size: 18px;
            margin-bottom: 35px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Footer */
        footer {
            background-color: #060d18;
            border-top: 2px solid #5B2B82;
            padding: 60px 0 30px;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }

        .footer-section h4 {
            color: #fff;
            font-size: 16px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .footer-section ul {
            list-style: none;
        }

        .footer-section ul li {
            margin-bottom: 10px;
        }

        .footer-section ul li a {
            color: #A2AAAD;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
            color: #5B2B82;
        }

        .footer-contact {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }

        .footer-contact-icon {
            font-size: 20px;
        }

        .footer-contact a {
            color: #5B2B82;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
        }

        .footer-bottom {
            border-top: 1px solid rgba(91, 43, 130, 0.2);
            padding-top: 30px;
            text-align: center;
            color: #A2AAAD;
            font-size: 13px;
            line-height: 2;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-content">
                <a href="#hero" class="logo">
                    &#x1F69A; Clean Truck Check
                    <span>Stockton</span>
                </a>
                <a href="tel:9168904427" class="call-btn">
                    &#x1F4DE; Call Now
                </a>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="hero">
        <div class="container">
            <div class="hero-content">
                <h1>
                    Mobile CARB Testing in <span class="highlight">Stockton, CA</span>
                </h1>
                <p>
                    Licensed emissions testing comes to you. No downtime. No waiting at a shop.
                    HD-OBD, smoke/opacity, and fleet testing for the Central Valley and San Joaquin.
                </p>

                <div class="compliance-alert">
                    &#x26A0;&#xFE0F; Biannual testing is NOW REQUIRED in 2026. Don&#39;t wait for a citation. Schedule today.
                </div>

                <div class="cta-buttons">
                    <a href="tel:9168904427" class="btn-primary">Call Now: 916-890-4427</a>
                    <a href="https://norcalcarbmobile.com/contact" class="btn-secondary">Schedule Online</a>
                </div>

                <div class="trust-badges">
                    <div class="badge">
                        <div class="badge-icon">&#x2B50;</div>
                        <div class="badge-text"><span class="badge-highlight">4.9&#9733;</span> / 47+ Reviews</div>
                    </div>
                    <div class="badge">
                        <div class="badge-icon">&#x2713;</div>
                        <div class="badge-text">Licensed CARB Tester<br><span class="badge-highlight">IF530523</span></div>
                    </div>
                    <div class="badge">
                        <div class="badge-icon">&#x1F3C1;</div>
                        <div class="badge-text">Mobile Service<br><span class="badge-highlight">We Come To You</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services section-padding" id="services">
        <div class="container">
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">
                Professional CARB emissions testing for trucks and fleets. Licensed and certified for Central Valley operations.
            </p>

            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">&#x1F527;</div>
                    <h3>HD-OBD Testing</h3>
                    <p>Heavy-duty on-board diagnostic testing for trucks 2013+. Complete compliance certification.</p>
                    <div class="service-price">$75</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>

                <div class="service-card">
                    <div class="service-icon">&#x1F4A8;</div>
                    <h3>Smoke/Opacity Testing</h3>
                    <p>Professional smoke and opacity testing. Quick turnaround with official CARB documentation.</p>
                    <div class="service-price">$199</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>

                <div class="service-card">
                    <div class="service-icon">&#x1F69B;</div>
                    <h3>Fleet Opacity Testing</h3>
                    <p>Multi-vehicle fleet testing with volume discounts. Mobile service reduces operational downtime.</p>
                    <div class="service-price">$149+</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>

                <div class="service-card">
                    <div class="service-icon">&#x1F3E0;</div>
                    <h3>RV/Motorhome Testing</h3>
                    <p>Full-service CARB testing for RVs and motorhomes. We handle all paperwork and compliance.</p>
                    <div class="service-price">$300</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>
            </div>

            <div class="cta-section">
                <h2>Need a Quote?</h2>
                <p>
                    Get instant pricing and schedule your test. Our mobile service covers Stockton, Lodi, Tracy,
                    Manteca, and throughout the San Joaquin Valley.
                </p>
                <a href="tel:9168904427" class="btn-primary">Call for Pricing</a>
            </div>
        </div>
    </section>

    <!-- Why Mobile Section -->
    <section class="why-mobile section-padding" id="why-mobile">
        <div class="container">
            <h2 class="section-title">Why Choose Mobile CARB Testing?</h2>
            <p class="section-subtitle">
                No more taking your truck out of service. We bring the equipment to you.
            </p>

            <div class="benefits-grid">
                <div class="benefit-item">
                    <div class="benefit-icon">&#x23F1;&#xFE0F;</div>
                    <div class="benefit-content">
                        <h4>Zero Downtime</h4>
                        <p>We test at your location. No driving to a shop, no waiting in a queue. Keep operating.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x1F4B0;</div>
                    <div class="benefit-content">
                        <h4>Cost Effective</h4>
                        <p>Avoid fuel costs and operational delays. Competitive pricing for single vehicles and fleets.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x2713;</div>
                    <div class="benefit-content">
                        <h4>Licensed &amp; Certified</h4>
                        <p>CARB Tester ID IF530523. All testing meets 2026 biannual compliance requirements.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x1F4CB;</div>
                    <div class="benefit-content">
                        <h4>Instant Documentation</h4>
                        <p>Receive official test results immediately. Digital and printed certificates provided.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x1F5FA;&#xFE0F;</div>
                    <div class="benefit-content">
                        <h4>Central Valley Wide Coverage</h4>
                        <p>Stockton, Lodi, Tracy, Manteca, Modesto, and throughout the San Joaquin Valley corridor.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x2B50;</div>
                    <div class="benefit-content">
                        <h4>Expert Service</h4>
                        <p>Years of experience. Fast, professional, and reliable. 4.9&#9733; rated by Central Valley customers.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Local Content Section -->
    <section class="local-content section-padding" id="service-area">
        <div class="container">
            <h2 class="section-title">CARB Testing for Stockton &amp; the San Joaquin Valley</h2>

            <div class="local-coverage">
                <div class="coverage-text">
                    <h3>Serving Stockton and Surrounding Areas</h3>
                    <p style="margin-bottom: 20px; color: #A2AAAD;">
                        NorCal CARB Mobile LLC provides professional emissions testing throughout the Central Valley,
                        including Stockton, Lodi, Tracy, and Manteca. With the Port of Stockton and
                        major I-5 logistics hubs in our region, compliance testing is essential for fleet operations.
                    </p>

                    <ul class="coverage-list">
                        <li>Stockton (Central Service Hub)</li>
                        <li>Lodi &amp; Galt</li>
                        <li>Tracy &amp; Manteca</li>
                        <li>I-5 Corridor Coverage</li>
                        <li>Port of Stockton Area</li>
                        <li>San Joaquin Industrial Districts</li>
                        <li>Modesto &amp; Turlock</li>
                        <li>Ripon &amp; Escalon</li>
                    </ul>

                    <div class="coverage-highlight">
                        <strong>2026 CARB Compliance:</strong> California&#39;s biannual testing requirement is in effect.
                        All heavy-duty trucks registered in California must undergo testing. Schedule now to avoid
                        penalties and vehicle downtime.
                    </div>
                </div>

                <div>
                    <div style="background: linear-gradient(135deg, rgba(91, 43, 130, 0.15) 0%, rgba(91, 43, 130, 0.05) 100%);
                                border: 2px solid rgba(91, 43, 130, 0.3); border-radius: 8px; padding: 40px; text-align: center;">
                        <h3 style="color: #fff; margin-bottom: 20px; font-size: 24px;">Stockton Service Info</h3>

                        <div style="margin-bottom: 25px;">
                            <p style="color: #A2AAAD; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Contact</p>
                            <a href="tel:9168904427" style="font-size: 24px; font-weight: bold; color: #5B2B82; text-decoration: none;">
                                916-890-4427
                            </a>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <p style="color: #A2AAAD; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">CARB Tester ID</p>
                            <p style="font-size: 18px; font-weight: bold; color: #fff;">IF530523</p>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <p style="color: #A2AAAD; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service Hours</p>
                            <p style="color: #A2AAAD; font-size: 14px;">Monday - Friday: 6am - 5pm<br>Saturday: 8am - 4pm</p>
                        </div>

                        <div>
                            <p style="color: #A2AAAD; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Website</p>
                            <a href="https://norcalcarbmobile.com" style="color: #5B2B82; text-decoration: none;">
                                norcalcarbmobile.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq section-padding" id="faq">
        <div class="container">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <p class="section-subtitle">
                Everything you need to know about CARB testing in Stockton.
            </p>

            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>What is CARB testing and why do I need it?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            CARB (California Air Resources Board) testing measures heavy-duty truck emissions to ensure compliance with state air quality standards.
                            As of 2026, all trucks registered in California must undergo biannual (every 2 years) HD-OBD testing or smoke/opacity testing.
                            This is a legal requirement to operate in California and avoid citations.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>How long does CARB testing take?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            HD-OBD testing typically takes 30-45 minutes per vehicle. Smoke/opacity testing takes 15-30 minutes.
                            Since our testing is mobile, we come to your location, eliminating travel time and downtime.
                            You can keep your truck operational throughout the process.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Do you test at our facility or do we need to go somewhere?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            We come to you. Our mobile testing service means we bring all equipment to your location in Stockton,
                            your fleet yard, or anywhere else in the San Joaquin Valley. There&#39;s no need to take your truck out of service
                            or drive to a testing center. This is one of our biggest advantages for busy fleets.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>What&#39;s the difference between HD-OBD and smoke/opacity testing?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            HD-OBD (Heavy-Duty On-Board Diagnostic) testing checks the truck&#39;s onboard computer systems for emissions compliance.
                            It&#39;s required for trucks 2013 and newer. Smoke/opacity testing measures visible emissions during acceleration.
                            Many trucks require both or can choose either. We&#39;ll help you determine which your vehicle needs.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>How much does CARB testing cost?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Pricing varies by service: HD-OBD testing is $75 per vehicle, smoke/opacity testing is $199,
                            RV/motorhome testing is $300, and fleet opacity testing starts at $149+ with volume discounts.
                            Call us at 916-890-4427 for a specific quote based on your vehicles and needs.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Are you licensed and certified?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Yes. We are a licensed CARB tester with ID IF530523. Our team is certified to perform all required emissions
                            testing under California Air Resources Board regulations. All test results are official and valid for registration
                            and compliance purposes throughout California.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>How do I schedule a test?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Call us at 916-890-4427 to schedule. We serve Stockton, Lodi, Tracy, Manteca, and throughout the San Joaquin Valley.
                            We offer flexible scheduling with early morning and weekend availability. You can also visit norcalcarbmobile.com/contact
                            to request service online and we&#39;ll follow up with you.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>What happens if my truck fails the test?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            If your truck doesn&#39;t pass, you&#39;ll receive documentation of the failure. You&#39;ll need to address the emissions issue
                            (often through repairs or maintenance) and then retest. We can discuss options with you and help schedule a retest
                            after repairs. Many failures are due to maintenance items that are relatively inexpensive to fix.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Is your service available on weekends?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Yes, we offer Saturday testing. Service hours are Monday-Friday 6am-5pm and Saturday 8am-4pm.
                            Call 916-890-4427 to check availability and schedule a weekend test time that works for your fleet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="section-padding" style="background-color: #0d0514; border-top: 1px solid rgba(91, 43, 130, 0.2);">
        <div class="container">
            <div class="cta-section">
                <h2>Ready to Get Compliant?</h2>
                <p>
                    Schedule your CARB test today. Mobile service in Stockton and the San Joaquin Valley.
                    Quick, professional, licensed testing.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <a href="tel:9168904427" class="btn-primary">Call: 916-890-4427</a>
                    <a href="https://norcalcarbmobile.com/contact" class="btn-secondary">Schedule Online</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Clean Truck Check Stockton</h4>
                    <p style="color: #A2AAAD; font-size: 14px; margin-bottom: 15px;">
                        Mobile CARB emissions testing serving Stockton, Lodi, Tracy, Manteca, and the San Joaquin Valley.
                    </p>
                    <div class="footer-contact">
                        <span class="footer-contact-icon">&#x1F4DE;</span>
                        <a href="tel:9168904427">916-890-4427</a>
                    </div>
                </div>

                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#services">HD-OBD Testing</a></li>
                        <li><a href="#services">Smoke/Opacity Testing</a></li>
                        <li><a href="#services">Fleet Testing</a></li>
                        <li><a href="#services">RV/Motorhome Testing</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Service Area</h4>
                    <ul>
                        <li><a href="#service-area">Stockton</a></li>
                        <li><a href="#service-area">Lodi</a></li>
                        <li><a href="#service-area">Tracy</a></li>
                        <li><a href="#service-area">Manteca</a></li>
                        <li><a href="#service-area">San Joaquin Valley</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="https://norcalcarbmobile.com">Main Website</a></li>
                        <li><a href="https://norcalcarbmobile.com/contact">Contact Us</a></li>
                        <li><a href="#faq">FAQ</a></li>
                        <li><a href="#why-mobile">Why Mobile?</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>
                    <strong>NorCal CARB Mobile LLC</strong> | CARB Tester ID: IF530523 | Licensed Emissions Testing
                </p>
                <p>
                    Serving Sacramento to Stockton corridor: Stockton, Lodi, Tracy, Manteca, and the San Joaquin Valley.
                </p>
                <p>
                    &copy; 2026 Clean Truck Check Stockton. All rights reserved.
                    <a href="https://norcalcarbmobile.com" style="color: #5B2B82; text-decoration: none;">norcalcarbmobile.com</a>
                </p>
            </div>
        </div>
    </footer>

    <!-- Schema Markup (LocalBusiness & Service) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Clean Truck Check Stockton",
        "image": "https://norcalcarbmobile.com/logo.png",
        "description": "Mobile CARB emissions testing in Stockton, CA. HD-OBD and smoke/opacity testing for trucks and fleets. Licensed CARB tester. We come to you.",
        "telephone": "916-890-4427",
        "url": "https://carbteststockton.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Stockton",
            "addressRegion": "CA",
            "postalCode": "95202",
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 37.9577,
            "longitude": -121.2908
        },
        "areaServed": [
            {
                "@type": "City",
                "name": "Stockton",
                "addressRegion": "CA"
            },
            {
                "@type": "City",
                "name": "Lodi",
                "addressRegion": "CA"
            },
            {
                "@type": "City",
                "name": "Tracy",
                "addressRegion": "CA"
            },
            {
                "@type": "City",
                "name": "Manteca",
                "addressRegion": "CA"
            },
            {
                "@type": "Region",
                "name": "San Joaquin Valley",
                "addressRegion": "CA"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "47"
        },
        "sameAs": [
            "https://norcalcarbmobile.com"
        ],
        "priceRange": "$75-$300"
    }
    <\/script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "CARB Emissions Testing",
        "description": "Professional mobile CARB emissions testing in Stockton and the San Joaquin Valley. HD-OBD, smoke/opacity, and fleet testing with licensed CARB tester.",
        "provider": {
            "@type": "LocalBusiness",
            "name": "NorCal CARB Mobile LLC",
            "telephone": "916-890-4427"
        },
        "areaServed": "San Joaquin Valley, CA",
        "serviceType": ["HD-OBD Testing", "Smoke Opacity Testing", "Fleet Testing", "RV Testing"]
    }
    <\/script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is CARB testing and why do I need it?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "CARB (California Air Resources Board) testing measures heavy-duty truck emissions to ensure compliance with state air quality standards. As of 2026, all trucks registered in California must undergo biannual (every 2 years) HD-OBD testing or smoke/opacity testing."
                }
            },
            {
                "@type": "Question",
                "name": "How long does CARB testing take?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HD-OBD testing typically takes 30-45 minutes per vehicle. Smoke/opacity testing takes 15-30 minutes. Our mobile service comes to you, eliminating travel time and downtime."
                }
            },
            {
                "@type": "Question",
                "name": "Are you licensed and certified?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We are a licensed CARB tester with ID IF530523. Our team is certified to perform all required emissions testing under California Air Resources Board regulations."
                }
            }
        ]
    }
    <\/script>

    <!-- Interactive JavaScript -->
    <script>
        // FAQ Accordion Functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');

                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Open clicked item if it wasn't already open
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .benefit-item, .faq-item').forEach(el => {
            observer.observe(el);
        });

        // Track scroll for header shadow
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            header.style.boxShadow = scrollTop > 100
                ? '0 2px 15px rgba(0, 0, 0, 0.4)'
                : '0 2px 10px rgba(0, 0, 0, 0.3)';
        });

        console.log('Clean Truck Check Stockton - Page Loaded');
        console.log('CARB Tester ID: IF530523');
        console.log('Contact: 916-890-4427');
    <\/script>
</body>
</html>`;
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
};
export {
  worker_default as default
};
