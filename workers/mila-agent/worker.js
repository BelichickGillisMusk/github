var worker_default = {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mila-Claude-2426 | OpenClaw Agent</title>
<style>
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #0f1b2e;
    color: #e0e0e0;
    min-height: 100vh;
    overflow-x: hidden;
  }

  a {
    color: #00d4ff;
    text-decoration: none;
    transition: color 0.2s;
  }

  a:hover {
    color: #00ff88;
  }

  /* ── Sticky Header ── */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 24px;
    background: #0a1220;
    border-bottom: 2px solid #1a8c4a;
  }

  .header-back {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .header-clock {
    font-size: 14px;
    color: #8892a4;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /* ── Hero / Profile ── */
  .hero {
    text-align: center;
    padding: 60px 20px;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a8c4a, #00d4ff);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 48px;
    font-weight: 700;
    color: #fff;
    animation: avatarGlow 2s ease-in-out infinite;
  }

  @keyframes avatarGlow {
    0%, 100% { box-shadow: 0 0 30px rgba(26, 140, 74, 0.5); }
    50% { box-shadow: 0 0 50px rgba(26, 140, 74, 0.8), 0 0 80px rgba(0, 212, 255, 0.3); }
  }

  .hero-name {
    font-size: 2em;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .hero-subtitle {
    font-size: 16px;
    color: #8892a4;
    margin-bottom: 16px;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    background: rgba(26, 140, 74, 0.15);
    color: #00ff88;
    border: 1px solid #1a8c4a;
    margin-bottom: 32px;
  }

  .quick-stats {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
  }

  .stat-label {
    font-size: 11px;
    color: #8892a4;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
  }

  /* ── Section Titles ── */
  .section-title {
    font-size: 12px;
    font-weight: 700;
    color: #8892a4;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #2a3f5f;
  }

  /* ── Capabilities ── */
  .capabilities {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 40px;
  }

  .cap-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .cap-card {
    background: #1a2744;
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    padding: 24px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
  }

  .cap-card:nth-child(1) { animation-delay: 0.1s; }
  .cap-card:nth-child(2) { animation-delay: 0.2s; }
  .cap-card:nth-child(3) { animation-delay: 0.3s; }
  .cap-card:nth-child(4) { animation-delay: 0.4s; }
  .cap-card:nth-child(5) { animation-delay: 0.5s; }
  .cap-card:nth-child(6) { animation-delay: 0.6s; }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .cap-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .cap-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .cap-desc {
    font-size: 14px;
    color: #8892a4;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .cap-bar-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 6px;
  }

  .cap-bar-pct {
    font-size: 13px;
    font-weight: 600;
    color: #00ff88;
  }

  .cap-bar-track {
    height: 8px;
    border-radius: 4px;
    background: #2a3f5f;
    overflow: hidden;
  }

  .cap-bar-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #1a8c4a, #00ff88);
    width: 0;
    transition: width 1.2s ease;
  }

  /* ── Activity Timeline ── */
  .activity {
    max-width: 1200px;
    margin: 0 auto 40px;
    padding: 0 24px;
  }

  .terminal {
    background: #0a1220;
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    overflow: hidden;
  }

  .terminal-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #0d1526;
    border-bottom: 1px solid #2a3f5f;
  }

  .terminal-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .terminal-dot.red { background: #ff5f57; }
  .terminal-dot.amber { background: #ffbd2e; }
  .terminal-dot.green { background: #28c840; }

  .terminal-label {
    margin-left: 8px;
    font-size: 13px;
    color: #8892a4;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  }

  .terminal-content {
    padding: 24px;
    max-height: 400px;
    overflow-y: auto;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 14px;
    color: #00ff88;
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .terminal-content::-webkit-scrollbar {
    width: 6px;
  }

  .terminal-content::-webkit-scrollbar-track {
    background: #0a1220;
  }

  .terminal-content::-webkit-scrollbar-thumb {
    background: #1a8c4a;
    border-radius: 3px;
  }

  .terminal-cursor {
    display: inline-block;
    width: 8px;
    height: 16px;
    background: #00ff88;
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* ── System Info ── */
  .sysinfo {
    max-width: 1200px;
    margin: 0 auto 40px;
    padding: 0 24px;
  }

  .sysinfo-panel {
    background: #1a2744;
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    padding: 24px;
  }

  .sysinfo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 32px;
  }

  .sysinfo-row {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid rgba(42, 63, 95, 0.5);
  }

  .sysinfo-row:last-child {
    border-bottom: none;
  }

  .sysinfo-label {
    width: 40%;
    font-size: 14px;
    color: #8892a4;
    flex-shrink: 0;
  }

  .sysinfo-value {
    width: 60%;
    font-size: 14px;
    color: #fff;
    font-weight: 500;
  }

  /* ── Footer ── */
  .footer {
    padding: 40px 24px;
    text-align: center;
    border-top: 1px solid #2a3f5f;
  }

  .footer-back {
    font-size: 14px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 12px;
  }

  .footer-slack {
    font-size: 13px;
    color: #8892a4;
    margin-bottom: 8px;
  }

  .footer-copy {
    font-size: 12px;
    color: #8892a4;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cap-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .sysinfo-grid {
      grid-template-columns: 1fr;
    }

    .header-title {
      font-size: 13px;
    }
  }

  @media (max-width: 600px) {
    .cap-grid {
      grid-template-columns: 1fr;
    }

    .hero {
      padding: 40px 16px;
    }

    .hero-name {
      font-size: 1.5em;
    }

    .quick-stats {
      gap: 20px;
    }

    .capabilities,
    .activity,
    .sysinfo {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
</style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <a href="#" class="header-back">&#8592; OPENCLAW OFFICE</a><!-- Replace href with openclaw-office worker URL -->
    <div class="header-title">MILA-CLAUDE-2426</div>
    <div class="header-clock" id="clock">--:--:-- PST</div>
  </header>

  <!-- Hero / Profile -->
  <section class="hero">
    <div class="avatar">M</div>
    <h1 class="hero-name">Mila-Claude-2426</h1>
    <p class="hero-subtitle">Primary AI Assistant &mdash; NorCal CARB Mobile LLC</p>
    <span class="status-badge">ACTIVE</span>
    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-label">Deployed</div>
        <div class="stat-value">Mar 2026</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Platform</div>
        <div class="stat-value">Cloudflare Workers</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Framework</div>
        <div class="stat-value">OpenClaw</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Model</div>
        <div class="stat-value">Claude</div>
      </div>
    </div>
  </section>

  <!-- Capabilities -->
  <section class="capabilities">
    <div class="section-title">CAPABILITIES</div>
    <div class="cap-grid">
      <div class="cap-card">
        <div class="cap-icon">&#x1F4AC;</div>
        <div class="cap-title">Customer Inquiry Response</div>
        <p class="cap-desc">Handles inbound questions about CARB testing, pricing, and scheduling</p>
        <div class="cap-bar-header"><span class="cap-bar-pct">95%</span></div>
        <div class="cap-bar-track"><div class="cap-bar-fill" data-width="95"></div></div>
      </div>
      <div class="cap-card">
        <div class="cap-icon">&#x1F4CA;</div>
        <div class="cap-title">Report Generation</div>
        <p class="cap-desc">Creates compliance reports, invoices, and business summaries</p>
        <div class="cap-bar-header"><span class="cap-bar-pct">88%</span></div>
        <div class="cap-bar-track"><div class="cap-bar-fill" data-width="88"></div></div>
      </div>
      <div class="cap-card">
        <div class="cap-icon">&#x1F4C5;</div>
        <div class="cap-title">Schedule Management</div>
        <p class="cap-desc">Coordinates mobile testing appointments and fleet schedules</p>
        <div class="cap-bar-header"><span class="cap-bar-pct">82%</span></div>
        <div class="cap-bar-track"><div class="cap-bar-fill" data-width="82"></div></div>
      </div>
      <div class="cap-card">
        <div class="cap-icon">&#x1F517;</div>
        <div class="cap-title">CRM Integration</div>
        <p class="cap-desc">Syncs customer data and contacts via Zapier workflows</p>
        <div class="cap-bar-header"><span class="cap-bar-pct">76%</span></div>
        <div class="cap-bar-track"><div class="cap-bar-fill" data-width="76"></div></div>
      </div>
      <div class="cap-card">
        <div class="cap-icon">&#x2705;</div>
        <div class="cap-title">Compliance Monitoring</div>
        <p class="cap-desc">Tracks CARB regulation updates, deadlines, and certification status</p>
        <div class="cap-bar-header"><span class="cap-bar-pct">90%</span></div>
        <div class="cap-bar-track"><div class="cap-bar-fill" data-width="90"></div></div>
      </div>
      <div class="cap-card">
        <div class="cap-icon">&#x1F69B;</div>
        <div class="cap-title">Fleet Communication</div>
        <p class="cap-desc">Sends automated fleet testing reminders and follow-ups</p>
        <div class="cap-bar-header"><span class="cap-bar-pct">70%</span></div>
        <div class="cap-bar-track"><div class="cap-bar-fill" data-width="70"></div></div>
      </div>
    </div>
  </section>

  <!-- Activity Timeline -->
  <section class="activity">
    <div class="section-title">ACTIVITY LOG</div>
    <div class="terminal">
      <div class="terminal-bar">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot amber"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-label">mila-agent-log</span>
      </div>
      <div class="terminal-content" id="terminal">
[2026-03-18 14:32:15] STATUS: Active - Processing queue
[2026-03-18 14:32:01] TASK: Processed customer inquiry - Green Morning Inc
[2026-03-18 14:28:44] SYNC: CRM data synchronized via Zapier MCP
[2026-03-18 14:15:22] TASK: Updated compliance calendar - 3 entries added
[2026-03-18 13:48:09] REPORT: Weekly summary generated - 12 tests completed
[2026-03-18 13:30:00] COMMS: Automated fleet reminder sent to 4 contacts
[2026-03-18 12:15:33] TASK: Invoice INV0239 processed and dispatched
[2026-03-18 11:00:00] EVENT: Joined OpenClaw + Claude cowork session
[2026-03-18 09:45:12] SCAN: Morning compliance check passed
[2026-03-18 09:30:00] BOOT: Daily initialization complete
[2026-03-18 09:29:55] LOAD: Capabilities matrix loaded - 6 modules active
[2026-03-18 09:29:50] CONN: Connected to Cloudflare Workers runtime
[2026-03-18 09:29:45] AUTH: Authentication verified - OpenClaw framework
[2026-03-18 09:29:40] INIT: Mila-Claude-2426 starting up...
[2026-03-18 09:29:35] SYS: System check - All subsystems nominal
<span class="terminal-cursor"></span></div>
    </div>
  </section>

  <!-- System Information -->
  <section class="sysinfo">
    <div class="section-title">SYSTEM INFORMATION</div>
    <div class="sysinfo-panel">
      <div class="sysinfo-grid">
        <div class="sysinfo-row">
          <div class="sysinfo-label">Agent ID</div>
          <div class="sysinfo-value">MILA-CLAUDE-2426</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Framework</div>
          <div class="sysinfo-value">OpenClaw v1.0</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Runtime</div>
          <div class="sysinfo-value">Cloudflare Workers</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Region</div>
          <div class="sysinfo-value">US-West (Auto)</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Memory Limit</div>
          <div class="sysinfo-value">128 MB</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">CPU Time (avg)</div>
          <div class="sysinfo-value">8ms</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Connected Services</div>
          <div class="sysinfo-value">Zapier MCP, Google Workspace, Slack</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Owner</div>
          <div class="sysinfo-value">NorCal CARB Mobile LLC</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Contact</div>
          <div class="sysinfo-value">bryan@norcalcarbmobile.com</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Deployed</div>
          <div class="sysinfo-value">March 18, 2026</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Last Updated</div>
          <div class="sysinfo-value">March 18, 2026</div>
        </div>
        <div class="sysinfo-row">
          <div class="sysinfo-label">Status</div>
          <div class="sysinfo-value" style="color:#00ff88;">Operational</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <a href="#" class="footer-back">&#8592; Return to OpenClaw Office</a><!-- Replace href with openclaw-office worker URL -->
    <p class="footer-slack">Connected to #openclaw-agents on Slack</p>
    <p class="footer-copy">NorCal CARB Mobile LLC &copy; 2026</p>
  </footer>

  <script>
    // ── Live Clock (PST) ──
    function updateClock() {
      var now = new Date();
      var options = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      var timeStr = now.toLocaleTimeString('en-US', options) + ' PST';
      document.getElementById('clock').textContent = timeStr;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ── Proficiency Bar Animation ──
    function animateBars() {
      var bars = document.querySelectorAll('.cap-bar-fill');
      bars.forEach(function(bar) {
        var width = bar.getAttribute('data-width');
        setTimeout(function() {
          bar.style.width = width + '%';
        }, 300);
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateBars();
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });
      var capSection = document.querySelector('.capabilities');
      if (capSection) observer.observe(capSection);
    } else {
      setTimeout(animateBars, 500);
    }

    // ── Terminal Auto-scroll ──
    var terminal = document.getElementById('terminal');
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
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
export { worker_default as default };
