// worker.js - Silverback AI Toolkit
// Deployment: 2026-05-07 - PUSH DEPLOY ITERATE DOMINATE
var worker_default = {
  async fetch(request) {
    const url = new URL(request.url);

    // Toolkit hub page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Silverback AI Toolkit — ready-to-use AI tools for legal professionals, property managers, and businesses. Deploy in minutes.">
    <meta name="keywords" content="AI toolkit, AI tools, legal AI, property management AI, business AI tools, Silverback AI">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Silverback AI Toolkit — AI Tools Ready to Deploy">
    <meta property="og:description" content="Pre-built AI tools for legal, property management, web, and custom business workflows.">
    <meta name="theme-color" content="#0a0a0f">
    <title>Silverback AI Toolkit — AI Tools Ready to Deploy</title>

    <link rel="canonical" href="https://toolkit.silverbackai.agency/">
    <meta property="og:url" content="https://toolkit.silverbackai.agency/">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap">

    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #111118;
            --bg-card: #16161f;
            --bg-code: #1a1a24;
            --accent: #8b5cf6;
            --accent-glow: rgba(139, 92, 246, 0.15);
            --accent-hover: #a78bfa;
            --green: #22c55e;
            --green-glow: rgba(34, 197, 94, 0.1);
            --amber: #f59e0b;
            --blue: #3b82f6;
            --text-primary: #e8e8ed;
            --text-secondary: #9898a4;
            --border: rgba(139, 92, 246, 0.2);
            --border-subtle: rgba(255, 255, 255, 0.06);
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

        .logo-mark svg {
            width: 36px;
            height: 36px;
        }

        .logo-text {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .logo-text span {
            color: var(--accent);
        }

        .logo-text .toolkit-label {
            color: var(--text-secondary);
            font-weight: 400;
            font-size: 14px;
            margin-left: 4px;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 24px;
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

        .nav-back {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        @media (max-width: 768px) {
            nav a:not(.nav-back) {
                display: none;
            }
        }

        /* Hero */
        .hero {
            padding: 80px 0 60px;
            text-align: center;
            border-bottom: 1px solid var(--border-subtle);
        }

        .hero h1 {
            font-size: 48px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 16px;
            letter-spacing: -1.5px;
        }

        .hero h1 .gradient-text {
            background: linear-gradient(135deg, var(--accent) 0%, #c084fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: 18px;
            color: var(--text-secondary);
            max-width: 580px;
            margin: 0 auto 32px;
        }

        .hero-search {
            max-width: 480px;
            margin: 0 auto;
            position: relative;
        }

        .hero-search input {
            width: 100%;
            padding: 16px 20px 16px 48px;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 15px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
        }

        .hero-search input:focus {
            border-color: var(--accent);
        }

        .hero-search input::placeholder {
            color: var(--text-secondary);
        }

        .search-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            font-size: 16px;
        }

        @media (max-width: 768px) {
            .hero {
                padding: 60px 0 40px;
            }
            .hero h1 {
                font-size: 36px;
            }
        }

        /* Category Filter */
        .filter-bar {
            display: flex;
            justify-content: center;
            gap: 8px;
            padding: 24px 0;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 8px 20px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid var(--border-subtle);
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }

        .filter-btn:hover, .filter-btn.active {
            border-color: var(--accent);
            color: var(--accent);
            background: var(--accent-glow);
        }

        /* Tools Grid */
        .tools-section {
            padding: 40px 0 100px;
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 20px;
        }

        @media (max-width: 768px) {
            .tools-grid {
                grid-template-columns: 1fr;
            }
        }

        .tool-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 14px;
            padding: 28px;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
        }

        .tool-card:hover {
            border-color: var(--border);
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }

        .tool-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .tool-icon {
            width: 48px;
            height: 48px;
            background: var(--accent-glow);
            border: 1px solid var(--border);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
        }

        .tool-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 100px;
        }

        .status-live {
            background: var(--green-glow);
            color: var(--green);
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .status-beta {
            background: rgba(245, 158, 11, 0.1);
            color: var(--amber);
            border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .status-soon {
            background: rgba(59, 130, 246, 0.1);
            color: var(--blue);
            border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
        }

        .tool-card h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .tool-card p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.7;
            flex-grow: 1;
            margin-bottom: 20px;
        }

        .tool-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            border-top: 1px solid var(--border-subtle);
        }

        .tool-tags {
            display: flex;
            gap: 6px;
        }

        .tool-tag {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            background: rgba(255, 255, 255, 0.04);
            padding: 4px 10px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .tool-action {
            color: var(--accent);
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
        }

        .tool-action:hover {
            color: var(--accent-hover);
            gap: 8px;
        }

        /* CTA */
        .cta-banner {
            background: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 48px;
            text-align: center;
            margin-bottom: 80px;
            position: relative;
            overflow: hidden;
        }

        .cta-banner::before {
            content: '';
            position: absolute;
            top: -50%;
            left: 50%;
            transform: translateX(-50%);
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
            pointer-events: none;
        }

        .cta-banner h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
            position: relative;
            z-index: 1;
        }

        .cta-banner p {
            color: var(--text-secondary);
            font-size: 16px;
            margin-bottom: 28px;
            position: relative;
            z-index: 1;
        }

        .btn-primary {
            background: var(--accent);
            color: #fff;
            padding: 14px 32px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
            display: inline-block;
            position: relative;
            z-index: 1;
        }

        .btn-primary:hover {
            background: var(--accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 8px 30px var(--accent-glow);
        }

        /* Footer */
        footer {
            border-top: 1px solid var(--border-subtle);
            padding: 32px 0;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--text-secondary);
            font-size: 13px;
        }

        .footer-content a {
            color: var(--accent);
            text-decoration: none;
        }

        @media (max-width: 768px) {
            .footer-content {
                flex-direction: column;
                gap: 8px;
                text-align: center;
            }
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fadeInUp 0.5s ease forwards;
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
                    <div class="logo-text">Silverback<span>AI</span> <span class="toolkit-label">/ Toolkit</span></div>
                </a>

                <nav>
                    <a href="#tools">All Tools</a>
                    <a href="#request">Request a Tool</a>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>The <span class="gradient-text">Toolkit</span></h1>
            <p>
                Pre-built AI tools ready to deploy. Pick one, plug it into your
                workflow, and start saving hours immediately.
            </p>
            <div class="hero-search">
                <span class="search-icon">&#x1F50D;</span>
                <input type="text" placeholder="Search tools... (e.g. legal, property, content)" id="searchInput">
            </div>
        </div>
    </section>

    <div class="container">
        <div class="filter-bar" id="filterBar">
            <button class="filter-btn active" data-category="all">All Tools</button>
            <button class="filter-btn" data-category="legal">Legal</button>
            <button class="filter-btn" data-category="property">Property</button>
            <button class="filter-btn" data-category="web">Web</button>
            <button class="filter-btn" data-category="automation">Automation</button>
            <button class="filter-btn" data-category="data">Data</button>
        </div>
    </div>

    <section class="tools-section" id="tools">
        <div class="container">
            <div class="tools-grid" id="toolsGrid">

                <div class="tool-card" data-category="legal">
                    <div class="tool-header">
                        <div class="tool-icon">&#x2696;&#xFE0F;</div>
                        <div class="tool-status status-live"><span class="status-dot"></span> Live</div>
                    </div>
                    <h3>Contract Analyzer</h3>
                    <p>Upload a contract and get a plain-English summary of key terms, obligations, deadlines, and red flags. Built for solo attorneys and small firms.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Legal</span>
                            <span class="tool-tag">Documents</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="legal">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F4DA;</div>
                        <div class="tool-status status-live"><span class="status-dot"></span> Live</div>
                    </div>
                    <h3>Case Research Assistant</h3>
                    <p>AI-powered case law research. Describe your situation in plain language and get relevant precedents, statutes, and arguments. Saves hours of research time.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Legal</span>
                            <span class="tool-tag">Research</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="property">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F3E2;</div>
                        <div class="tool-status status-live"><span class="status-dot"></span> Live</div>
                    </div>
                    <h3>Tenant Communication Bot</h3>
                    <p>Automated tenant messaging for maintenance requests, lease renewals, and announcements. Handles routine inquiries 24/7 so you don&#39;t have to.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Property</span>
                            <span class="tool-tag">Comms</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="property">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F4CB;</div>
                        <div class="tool-status status-live"><span class="status-dot"></span> Live</div>
                    </div>
                    <h3>Lease Analyzer</h3>
                    <p>Upload any lease agreement and get instant analysis of terms, rent escalation clauses, liability issues, and renewal conditions. Compare across your portfolio.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Property</span>
                            <span class="tool-tag">Documents</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="property">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F527;</div>
                        <div class="tool-status status-beta"><span class="status-dot"></span> Beta</div>
                    </div>
                    <h3>Maintenance Router</h3>
                    <p>AI triages incoming maintenance requests by urgency, assigns to the right vendor, and tracks resolution. Reduces response time and keeps tenants happy.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Property</span>
                            <span class="tool-tag">Ops</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="web">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F310;</div>
                        <div class="tool-status status-live"><span class="status-dot"></span> Live</div>
                    </div>
                    <h3>Site Builder AI</h3>
                    <p>Describe your business and get a professional website generated with copy, layout, and SEO built in. Deploy to Cloudflare in minutes, not weeks.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Web</span>
                            <span class="tool-tag">Content</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="web">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F4DD;</div>
                        <div class="tool-status status-live"><span class="status-dot"></span> Live</div>
                    </div>
                    <h3>Content Generator</h3>
                    <p>Generate blog posts, landing page copy, social media content, and email campaigns tailored to your brand voice. Batch create weeks of content in one session.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Web</span>
                            <span class="tool-tag">Marketing</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="automation">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F916;</div>
                        <div class="tool-status status-beta"><span class="status-dot"></span> Beta</div>
                    </div>
                    <h3>Workflow Automator</h3>
                    <p>Connect your existing tools with AI-powered automation. Email to spreadsheet, form to CRM, invoice to accounting &mdash; set it once and forget it.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Automation</span>
                            <span class="tool-tag">Integration</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="automation">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F4E7;</div>
                        <div class="tool-status status-live"><span class="status-dot"></span> Live</div>
                    </div>
                    <h3>Smart Inbox</h3>
                    <p>AI reads, categorizes, and drafts replies to your email. Flags what needs your attention, handles the rest. Works with Gmail and Outlook.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Automation</span>
                            <span class="tool-tag">Email</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="data">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F4CA;</div>
                        <div class="tool-status status-beta"><span class="status-dot"></span> Beta</div>
                    </div>
                    <h3>Data Insight Engine</h3>
                    <p>Upload spreadsheets or connect databases and ask questions in plain English. Get charts, summaries, and trend analysis without writing a single formula.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Data</span>
                            <span class="tool-tag">Analytics</span>
                        </div>
                        <a href="#request" class="tool-action">Learn More &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="data">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F4C4;</div>
                        <div class="tool-status status-soon"><span class="status-dot"></span> Coming Soon</div>
                    </div>
                    <h3>Document OCR + Extract</h3>
                    <p>Scan physical documents, receipts, or handwritten notes and extract structured data. Feed it into your existing systems automatically.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Data</span>
                            <span class="tool-tag">Documents</span>
                        </div>
                        <a href="#request" class="tool-action">Notify Me &#x2192;</a>
                    </div>
                </div>

                <div class="tool-card" data-category="automation">
                    <div class="tool-header">
                        <div class="tool-icon">&#x1F50C;</div>
                        <div class="tool-status status-soon"><span class="status-dot"></span> Coming Soon</div>
                    </div>
                    <h3>API Bridge</h3>
                    <p>Connect any API to any other API with a natural language interface. Tell it what you want to happen, and it builds the integration. No code required.</p>
                    <div class="tool-footer">
                        <div class="tool-tags">
                            <span class="tool-tag">Automation</span>
                            <span class="tool-tag">Dev</span>
                        </div>
                        <a href="#request" class="tool-action">Notify Me &#x2192;</a>
                    </div>
                </div>

            </div>

            <div class="cta-banner" id="request" style="margin-top: 60px;">
                <h2>Need Something Custom?</h2>
                <p>
                    Don&#39;t see what you need? We build custom AI tools for your
                    exact workflow. Tell us what you&#39;re trying to solve.
                </p>
                <a href="mailto:hello@silverbackai.agency" class="btn-primary">Request a Custom Tool</a>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <p>&copy; 2026 Silverback AI. All rights reserved.</p>
                <p><a href="https://silverbackai.agency">Back to SilverbackAI.agency</a></p>
            </div>
        </div>
    </footer>

    <script>
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const toolCards = document.querySelectorAll('.tool-card');

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            toolCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
        });

        // Category filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const category = this.dataset.category;
                toolCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Clear search when filtering
                searchInput.value = '';
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
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        toolCards.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    <\/script>
</body>
</html>`;
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
      }
    });
  }
};
export {
  worker_default as default
};
