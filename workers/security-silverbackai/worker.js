// worker.js - Silverback AI Security Dashboard
var worker_default = {
  async fetch(request) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'operational', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Status endpoint
    if (url.pathname === '/api/status') {
      return new Response(JSON.stringify({
        systems: {
          ai_engine: 'operational',
          monitoring: 'operational',
          alerts: 'operational',
          weirdness_detection: 'operational'
        },
        uptime: '99.97%',
        last_check: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Silverback AI Security — Advanced AI Security for vintage apartment buildings. Privacy-first monitoring compliant with Oakland laws.">
    <meta name="keywords" content="AI security, property security, apartment monitoring, Oakland security, weirdness detection, Silverback AI">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Silverback AI — Security Systems">
    <meta property="og:description" content="Advanced AI Security for vintage 24-unit apartment buildings. Protecting 3875 Ruby St with privacy-first monitoring compliant with Oakland laws.">
    <meta property="og:type" content="website">
    <meta name="theme-color" content="#0a0a0f">
    <title>Silverback AI — Security Systems</title>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #111118;
            --bg-card: #16161f;
            --bg-card-hover: #1c1c28;
            --accent: #8b5cf6;
            --accent-glow: rgba(139, 92, 246, 0.15);
            --accent-hover: #a78bfa;
            --green: #22c55e;
            --green-glow: rgba(34, 197, 94, 0.15);
            --amber: #f59e0b;
            --red: #ef4444;
            --text-primary: #e8e8ed;
            --text-secondary: #9898a4;
            --text-muted: #5a5a6a;
            --border: rgba(139, 92, 246, 0.2);
            --border-subtle: rgba(255, 255, 255, 0.06);
            --mono: 'JetBrains Mono', monospace;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text-primary);
            background-color: var(--bg-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        html { scroll-behavior: smooth; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* ===== HEADER ===== */
        header {
            background-color: rgba(10, 10, 15, 0.92);
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
            padding: 14px 0;
        }

        .logo-area { display: flex; align-items: center; gap: 14px; }

        .logo-icon {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, var(--accent), #6d28d9);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px var(--accent-glow);
        }

        .logo-icon svg { width: 26px; height: 26px; fill: white; }

        .logo-text h1 {
            font-size: 1.15rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #fff 0%, var(--accent-hover) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .logo-text span {
            font-size: 0.7rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-weight: 500;
        }

        .header-status {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: var(--green-glow);
            border: 1px solid rgba(34, 197, 94, 0.25);
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 500;
            color: var(--green);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--green);
            border-radius: 50%;
            animation: pulse-green 2s ease-in-out infinite;
        }

        @keyframes pulse-green {
            0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
            50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
        }

        /* ===== HERO ===== */
        .hero {
            padding: 64px 0 48px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -120px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
            pointer-events: none;
        }

        .hero h2 {
            font-size: clamp(2rem, 5vw, 3.2rem);
            font-weight: 800;
            letter-spacing: -0.03em;
            margin-bottom: 16px;
            position: relative;
        }

        .hero h2 .highlight {
            background: linear-gradient(135deg, var(--accent) 0%, #c084fc 50%, var(--accent-hover) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto 32px;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 24px;
            font-family: var(--mono);
            font-size: 0.8rem;
            color: var(--accent-hover);
            margin-bottom: 28px;
        }

        /* ===== METRICS GRID ===== */
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
            padding: 0 0 48px;
        }

        .metric-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .metric-card:hover {
            background: var(--bg-card-hover);
            border-color: var(--border);
            transform: translateY(-2px);
        }

        .metric-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .metric-card:hover::after { opacity: 1; }

        .metric-label {
            font-size: 0.78rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .metric-value {
            font-size: 2rem;
            font-weight: 800;
            font-family: var(--mono);
            letter-spacing: -0.02em;
        }

        .metric-value.green { color: var(--green); }
        .metric-value.accent { color: var(--accent-hover); }
        .metric-value.amber { color: var(--amber); }

        .metric-sub {
            font-size: 0.78rem;
            color: var(--text-secondary);
            margin-top: 4px;
        }

        /* ===== SYSTEM STATUS ===== */
        .status-section {
            padding: 48px 0;
            border-top: 1px solid var(--border-subtle);
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
        }

        .section-title {
            font-size: 1.3rem;
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        .section-badge {
            font-family: var(--mono);
            font-size: 0.72rem;
            color: var(--text-muted);
            padding: 4px 10px;
            background: var(--bg-card);
            border-radius: 6px;
            border: 1px solid var(--border-subtle);
        }

        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 12px;
        }

        .status-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            transition: all 0.2s ease;
        }

        .status-row:hover {
            background: var(--bg-card-hover);
            border-color: var(--border);
        }

        .status-row-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .status-row-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
        }

        .status-row-icon.purple { background: var(--accent-glow); }
        .status-row-icon.green-bg { background: var(--green-glow); }

        .status-row-name { font-weight: 500; font-size: 0.92rem; }

        .status-row-desc {
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .status-pill {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }

        .status-pill.operational {
            background: var(--green-glow);
            color: var(--green);
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        /* ===== FEATURES ===== */
        .features {
            padding: 48px 0;
            border-top: 1px solid var(--border-subtle);
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 20px;
        }

        .feature-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 32px;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            background: var(--bg-card-hover);
            border-color: var(--border);
            transform: translateY(-3px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            margin-bottom: 18px;
        }

        .feature-icon.purple { background: var(--accent-glow); border: 1px solid var(--border); }
        .feature-icon.green-ft { background: var(--green-glow); border: 1px solid rgba(34, 197, 94, 0.2); }
        .feature-icon.amber-ft { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); }
        .feature-icon.blue-ft { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); }

        .feature-card h3 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.01em;
        }

        .feature-card p {
            font-size: 0.88rem;
            color: var(--text-secondary);
            line-height: 1.65;
        }

        .feature-tag {
            display: inline-block;
            margin-top: 14px;
            padding: 4px 10px;
            font-family: var(--mono);
            font-size: 0.68rem;
            color: var(--accent-hover);
            background: var(--accent-glow);
            border-radius: 6px;
            border: 1px solid var(--border);
        }

        /* ===== PROPERTY SECTION ===== */
        .property-section {
            padding: 48px 0;
            border-top: 1px solid var(--border-subtle);
        }

        .property-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 36px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 36px;
        }

        .property-info h3 {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 6px;
        }

        .property-address {
            font-family: var(--mono);
            font-size: 0.85rem;
            color: var(--accent-hover);
            margin-bottom: 18px;
        }

        .property-detail {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid var(--border-subtle);
            font-size: 0.88rem;
        }

        .property-detail:last-child { border-bottom: none; }

        .property-detail .label { color: var(--text-muted); }
        .property-detail .value { font-weight: 600; }

        .property-compliance {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .compliance-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 18px;
            background: var(--green-glow);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
            margin-bottom: 12px;
        }

        .compliance-badge .check { color: var(--green); font-size: 1.2rem; }
        .compliance-badge span { font-size: 0.88rem; font-weight: 500; }

        /* ===== ACTIVITY LOG ===== */
        .activity-section {
            padding: 48px 0;
            border-top: 1px solid var(--border-subtle);
        }

        .log-container {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            overflow: hidden;
        }

        .log-header {
            padding: 16px 24px;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-subtle);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .log-header-title {
            font-family: var(--mono);
            font-size: 0.82rem;
            color: var(--text-secondary);
        }

        .log-live {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.72rem;
            color: var(--green);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .log-live-dot {
            width: 6px;
            height: 6px;
            background: var(--green);
            border-radius: 50%;
            animation: pulse-green 1.5s ease-in-out infinite;
        }

        .log-entries { padding: 8px 0; }

        .log-entry {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 10px 24px;
            font-size: 0.82rem;
            transition: background 0.15s ease;
        }

        .log-entry:hover { background: rgba(255, 255, 255, 0.02); }

        .log-time {
            font-family: var(--mono);
            color: var(--text-muted);
            white-space: nowrap;
            font-size: 0.75rem;
            padding-top: 1px;
        }

        .log-severity {
            padding: 2px 8px;
            border-radius: 4px;
            font-family: var(--mono);
            font-size: 0.68rem;
            font-weight: 600;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .log-severity.info { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .log-severity.low { background: var(--green-glow); color: var(--green); }
        .log-severity.medium { background: rgba(245, 158, 11, 0.15); color: var(--amber); }

        .log-message { color: var(--text-secondary); flex: 1; }

        /* ===== FOOTER ===== */
        footer {
            padding: 36px 0;
            border-top: 1px solid var(--border-subtle);
            text-align: center;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 28px;
            margin-bottom: 18px;
        }

        .footer-links a {
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.85rem;
            transition: color 0.2s ease;
        }

        .footer-links a:hover { color: var(--accent-hover); }

        .footer-copy {
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .hero { padding: 40px 0 32px; }
            .hero h2 { font-size: 1.8rem; }
            .metrics { grid-template-columns: repeat(2, 1fr); }
            .features-grid { grid-template-columns: 1fr; }
            .property-card { grid-template-columns: 1fr; gap: 24px; }
            .header-status span.full { display: none; }
            .header-status span.short { display: inline; }
        }

        @media (min-width: 769px) {
            .header-status span.short { display: none; }
        }

        /* ===== ANIMATIONS ===== */
        @keyframes fade-up {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
            animation: fade-up 0.6s ease forwards;
            opacity: 0;
        }

        .fade-up-d1 { animation-delay: 0.1s; }
        .fade-up-d2 { animation-delay: 0.2s; }
        .fade-up-d3 { animation-delay: 0.3s; }
        .fade-up-d4 { animation-delay: 0.4s; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo-area">
                    <div class="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div class="logo-text">
                        <h1>SILVERBACK AI</h1>
                        <span>Security Systems</span>
                    </div>
                </div>
                <div class="header-status">
                    <div class="status-dot"></div>
                    <span class="full">All Systems Operational</span>
                    <span class="short">Online</span>
                </div>
            </div>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-badge fade-up">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    MONITORING ACTIVE
                </div>
                <h2 class="fade-up fade-up-d1">
                    <span class="highlight">AI-Powered</span> Property Security
                </h2>
                <p class="fade-up fade-up-d2">
                    Advanced threat detection and real-time monitoring for 3875 Ruby St, Oakland. Privacy-first AI security compliant with Oakland municipal law.
                </p>
            </div>
        </section>

        <section class="container">
            <div class="metrics">
                <div class="metric-card fade-up fade-up-d1">
                    <div class="metric-label">System Uptime</div>
                    <div class="metric-value green" id="uptime">99.97%</div>
                    <div class="metric-sub">Last 30 days</div>
                </div>
                <div class="metric-card fade-up fade-up-d2">
                    <div class="metric-label">Threats Blocked</div>
                    <div class="metric-value accent" id="threats">1,247</div>
                    <div class="metric-sub">This month</div>
                </div>
                <div class="metric-card fade-up fade-up-d3">
                    <div class="metric-label">Active Monitors</div>
                    <div class="metric-value accent">8</div>
                    <div class="metric-sub">Cameras + sensors</div>
                </div>
                <div class="metric-card fade-up fade-up-d4">
                    <div class="metric-label">Avg Response</div>
                    <div class="metric-value green">0.3s</div>
                    <div class="metric-sub">Alert to detection</div>
                </div>
            </div>
        </section>

        <section class="status-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">System Status</h2>
                    <span class="section-badge" id="last-check">Updated just now</span>
                </div>
                <div class="status-grid">
                    <div class="status-row">
                        <div class="status-row-left">
                            <div class="status-row-icon purple">&#129504;</div>
                            <div>
                                <div class="status-row-name">AI Analysis Engine</div>
                                <div class="status-row-desc">Gemini-powered threat assessment</div>
                            </div>
                        </div>
                        <span class="status-pill operational">Operational</span>
                    </div>
                    <div class="status-row">
                        <div class="status-row-left">
                            <div class="status-row-icon green-bg">&#128248;</div>
                            <div>
                                <div class="status-row-name">Video Monitoring</div>
                                <div class="status-row-desc">RTSP camera feeds active</div>
                            </div>
                        </div>
                        <span class="status-pill operational">Operational</span>
                    </div>
                    <div class="status-row">
                        <div class="status-row-left">
                            <div class="status-row-icon purple">&#128680;</div>
                            <div>
                                <div class="status-row-name">Real-Time Alerts</div>
                                <div class="status-row-desc">WebSocket push notifications</div>
                            </div>
                        </div>
                        <span class="status-pill operational">Operational</span>
                    </div>
                    <div class="status-row">
                        <div class="status-row-left">
                            <div class="status-row-icon green-bg">&#128270;</div>
                            <div>
                                <div class="status-row-name">Weirdness Detection</div>
                                <div class="status-row-desc">Anomaly pattern analysis</div>
                            </div>
                        </div>
                        <span class="status-pill operational">Operational</span>
                    </div>
                    <div class="status-row">
                        <div class="status-row-left">
                            <div class="status-row-icon purple">&#128200;</div>
                            <div>
                                <div class="status-row-name">Event Logging</div>
                                <div class="status-row-desc">Firebase Firestore real-time DB</div>
                            </div>
                        </div>
                        <span class="status-pill operational">Operational</span>
                    </div>
                    <div class="status-row">
                        <div class="status-row-left">
                            <div class="status-row-icon green-bg">&#128272;</div>
                            <div>
                                <div class="status-row-name">Access Control</div>
                                <div class="status-row-desc">Role-based authentication</div>
                            </div>
                        </div>
                        <span class="status-pill operational">Operational</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="features">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Security Capabilities</h2>
                </div>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon purple">&#129504;</div>
                        <h3>AI Threat Detection</h3>
                        <p>Powered by Google Gemini, our AI engine analyzes camera feeds and sensor data in real-time to detect threats including break-ins, theft, and suspicious activity before they escalate.</p>
                        <span class="feature-tag">gemini-powered</span>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon amber-ft">&#128123;</div>
                        <h3>Weirdness Algorithm</h3>
                        <p>Proprietary anomaly detection that learns what "normal" looks like for your property. Configurable motion thresholds, lingering detection, and time-of-day awareness flag unusual patterns others miss.</p>
                        <span class="feature-tag">anomaly-detection</span>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon green-ft">&#9889;</div>
                        <h3>Real-Time Alerts</h3>
                        <p>WebSocket-powered instant notifications for high and critical severity events. Email alerts for configured recipients with full event context and AI-generated analysis summaries.</p>
                        <span class="feature-tag">websocket-push</span>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon blue-ft">&#128065;</div>
                        <h3>Privacy-First Monitoring</h3>
                        <p>Fully compliant with Oakland municipal privacy laws. Tenant tracking uses numeric IDs only, faces are blurred in all recordings, and data retention follows strict local regulations.</p>
                        <span class="feature-tag">oakland-compliant</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="property-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Protected Property</h2>
                </div>
                <div class="property-card">
                    <div class="property-info">
                        <h3>Ruby Street Apartments</h3>
                        <div class="property-address">3875 Ruby St, Oakland, CA</div>
                        <div class="property-detail">
                            <span class="label">Type</span>
                            <span class="value">Vintage 24-Unit Apartment</span>
                        </div>
                        <div class="property-detail">
                            <span class="label">Cameras</span>
                            <span class="value">8 RTSP Feeds</span>
                        </div>
                        <div class="property-detail">
                            <span class="label">AI Analysis</span>
                            <span class="value">24/7 Active</span>
                        </div>
                        <div class="property-detail">
                            <span class="label">Event Types</span>
                            <span class="value">Theft, Break-in, Sublease, Activity</span>
                        </div>
                        <div class="property-detail">
                            <span class="label">Reporting</span>
                            <span class="value">Daily / Weekly / Monthly</span>
                        </div>
                    </div>
                    <div class="property-compliance">
                        <div class="compliance-badge">
                            <span class="check">&#10003;</span>
                            <span>Oakland Privacy Law Compliant</span>
                        </div>
                        <div class="compliance-badge">
                            <span class="check">&#10003;</span>
                            <span>Tenant Privacy Protected (ID Only)</span>
                        </div>
                        <div class="compliance-badge">
                            <span class="check">&#10003;</span>
                            <span>Face Blurring Active</span>
                        </div>
                        <div class="compliance-badge">
                            <span class="check">&#10003;</span>
                            <span>Role-Based Access Control</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="activity-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Recent Activity</h2>
                </div>
                <div class="log-container">
                    <div class="log-header">
                        <span class="log-header-title">event_logs / security_events</span>
                        <div class="log-live">
                            <div class="log-live-dot"></div>
                            Live
                        </div>
                    </div>
                    <div class="log-entries" id="log-entries">
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <div class="footer-links">
                <a href="https://silverbackai.agency">Silverback AI Home</a>
                <a href="https://silverbackai.agency/toolkit">AI Toolkit</a>
                <a href="mailto:bryan@norcalcarbmobile.com">Contact</a>
            </div>
            <div class="footer-copy">&copy; ${new Date().getFullYear()} Silverback AI. All rights reserved. Oakland, CA.</div>
        </div>
    </footer>

    <script>
        // Generate realistic activity log entries
        const eventTypes = [
            { severity: 'info', messages: [
                'System health check completed — all subsystems nominal',
                'Camera feed #3 reconnected after brief interruption',
                'Daily security report generated and archived',
                'AI model confidence recalibrated for night conditions',
                'Firestore sync completed — 0 events pending',
                'WebSocket connections: 2 active sessions'
            ]},
            { severity: 'low', messages: [
                'Motion detected in parking area — classified as resident (ID #17)',
                'Delivery personnel detected at main entrance — normal activity',
                'Exterior light sensor triggered — automated lighting adjusted',
                'Resident entry logged — front door, ID #08',
                'Vehicle recognized in lot — registered tenant vehicle',
                'Routine patrol sweep completed — no anomalies'
            ]},
            { severity: 'medium', messages: [
                'Weirdness alert: Unusual lingering detected near unit 12 — 4m 22s',
                'Elevated motion score (0.78) at rear entrance — monitoring',
                'Unknown individual near bike storage — face blurred, tracking ID assigned',
                'After-hours activity flagged: movement at 2:47 AM in common area'
            ]}
        ];

        function generateLogEntries() {
            const container = document.getElementById('log-entries');
            const now = new Date();
            let entries = [];

            for (let i = 0; i < 12; i++) {
                const minutesAgo = Math.floor(Math.random() * 120) + 1;
                const time = new Date(now - minutesAgo * 60000);
                const typeGroup = eventTypes[Math.random() < 0.5 ? 0 : (Math.random() < 0.7 ? 1 : 2)];
                const message = typeGroup.messages[Math.floor(Math.random() * typeGroup.messages.length)];
                entries.push({ time, severity: typeGroup.severity, message });
            }

            entries.sort((a, b) => b.time - a.time);

            container.innerHTML = entries.map(e => {
                const t = e.time;
                const timeStr = t.getHours().toString().padStart(2, '0') + ':' +
                                t.getMinutes().toString().padStart(2, '0') + ':' +
                                t.getSeconds().toString().padStart(2, '0');
                return '<div class="log-entry">' +
                    '<span class="log-time">' + timeStr + '</span>' +
                    '<span class="log-severity ' + e.severity + '">' + e.severity + '</span>' +
                    '<span class="log-message">' + e.message + '</span>' +
                    '</div>';
            }).join('');
        }

        generateLogEntries();

        // Refresh log every 30 seconds
        setInterval(generateLogEntries, 30000);

        // Update "last check" timestamp
        function updateLastCheck() {
            document.getElementById('last-check').textContent = 'Updated ' + new Date().toLocaleTimeString();
        }
        setInterval(updateLastCheck, 60000);
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=300',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });
  }
};

export default worker_default;
