// worker.js - Silverback AI Homepage
//
// Routes:
//   GET  /robots.txt     -> robots file
//   GET  /sitemap.xml    -> sitemap
//   GET  /               -> homepage
//   POST /api/intake     -> intake form handler (logged via console.log)
//   GET  /tools/:slug    -> scaffolded tool pages (5 slugs wired up)
//   *                    -> 404 page

function renderHomepage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="What keeps you up at night? Silverback AI builds the tool that fixes it. Custom AI systems for small business — legal, property management, security, and more. Shipped fast, runs while you sleep.">
    <meta name="keywords" content="AI consulting, custom AI tools, small business AI, AI security, property management AI, legal AI, Silverback AI">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://silverbackai.agency/">
    <meta property="og:title" content="Silverback AI — What keeps you up at night?">
    <meta property="og:description" content="We build the tool that fixes it. Custom AI systems for small business, shipped fast, running while you sleep.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://silverbackai.agency/">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Silverback AI — What keeps you up at night?">
    <meta name="twitter:description" content="We build the tool that fixes it. Custom AI for small business, shipped fast.">
    <meta name="theme-color" content="#07070b">
    <title>Silverback AI — What keeps you up at night?</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">

    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #07070b;
            --bg-secondary: #0f0f17;
            --bg-card: #15151f;
            --bg-input: #1b1b28;
            --accent: #8b5cf6;
            --accent-glow: rgba(139, 92, 246, 0.18);
            --accent-hover: #a78bfa;
            --accent-bright: #c4b5fd;
            --silver: #c0c0c8;
            --vest: #ccff00;
            --text-primary: #ffffff;
            --text-secondary: #c2c2d0;
            --text-tertiary: #86868f;
            --border: rgba(139, 92, 246, 0.3);
            --border-subtle: rgba(255, 255, 255, 0.08);
            --border-input: rgba(255, 255, 255, 0.12);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text-primary);
            background-color: var(--bg-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        html {
            scroll-behavior: smooth;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        /* Header */
        header {
            background-color: rgba(10, 10, 15, 0.9);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-subtle);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: var(--text-primary);
        }

        .logo-mark {
            width: 40px;
            height: 40px;
            position: relative;
        }

        .logo-mark svg {
            width: 40px;
            height: 40px;
        }

        .logo-text {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .logo-text span {
            color: var(--accent);
        }

        nav {
            display: flex;
            align-items: center;
            gap: 32px;
        }

        nav a {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s;
        }

        nav a:hover {
            color: var(--text-primary);
        }

        .nav-cta {
            background: var(--accent);
            color: #fff !important;
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .nav-cta:hover {
            background: var(--accent-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 20px var(--accent-glow);
        }

        @media (max-width: 768px) {
            nav {
                gap: 16px;
            }
            nav a:not(.nav-cta) {
                display: none;
            }
        }

        /* Hero */
        .hero {
            padding: 96px 0 72px;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -300px;
            left: 50%;
            transform: translateX(-50%);
            width: 1100px;
            height: 1100px;
            background: radial-gradient(circle, var(--accent-glow) 0%, transparent 65%);
            pointer-events: none;
        }

        .hero-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 64px;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .hero-copy { max-width: 560px; }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(139, 92, 246, 0.12);
            border: 1px solid var(--border);
            padding: 8px 18px;
            border-radius: 100px;
            font-size: 13px;
            color: var(--accent-bright);
            font-weight: 600;
            margin-bottom: 28px;
            letter-spacing: 0.3px;
        }

        .hero-badge-dot {
            width: 6px;
            height: 6px;
            background: var(--accent);
            border-radius: 50%;
            box-shadow: 0 0 12px var(--accent);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.85); }
        }

        .hero h1 {
            font-size: clamp(40px, 5.6vw, 72px);
            font-weight: 800;
            line-height: 1.05;
            margin-bottom: 24px;
            letter-spacing: -2.5px;
            color: var(--text-primary);
        }

        .hero h1 .gradient-text {
            background: linear-gradient(135deg, #c4b5fd 0%, var(--accent) 45%, #f0abfc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p.hero-lede {
            font-size: 19px;
            color: var(--text-secondary);
            margin-bottom: 40px;
            line-height: 1.65;
            max-width: 540px;
        }

        .btn-primary {
            background: var(--accent);
            color: #fff;
            padding: 16px 36px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
            display: inline-block;
        }

        .btn-primary:hover {
            background: var(--accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 8px 30px var(--accent-glow);
        }

        .hero-illustration-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .hero-illustration {
            max-width: 460px;
            width: 100%;
            position: relative;
        }

        .hero-illustration svg {
            width: 100%;
            height: auto;
            filter: drop-shadow(0 0 60px rgba(139, 92, 246, 0.22));
        }

        /* Intake form */
        .intake-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: rgba(21, 21, 31, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-input);
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        }

        .intake-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .intake-field label {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }

        .intake-field input,
        .intake-field textarea,
        .intake-field select {
            background: var(--bg-input);
            color: var(--text-primary);
            border: 1px solid var(--border-input);
            border-radius: 10px;
            padding: 14px 16px;
            font-size: 15px;
            font-family: inherit;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .intake-field input::placeholder,
        .intake-field textarea::placeholder {
            color: var(--text-tertiary);
        }

        .intake-field input:focus,
        .intake-field textarea:focus,
        .intake-field select:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
        }

        .intake-field textarea {
            resize: vertical;
            min-height: 96px;
            line-height: 1.55;
        }

        .intake-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .intake-submit {
            background: linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%);
            color: #fff;
            border: none;
            padding: 16px 24px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.2s;
            letter-spacing: 0.3px;
        }

        .intake-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 12px 30px rgba(139, 92, 246, 0.35);
        }

        .intake-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .intake-footnote {
            font-size: 12px;
            color: var(--text-tertiary);
            text-align: center;
            margin-top: -4px;
        }

        .intake-success {
            text-align: center;
            padding: 36px 24px;
        }

        .intake-success .check {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(74, 222, 128, 0.15);
            border: 2px solid #4ade80;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #4ade80;
            font-size: 28px;
            margin-bottom: 16px;
        }

        .intake-success h3 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--text-primary);
        }

        .intake-success p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.6;
        }

        .intake-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.35);
            color: #fca5a5;
            padding: 12px 14px;
            border-radius: 8px;
            font-size: 13px;
        }

        @media (max-width: 960px) {
            .hero-grid {
                grid-template-columns: 1fr;
                gap: 32px;
                text-align: left;
            }
            .hero-copy { max-width: 100%; }
            .hero-illustration-wrap { order: -1; }
            .hero-illustration { max-width: 280px; }
        }

        @media (max-width: 640px) {
            .hero { padding: 64px 0 48px; }
            .hero h1 { letter-spacing: -1.5px; }
            .hero p.hero-lede { font-size: 16px; }
            .intake-form { padding: 22px; border-radius: 16px; }
            .intake-row { grid-template-columns: 1fr; }
            .hero-illustration { max-width: 220px; }
        }

        /* Live Now */
        .live-now { background: var(--bg-secondary); }

        .live-now-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .live-now-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 28px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: border-color 0.2s, transform 0.2s;
            text-decoration: none;
            color: inherit;
        }

        .live-now-card:hover {
            border-color: var(--border);
            transform: translateY(-2px);
        }

        .live-now-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 700;
            color: #4ade80;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }

        .live-now-status::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #4ade80;
            box-shadow: 0 0 8px #4ade80;
            animation: pulse 2s infinite;
        }

        .live-now-card h3 {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .live-now-card p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.6;
            flex-grow: 1;
        }

        .live-now-url {
            font-family: 'SFMono-Regular', Menlo, Monaco, monospace;
            font-size: 12px;
            color: var(--accent-bright);
            margin-top: 4px;
        }

        /* Section base */
        .section {
            padding: 100px 0;
        }

        .section-label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--accent);
            font-weight: 600;
            margin-bottom: 16px;
            text-align: center;
        }

        .section-title {
            font-size: clamp(32px, 4.5vw, 46px);
            font-weight: 800;
            text-align: center;
            margin-bottom: 16px;
            letter-spacing: -1.5px;
            color: var(--text-primary);
        }

        .section-subtitle {
            text-align: center;
            color: var(--text-secondary);
            font-size: 18px;
            margin-bottom: 64px;
            max-width: 640px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
        }

        @media (max-width: 768px) {
            .section {
                padding: 60px 0;
            }
            .section-title {
                font-size: 32px;
            }
        }

        /* Solutions */
        .solutions {
            background: var(--bg-secondary);
        }

        .solutions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
        }

        .solution-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 40px 32px;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .solution-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .solution-card:hover {
            border-color: var(--border);
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .solution-card:hover::before {
            opacity: 1;
        }

        .solution-icon {
            width: 56px;
            height: 56px;
            background: var(--accent-glow);
            border: 1px solid var(--border);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            margin-bottom: 24px;
        }

        .solution-card h3 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text-primary);
        }

        .solution-card p {
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 24px;
        }

        .solution-tag {
            display: inline-block;
            background: rgba(139, 92, 246, 0.08);
            color: var(--accent);
            font-size: 12px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Services */
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 24px;
        }

        .service-item {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 36px 28px;
            text-align: center;
            transition: all 0.3s;
        }

        .service-item:hover {
            border-color: var(--border);
            transform: translateY(-3px);
        }

        .service-icon {
            font-size: 40px;
            margin-bottom: 20px;
        }

        .service-item h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .service-item p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.7;
        }

        /* How it works */
        .process {
            background: var(--bg-secondary);
        }

        .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 32px;
            position: relative;
        }

        .process-step {
            text-align: center;
            position: relative;
        }

        .step-number {
            width: 56px;
            height: 56px;
            background: var(--accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 800;
            margin: 0 auto 20px;
            color: #fff;
        }

        .process-step h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .process-step p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.7;
        }

        /* CTA */
        .cta-section {
            text-align: center;
            padding: 100px 24px;
            position: relative;
            overflow: hidden;
        }

        .cta-section::before {
            content: '';
            position: absolute;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
            pointer-events: none;
        }

        .cta-section h2 {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 16px;
            letter-spacing: -1px;
            position: relative;
            z-index: 1;
        }

        .cta-section p {
            color: var(--text-secondary);
            font-size: 18px;
            margin-bottom: 40px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 1;
        }

        .cta-section .btn-primary {
            position: relative;
            z-index: 1;
        }

        /* Footer */
        footer {
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-subtle);
            padding: 60px 0 32px;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 40px;
            margin-bottom: 48px;
        }

        @media (max-width: 768px) {
            .footer-grid {
                grid-template-columns: 1fr 1fr;
                gap: 32px;
            }
        }

        .footer-brand p {
            color: var(--text-secondary);
            font-size: 14px;
            margin-top: 16px;
            line-height: 1.7;
        }

        .footer-col h4 {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .footer-col ul {
            list-style: none;
        }

        .footer-col ul li {
            margin-bottom: 12px;
        }

        .footer-col ul li a {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s;
        }

        .footer-col ul li a:hover {
            color: var(--accent);
        }

        .footer-bottom {
            border-top: 1px solid var(--border-subtle);
            padding-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--text-secondary);
            font-size: 13px;
        }

        @media (max-width: 768px) {
            .footer-bottom {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fadeInUp 0.6s ease forwards;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <a href="/" class="logo">
                    <div class="logo-mark">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="10" fill="#16161f"/>
                            <path d="M6 40 C6 31 11 28 15 27 L20 26.5 L25 27 C29 28 34 31 34 40" fill="#ccff00"/>
                            <path d="M14 33 Q20 31 26 33" stroke="#e6ff66" stroke-width="0.8" fill="none" opacity="0.5"/>
                            <ellipse cx="20" cy="16" rx="10" ry="9" fill="#6b6b78"/>
                            <path d="M11 16 C13 12 17 11 20 11.5 C23 11 27 12 29 16" fill="#5a5a68"/>
                            <ellipse cx="16" cy="16.5" rx="2" ry="1.8" fill="#1a1a24"/>
                            <ellipse cx="24" cy="16.5" rx="2" ry="1.8" fill="#1a1a24"/>
                            <circle cx="16.8" cy="16" r="0.6" fill="#8b5cf6"/>
                            <circle cx="24.8" cy="16" r="0.6" fill="#8b5cf6"/>
                            <ellipse cx="20" cy="21" rx="4" ry="3" fill="#5a5a68"/>
                            <ellipse cx="18.5" cy="20.5" rx="0.8" ry="0.6" fill="#333"/>
                            <ellipse cx="21.5" cy="20.5" rx="0.8" ry="0.6" fill="#333"/>
                        </svg>
                    </div>
                    <div class="logo-text">Silverback<span>AI</span></div>
                </a>

                <nav>
                    <a href="#solutions">Solutions</a>
                    <a href="#services">Services</a>
                    <a href="#live">Live Now</a>
                    <a href="#intake-form" class="nav-cta">Tell Us What Hurts</a>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
                <div class="hero-badge">
                    <span class="hero-badge-dot"></span>
                    Small-business AI, shipped fast
                </div>
                <h1>
                    What keeps you<br>
                    <span class="gradient-text">up at night?</span>
                </h1>
                <p class="hero-lede">
                    We build the tool that fixes it. Not a demo. Not a slide deck.
                    A working system, shipped fast &mdash; and it runs while you sleep.
                </p>

                <form class="intake-form" id="intake-form" novalidate>
                    <div class="intake-row">
                        <div class="intake-field">
                            <label for="intake-name">Name</label>
                            <input id="intake-name" name="name" type="text" placeholder="Your name" autocomplete="name" required>
                        </div>
                        <div class="intake-field">
                            <label for="intake-email">Email</label>
                            <input id="intake-email" name="email" type="email" placeholder="you@company.com" autocomplete="email" required>
                        </div>
                    </div>
                    <div class="intake-field">
                        <label for="intake-message">What keeps you up at night?</label>
                        <textarea id="intake-message" name="message" placeholder="The problem you wish an AI tool could handle while you sleep..." required></textarea>
                    </div>
                    <div class="intake-field">
                        <label for="intake-budget">Budget (optional)</label>
                        <select id="intake-budget" name="budget">
                            <option value="">I'm not sure yet</option>
                            <option value="under-5k">Under $5k</option>
                            <option value="5k-15k">$5k &ndash; $15k</option>
                            <option value="15k-50k">$15k &ndash; $50k</option>
                            <option value="50k-plus">$50k+</option>
                        </select>
                    </div>
                    <button type="submit" class="intake-submit">Send it &rarr;</button>
                    <p class="intake-footnote">You'll hear back within 24 hours. No pitch decks, no pressure.</p>
                </form>
            </div>

            <div class="hero-illustration-wrap">
              <div class="hero-illustration">
                <svg viewBox="0 0 480 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Moon glow -->
                    <circle cx="380" cy="75" r="55" fill="#fdf4c1" opacity="0.06"/>
                    <circle cx="380" cy="75" r="38" fill="#fdf4c1" opacity="0.1"/>
                    <circle cx="380" cy="75" r="25" fill="#fdf4c1" opacity="0.15"/>
                    <!-- Stars -->
                    <circle cx="50" cy="35" r="1.5" fill="#fff" opacity="0.25"/>
                    <circle cx="125" cy="65" r="1" fill="#fff" opacity="0.15"/>
                    <circle cx="200" cy="25" r="1.5" fill="#fff" opacity="0.2"/>
                    <circle cx="310" cy="45" r="1" fill="#fff" opacity="0.18"/>
                    <circle cx="440" cy="110" r="1.2" fill="#fff" opacity="0.12"/>
                    <circle cx="425" cy="35" r="1" fill="#fff" opacity="0.25"/>
                    <circle cx="75" cy="95" r="1" fill="#fff" opacity="0.12"/>
                    <circle cx="270" cy="60" r="0.8" fill="#fff" opacity="0.15"/>
                    <!-- Ground surface -->
                    <path d="M0 310 Q120 302 240 306 Q360 310 480 300 L480 340 L0 340 Z" fill="#111118"/>
                    <path d="M0 315 Q100 308 200 312 Q340 316 480 306" stroke="#2a2a35" stroke-width="0.5" fill="none"/>
                    <!-- Purple ground glow under gorilla -->
                    <ellipse cx="225" cy="310" rx="90" ry="12" fill="#8b5cf6" opacity="0.06"/>
                    <!-- Shadow on ground -->
                    <ellipse cx="225" cy="312" rx="55" ry="5" fill="#000" opacity="0.3"/>

                    <!-- LEFT LEG (back, stepping) -->
                    <path d="M205 272 L198 300 L194 312 Q194 316 202 316 L207 314 L212 295 L215 272" fill="#5a5a68"/>
                    <!-- LEFT FOOT -->
                    <ellipse cx="199" cy="315" rx="9" ry="3.5" fill="#4a4a58"/>

                    <!-- RIGHT LEG (forward stride) -->
                    <path d="M242 268 L252 298 L256 310 Q256 314 248 316 L243 314 L240 296 L238 268" fill="#666674"/>
                    <!-- RIGHT FOOT -->
                    <ellipse cx="250" cy="315" rx="9" ry="3.5" fill="#555563"/>

                    <!-- TORSO - massive broad back -->
                    <path d="M188 168 C183 190 186 235 198 270 L218 275 L240 275 L252 270 C260 235 262 190 255 168 Z" fill="#666674"/>

                    <!-- HIGH-VIS VEST -->
                    <path d="M192 178 C188 198 191 245 200 272 L218 275 L240 275 L250 272 C257 245 259 198 254 178 Z" fill="#ccff00"/>
                    <!-- Armhole cutouts showing fur -->
                    <path d="M192 178 C196 172 205 168 222 168 C239 168 248 172 254 178" fill="#666674"/>
                    <!-- Reflective stripes -->
                    <path d="M196 218 Q222 213 250 218" stroke="#e6ff66" stroke-width="3.5" fill="none" opacity="0.6"/>
                    <path d="M198 245 Q222 240 248 245" stroke="#e6ff66" stroke-width="3.5" fill="none" opacity="0.6"/>
                    <!-- SILVERBACK text on vest -->
                    <text x="222" y="202" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="10.5" font-weight="800" fill="#1a1a24" letter-spacing="1.5">SILVERBACK</text>
                    <!-- AI text on vest (purple) -->
                    <text x="222" y="216" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="800" fill="#6d28d9" letter-spacing="3">AI</text>

                    <!-- LEFT ARM (carrying lunch pail) -->
                    <path d="M188 178 C176 190 170 220 168 248 C166 265 167 275 172 280" fill="#5a5a68"/>
                    <ellipse cx="173" cy="282" rx="6" ry="5.5" fill="#5a5a68"/>

                    <!-- LUNCH PAIL -->
                    <rect x="160" y="282" rx="3" width="26" height="20" fill="#8a8a9a"/>
                    <rect x="160" y="282" rx="3" width="26" height="4" fill="#9a9aaa"/>
                    <!-- Lunch pail handle -->
                    <path d="M164 282 C164 272 182 272 182 282" stroke="#aaa" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                    <!-- AI sticker on lunch pail -->
                    <rect x="165" y="289" rx="2" width="16" height="10" fill="#8b5cf6"/>
                    <text x="173" y="297" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="7" font-weight="800" fill="#fff">AI</text>

                    <!-- RIGHT ARM (swinging) -->
                    <path d="M255 178 C265 190 270 220 267 248 C265 265 260 275 256 278" fill="#666674"/>
                    <ellipse cx="256" cy="280" rx="5.5" ry="5" fill="#666674"/>

                    <!-- HEAD - rear/3-quarter view, walking toward moon -->
                    <ellipse cx="222" cy="150" rx="24" ry="22" fill="#666674"/>
                    <!-- Sagittal crest -->
                    <path d="M206 132 Q222 122 238 132" fill="#5a5a68"/>
                    <!-- Ears -->
                    <ellipse cx="198" cy="152" rx="5" ry="6" fill="#555563"/>
                    <ellipse cx="246" cy="150" rx="5" ry="6" fill="#5a5a68"/>
                    <!-- Inner ear -->
                    <ellipse cx="198" cy="152" rx="3" ry="4" fill="#4a4a58"/>
                    <ellipse cx="246" cy="150" rx="3" ry="4" fill="#4a4a58"/>
                    <!-- Neck/trap muscles -->
                    <path d="M208 166 Q222 172 236 166 L242 175 L204 175 Z" fill="#5a5a68"/>
                    <!-- Slight head turn - hint of right eye/brow visible -->
                    <path d="M240 145 C242 142 245 143 244 146" fill="#4a4a58"/>
                    <circle cx="243" cy="145" r="1.2" fill="#1a1a24"/>
                    <circle cx="243.4" cy="144.6" r="0.4" fill="#8b5cf6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
    </section>

    <section class="solutions section" id="solutions">
        <div class="container">
            <div class="section-label">Pre-Built Solutions</div>
            <h2 class="section-title">Ready to Deploy, Built for Your Industry</h2>
            <p class="section-subtitle">
                Pick a solution, plug it in, and go. Each tool is built for real workflows,
                not demos.
            </p>

            <div class="solutions-grid">
                <div class="solution-card">
                    <div class="solution-icon">&#x2696;&#xFE0F;</div>
                    <h3>Legal AI Suite</h3>
                    <p>
                        Automated document review, contract analysis, and case research
                        for solo practitioners and small firms. Reduce hours of review
                        to minutes.
                    </p>
                    <span class="solution-tag">Legal</span>
                </div>

                <div class="solution-card">
                    <div class="solution-icon">&#x1F4F9;</div>
                    <h3>Security AI</h3>
                    <p>
                        AI-powered camera monitoring, motion alerts, and incident
                        analysis for properties and businesses. Smarter than a guard,
                        cheaper than a service.
                    </p>
                    <span class="solution-tag">Security</span>
                </div>

                <div class="solution-card">
                    <div class="solution-icon">&#x1F310;</div>
                    <h3>Web &amp; Content Builder</h3>
                    <p>
                        AI-assisted website creation, SEO optimization, and content
                        generation. Launch professional sites fast with intelligent
                        copy and layout suggestions.
                    </p>
                    <span class="solution-tag">Web</span>
                </div>

                <div class="solution-card">
                    <div class="solution-icon">&#x1F6E0;&#xFE0F;</div>
                    <h3>Custom Tool Builder</h3>
                    <p>
                        Need something specific? We build custom AI tools for your
                        exact workflow. From data processing to customer-facing bots,
                        we ship fast.
                    </p>
                    <span class="solution-tag">Custom</span>
                </div>
            </div>
        </div>
    </section>

    <section class="section" id="services">
        <div class="container">
            <div class="section-label">Consulting Services</div>
            <h2 class="section-title">We Meet You Where You Are</h2>
            <p class="section-subtitle">
                Whether you need a full AI strategy or just help setting up your
                home office, we&#39;ve got you.
            </p>

            <div class="services-grid">
                <div class="service-item">
                    <div class="service-icon">&#x1F9E0;</div>
                    <h3>AI Strategy &amp; Integration</h3>
                    <p>
                        We audit your current workflow, identify where AI fits, and
                        build a roadmap. OpenAI, Claude, open-source &mdash; we know the
                        landscape and pick what actually works.
                    </p>
                </div>

                <div class="service-item">
                    <div class="service-icon">&#x1F916;</div>
                    <h3>Agentic System Design</h3>
                    <p>
                        Build autonomous agents that handle tasks while you sleep.
                        From customer service to data pipelines &mdash; systems that run
                        themselves.
                    </p>
                </div>

                <div class="service-item">
                    <div class="service-icon">&#x1F4BB;</div>
                    <h3>Personal AI Setup</h3>
                    <p>
                        We configure your home or office computer with AI tools
                        that last. Set it up once, tweak it every six months. Keyboard
                        shortcuts, local models, cloud APIs &mdash; all dialed in.
                    </p>
                </div>

                <div class="service-item">
                    <div class="service-icon">&#x1F91D;</div>
                    <h3>AI Middleman Service</h3>
                    <p>
                        AI can feel overwhelming. We translate between you and the
                        technology &mdash; handling API keys, model selection, prompt
                        engineering, and ongoing optimization.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <section class="process section" id="process">
        <div class="container">
            <div class="section-label">How It Works</div>
            <h2 class="section-title">Three Steps to AI That Works</h2>
            <p class="section-subtitle">
                No jargon. No six-month timelines. We move fast and build things
                that actually run.
            </p>

            <div class="process-steps">
                <div class="process-step">
                    <div class="step-number">1</div>
                    <h3>Discovery Call</h3>
                    <p>
                        Tell us what you do. We listen, ask questions, and figure
                        out where AI saves you time, money, or headaches. Free,
                        no commitment.
                    </p>
                </div>

                <div class="process-step">
                    <div class="step-number">2</div>
                    <h3>Build &amp; Configure</h3>
                    <p>
                        We either deploy a pre-built solution or custom-build what
                        you need. You&#39;ll see a working prototype fast, not a slide deck.
                    </p>
                </div>

                <div class="process-step">
                    <div class="step-number">3</div>
                    <h3>Launch &amp; Support</h3>
                    <p>
                        Go live with confidence. We train your team, monitor performance,
                        and handle updates as AI evolves. You focus on your business.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <section class="live-now section" id="live">
        <div class="container">
            <div class="section-label">Currently Running</div>
            <h2 class="section-title">Tools We've Built. In Production.</h2>
            <p class="section-subtitle">
                Real systems, running right now. Not demos, not mockups &mdash;
                actual tools serving actual customers.
            </p>

            <div class="live-now-grid">
                <a class="live-now-card" href="https://security.silverbackai.agency" target="_blank" rel="noopener">
                    <span class="live-now-status">Live</span>
                    <h3>Silverback AI Security</h3>
                    <p>AI-powered property security with weirdness detection, real-time alerts, and privacy-first monitoring. First deployment: Ruby Street Apartments, Oakland.</p>
                    <span class="live-now-url">security.silverbackai.agency &rarr;</span>
                </a>

                <a class="live-now-card" href="https://cleantruckcheckstockton.com" target="_blank" rel="noopener">
                    <span class="live-now-status">Live</span>
                    <h3>Clean Truck Check &mdash; Stockton</h3>
                    <p>Mobile CARB emissions testing site. HD-OBD and smoke/opacity testing, built for NorCal CARB Mobile's Stockton service area.</p>
                    <span class="live-now-url">cleantruckcheckstockton.com &rarr;</span>
                </a>

                <a class="live-now-card" href="#intake-form">
                    <span class="live-now-status">Yours?</span>
                    <h3>Your Tool Here</h3>
                    <p>We build one per client, on purpose. If the thing keeping you up at night isn't on this list, tell us about it &mdash; we probably haven't built it yet because no one's asked.</p>
                    <span class="live-now-url">Scroll up, fill out the form &uarr;</span>
                </a>
            </div>
        </div>
    </section>

    <section class="cta-section" id="contact">
        <div class="container">
            <h2>Still reading?</h2>
            <p>
                Then something's on your mind. Scroll up and tell us about it &mdash;
                we read every intake form.
            </p>
            <a href="#intake-form" class="btn-primary">Take me to the form</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="/" class="logo">
                        <div class="logo-mark">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="10" fill="#16161f"/>
                                <path d="M6 40 C6 31 11 28 15 27 L20 26.5 L25 27 C29 28 34 31 34 40" fill="#ccff00"/>
                                <path d="M14 33 Q20 31 26 33" stroke="#e6ff66" stroke-width="0.8" fill="none" opacity="0.5"/>
                                <ellipse cx="20" cy="16" rx="10" ry="9" fill="#6b6b78"/>
                                <path d="M11 16 C13 12 17 11 20 11.5 C23 11 27 12 29 16" fill="#5a5a68"/>
                                <ellipse cx="16" cy="16.5" rx="2" ry="1.8" fill="#1a1a24"/>
                                <ellipse cx="24" cy="16.5" rx="2" ry="1.8" fill="#1a1a24"/>
                                <circle cx="16.8" cy="16" r="0.6" fill="#8b5cf6"/>
                                <circle cx="24.8" cy="16" r="0.6" fill="#8b5cf6"/>
                                <ellipse cx="20" cy="21" rx="4" ry="3" fill="#5a5a68"/>
                                <ellipse cx="18.5" cy="20.5" rx="0.8" ry="0.6" fill="#333"/>
                                <ellipse cx="21.5" cy="20.5" rx="0.8" ry="0.6" fill="#333"/>
                            </svg>
                        </div>
                        <div class="logo-text">Silverback<span>AI</span></div>
                    </a>
                    <p>
                        AI consulting and pre-built solutions for businesses that
                        want to move faster. We make the complex simple.
                    </p>
                </div>

                <div class="footer-col">
                    <h4>Solutions</h4>
                    <ul>
                        <li><a href="#solutions">Legal AI Suite</a></li>
                        <li><a href="#solutions">Security AI</a></li>
                        <li><a href="#solutions">Web &amp; Content Builder</a></li>
                        <li><a href="#solutions">Custom Tools</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#services">AI Strategy</a></li>
                        <li><a href="#services">Agent Design</a></li>
                        <li><a href="#services">Personal Setup</a></li>
                        <li><a href="#services">AI Middleman</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#intake-form">Get In Touch</a></li>
                        <li><a href="#process">How It Works</a></li>
                        <li><a href="#live">Live Now</a></li>
                        <li><a href="mailto:hello@silverbackai.agency">hello@silverbackai.agency</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 Silverback AI. All rights reserved.</p>
                <p>Small-business AI, shipped fast.</p>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });

        // Scroll animations
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.solution-card, .service-item, .process-step').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        // Header scroll effect
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            header.style.borderBottomColor = window.scrollY > 50
                ? 'rgba(139, 92, 246, 0.15)'
                : 'rgba(255, 255, 255, 0.06)';
        });

        // Intake form submission
        const intakeForm = document.getElementById('intake-form');
        if (intakeForm) {
            intakeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = intakeForm.querySelector('.intake-submit');
                const existingError = intakeForm.querySelector('.intake-error');
                if (existingError) existingError.remove();

                const data = Object.fromEntries(new FormData(intakeForm));
                if (!data.name || !data.email || !data.message) return;

                btn.disabled = true;
                btn.textContent = 'Sending...';

                try {
                    const res = await fetch('/api/intake', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    if (!res.ok) throw new Error('Submit failed: ' + res.status);
                    intakeForm.innerHTML = [
                        '<div class="intake-success">',
                        '  <div class="check">&#10003;</div>',
                        '  <h3>Got it.</h3>',
                        '  <p>We read every intake form personally. You\\'ll hear back within 24 hours at the email you provided.</p>',
                        '</div>'
                    ].join('');
                } catch (err) {
                    btn.disabled = false;
                    btn.innerHTML = 'Send it &rarr;';
                    const errEl = document.createElement('div');
                    errEl.className = 'intake-error';
                    errEl.textContent = 'Something went wrong on our end. Email hello@silverbackai.agency and we\\'ll pick it up from there.';
                    intakeForm.insertBefore(errEl, btn);
                }
            });
        }
    <\/script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Silverback AI",
        "description": "Custom AI tools for small business. We build the thing that fixes what keeps you up at night.",
        "url": "https://silverbackai.agency",
        "sameAs": [],
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "hello@silverbackai.agency",
            "contactType": "sales"
        },
        "knowsAbout": ["Artificial Intelligence", "AI Consulting", "AI Integration", "Legal Technology", "AI Security", "Agentic AI Systems"]
    }
    <\/script>
</body>
</html>`;
}

// --- Tool page scaffold (placeholder for future toolkit pages) ---
// Each toolkit item will eventually live at /tools/:slug as its own page.
// For now we serve a consistent "coming soon" template so the routing is
// wired up and shareable links won't 404 once we start building them.
// Each page can be rebranded (ABC/Acme/whatever) for IP protection the
// same way NorCal CARB Mobile locations work.
const TOOL_PAGES = {
  'legal-ai':     { title: 'Legal AI Suite',         tagline: 'Contract review and case research that runs while you sleep.' },
  'ai-security':  { title: 'Silverback AI Security', tagline: 'Property security with weirdness detection. Already live at security.silverbackai.agency.' },
  'web-builder':  { title: 'Web & Content Builder',  tagline: 'AI-assisted sites and copy with SEO baked in.' },
  'custom':       { title: 'Custom Tool Builder',    tagline: 'If it does not exist yet, we build it. Tell us what hurts.' },
};

function renderToolPage(slug) {
  const tool = TOOL_PAGES[slug];
  if (!tool) return null;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.title} &mdash; Silverback AI</title>
  <meta name="description" content="${tool.tagline}">
  <meta name="robots" content="noindex">
  <style>
    body { margin: 0; font-family: -apple-system, 'Inter', system-ui, sans-serif; background: #07070b; color: #fff; display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: 24px; }
    .wrap { max-width: 560px; text-align: center; }
    .eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #a78bfa; font-weight: 700; margin-bottom: 12px; }
    h1 { font-size: clamp(32px, 5vw, 48px); letter-spacing: -1.5px; margin: 0 0 16px; }
    p { color: #c2c2d0; font-size: 17px; line-height: 1.6; margin: 0 0 32px; }
    a.cta { display: inline-block; background: #8b5cf6; color: #fff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; }
    a.cta:hover { background: #a78bfa; }
    a.home { color: #86868f; font-size: 13px; margin-top: 24px; text-decoration: none; display: inline-block; }
    a.home:hover { color: #c2c2d0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="eyebrow">Silverback AI &middot; Toolkit</div>
    <h1>${tool.title}</h1>
    <p>${tool.tagline}</p>
    <p style="color:#86868f; font-size:14px;">This page is being built. If you want to be first in line when it ships, drop us a note.</p>
    <a class="cta" href="/#intake-form">Tell us what you need &rarr;</a>
    <br><a class="home" href="/">&larr; Back to silverbackai.agency</a>
  </div>
</body>
</html>`;
}

function render404() {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Not Found &mdash; Silverback AI</title>
<style>body{margin:0;font-family:-apple-system,system-ui,sans-serif;background:#07070b;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px;}h1{font-size:64px;margin:0 0 8px;letter-spacing:-2px;}p{color:#c2c2d0;margin:0 0 24px;}a{color:#a78bfa;text-decoration:none;font-weight:600;}</style>
</head><body><div><h1>404</h1><p>That page doesn't exist (yet).</p><a href="/">&larr; silverbackai.agency</a></div></body></html>`;
}

async function handleIntake(request) {
  // Validation + logging. Submissions show up in 'wrangler tail silverbackai'.
  // When a delivery channel is chosen (email, Slack, Make.com webhook, KV,
  // D1, etc.), swap the console.log for the delivery call -- no frontend
  // changes needed.
  try {
    const body = await request.json();
    const name = (body.name || '').toString().trim().slice(0, 200);
    const email = (body.email || '').toString().trim().slice(0, 200);
    const message = (body.message || '').toString().trim().slice(0, 5000);
    const budget = (body.budget || '').toString().trim().slice(0, 50);

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[intake]', JSON.stringify({
      ts: new Date().toISOString(),
      name, email, budget, message,
      ua: request.headers.get('user-agent') || '',
      ip: request.headers.get('cf-connecting-ip') || '',
      country: request.headers.get('cf-ipcountry') || '',
    }));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[intake] error', err && err.message);
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

const HTML_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

var worker_default = {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname } = url;

    // robots.txt
    if (pathname === '/robots.txt') {
      return new Response(
        'User-agent: *\nAllow: /\nSitemap: https://silverbackai.agency/sitemap.xml\n',
        { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } }
      );
    }

    // sitemap.xml
    if (pathname === '/sitemap.xml') {
      const urls = ['/', ...Object.keys(TOOL_PAGES).map(s => `/tools/${s}`)];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>https://silverbackai.agency${u}</loc></url>`).join('\n')}
</urlset>`;
      return new Response(xml, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // Intake form submission
    if (pathname === '/api/intake') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      }
      return handleIntake(request);
    }

    // Tool pages (scaffolded, coming soon)
    if (pathname.startsWith('/tools/')) {
      const slug = pathname.replace(/^\/tools\//, '').replace(/\/$/, '');
      const body = renderToolPage(slug);
      if (body) return new Response(body, { headers: HTML_HEADERS });
      return new Response(render404(), { status: 404, headers: HTML_HEADERS });
    }

    // Homepage
    if (pathname === '/' || pathname === '') {
      return new Response(renderHomepage(), { headers: HTML_HEADERS });
    }

    // 404
    return new Response(render404(), { status: 404, headers: HTML_HEADERS });
  },
};

export {
  worker_default as default
};
