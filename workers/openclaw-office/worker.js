var worker_default = {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OpenClaw Office - Mission Control</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #0f1b2e;
    color: #e0e0e0;
    min-height: 100vh;
    line-height: 1.5;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px currentColor; }
    50% { box-shadow: 0 0 20px currentColor; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes headerGlow {
    0%, 100% { border-bottom-color: #1a8c4a; box-shadow: 0 2px 8px rgba(26, 140, 74, 0.3); }
    50% { border-bottom-color: #00ff88; box-shadow: 0 2px 16px rgba(0, 255, 136, 0.5); }
  }

  @keyframes pingRipple {
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(0, 255, 136, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
  }

  /* ===== HEADER ===== */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #0a1220;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-bottom: 2px solid #1a8c4a;
    animation: headerGlow 3s ease-in-out infinite;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1em;
    font-weight: 700;
    color: #00ff88;
    letter-spacing: 1.5px;
    white-space: nowrap;
  }

  .header-left .paw {
    font-size: 1.4em;
  }

  .header-center {
    text-align: center;
  }

  .header-center .clock-time {
    font-size: 1.1em;
    font-weight: 600;
    color: #e0e0e0;
    font-variant-numeric: tabular-nums;
  }

  .header-center .clock-date {
    font-size: 0.75em;
    color: #8892a4;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00ff88;
    animation: pulse 2s infinite;
    flex-shrink: 0;
  }

  .header-right span {
    font-size: 0.85em;
    color: #00ff88;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* ===== STATS BANNER ===== */
  .stats-banner {
    background: #1a2744;
    padding: 20px;
    margin: 20px auto;
    max-width: 1400px;
    border-radius: 12px;
    border: 1px solid #2a3f5f;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .stat-item {
    text-align: center;
  }

  .stat-label {
    font-size: 0.8em;
    color: #8892a4;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 1.8em;
    font-weight: 700;
    color: #00ff88;
  }

  .stat-value.cyan {
    color: #00d4ff;
  }

  /* ===== AGENT GRID ===== */
  .agent-grid {
    max-width: 1400px;
    margin: 24px auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .agent-card {
    background: #1a2744;
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    padding: 24px;
    border-top: 3px solid #1a8c4a;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: fadeInUp 0.6s ease-out both;
  }

  .agent-card:nth-child(1) { animation-delay: 0.1s; }
  .agent-card:nth-child(2) { animation-delay: 0.2s; }
  .agent-card:nth-child(3) { animation-delay: 0.3s; }
  .agent-card:nth-child(4) { animation-delay: 0.4s; }
  .agent-card:nth-child(5) { animation-delay: 0.5s; }

  .agent-card.status-active { border-top-color: #1a8c4a; }
  .agent-card.status-standby { border-top-color: #f0c040; }
  .agent-card.status-online { border-top-color: #00d4ff; }
  .agent-card.status-offline { border-top-color: #ff4757; }

  .agent-card.status-active:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 255, 136, 0.15); }
  .agent-card.status-standby:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(240, 192, 64, 0.15); }
  .agent-card.status-online:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 212, 255, 0.15); }
  .agent-card.status-offline:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255, 71, 87, 0.15); }

  .agent-card.ping-active { animation: pingRipple 1s ease-out; }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .agent-name {
    font-size: 1.2em;
    font-weight: 700;
    color: #ffffff;
  }

  .status-badge {
    padding: 4px 16px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .badge-active { background: rgba(26, 140, 74, 0.2); color: #00ff88; }
  .badge-standby { background: rgba(240, 192, 64, 0.2); color: #f0c040; }
  .badge-online { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }
  .badge-offline { background: rgba(255, 71, 87, 0.2); color: #ff4757; }

  .agent-role {
    color: #8892a4;
    font-size: 0.9em;
    margin-bottom: 16px;
  }

  .card-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .card-stat-label {
    font-size: 0.7em;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8892a4;
    margin-bottom: 2px;
  }

  .card-stat-value {
    font-size: 0.9em;
    color: #e0e0e0;
    font-weight: 600;
  }

  .skill-bar-track {
    width: 100%;
    height: 18px;
    background: #0a1220;
    border-radius: 9px;
    position: relative;
    overflow: hidden;
  }

  .skill-bar-fill {
    height: 100%;
    border-radius: 9px;
    transition: width 0.8s ease;
  }

  .skill-bar-fill.green { background: linear-gradient(90deg, #1a8c4a, #00ff88); }
  .skill-bar-fill.amber { background: linear-gradient(90deg, #c49000, #f0c040); }
  .skill-bar-fill.cyan { background: linear-gradient(90deg, #0088aa, #00d4ff); }
  .skill-bar-fill.red { background: linear-gradient(90deg, #aa2030, #ff4757); }

  .skill-bar-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.7em;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  .activity-log {
    background: #0a1220;
    border-radius: 8px;
    padding: 12px;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 13px;
    color: #00ff88;
    line-height: 1.7;
    margin-bottom: 16px;
  }

  .activity-log .log-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .view-details-btn {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 8px;
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
    text-decoration: none;
    font-size: 0.85em;
    font-weight: 600;
    border: 1px solid rgba(0, 212, 255, 0.3);
    transition: background 0.2s, border-color 0.2s;
  }

  .view-details-btn:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
  }

  .ping-btn {
    padding: 8px 20px;
    border-radius: 8px;
    background: rgba(0, 255, 136, 0.1);
    color: #00ff88;
    border: 1px solid rgba(0, 255, 136, 0.3);
    font-size: 0.85em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    font-family: inherit;
  }

  .ping-btn:hover {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
  }

  /* ===== SLACK BANNER ===== */
  .slack-banner {
    max-width: 1400px;
    margin: 24px auto;
    padding: 0 20px;
  }

  .slack-banner-inner {
    background: #1a2744;
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }

  .slack-icon {
    font-size: 1.4em;
    margin-right: 8px;
  }

  .slack-channel {
    font-weight: 700;
    color: #00d4ff;
  }

  .slack-subtitle {
    color: #8892a4;
    font-size: 0.85em;
    margin-top: 4px;
  }

  /* ===== FOOTER ===== */
  .footer {
    padding: 40px 20px;
    text-align: center;
    border-top: 1px solid #2a3f5f;
    margin-top: 40px;
  }

  .footer p {
    color: #8892a4;
    font-size: 0.85em;
    margin-bottom: 4px;
  }

  .footer p:first-child {
    color: #e0e0e0;
    font-weight: 600;
    font-size: 0.95em;
    margin-bottom: 8px;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {
    .agent-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .stats-banner {
      grid-template-columns: repeat(2, 1fr);
      margin: 16px;
    }

    .stat-value {
      font-size: 1.4em;
    }

    .header {
      padding: 0 12px;
    }

    .header-left {
      font-size: 0.9em;
    }

    .header-center .clock-time {
      font-size: 0.9em;
    }

    .header-right span {
      font-size: 0.75em;
    }

    .agent-grid {
      padding: 0 16px;
    }

    .agent-card {
      padding: 18px;
    }
  }

  @media (max-width: 480px) {
    .header {
      flex-wrap: wrap;
      height: auto;
      padding: 10px 12px;
      gap: 4px;
    }

    .header-left {
      font-size: 0.8em;
      order: 1;
    }

    .header-right {
      order: 2;
    }

    .header-center {
      order: 3;
      width: 100%;
      padding-top: 4px;
    }

    .stat-value {
      font-size: 1.2em;
    }

    .stat-label {
      font-size: 0.7em;
    }

    .agent-name {
      font-size: 1em;
    }

    .status-badge {
      font-size: 0.65em;
      padding: 3px 10px;
    }

    .activity-log {
      font-size: 11px;
    }
  }
</style>
</head>
<body>

<!-- ===== HEADER ===== -->
<header class="header">
  <div class="header-left">
    <span class="paw">&#x1F43E;</span>
    <span>OPENCLAW OFFICE</span>
  </div>
  <div class="header-center">
    <div class="clock-time" id="clock-time">--:--:-- PST</div>
    <div class="clock-date" id="clock-date">Loading...</div>
  </div>
  <div class="header-right">
    <div class="status-dot"></div>
    <span>ALL SYSTEMS NOMINAL</span>
  </div>
</header>

<!-- ===== STATS BANNER ===== -->
<div class="stats-banner">
  <div class="stat-item">
    <div class="stat-label">Agents Online</div>
    <div class="stat-value">3 / 5</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">Tasks Today</div>
    <div class="stat-value cyan">17</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">System Uptime</div>
    <div class="stat-value">99.7%</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">Last Sync</div>
    <div class="stat-value cyan" id="last-sync">2m ago</div>
  </div>
</div>

<!-- ===== AGENT GRID ===== -->
<div class="agent-grid">

  <!-- Agent 1: Mila-Claude-2426 -->
  <div class="agent-card status-active">
    <div class="card-header">
      <div class="agent-name">Mila-Claude-2426</div>
      <div class="status-badge badge-active">Active</div>
    </div>
    <div class="agent-role">Primary AI Assistant</div>
    <div class="card-stats">
      <div>
        <div class="card-stat-label">Location</div>
        <div class="card-stat-value">Cloudflare Workers</div>
      </div>
      <div>
        <div class="card-stat-label">Skill Level</div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill green" style="width: 92%;"></div>
          <div class="skill-bar-text">92%</div>
        </div>
      </div>
      <div>
        <div class="card-stat-label">Last Task</div>
        <div class="card-stat-value">Customer inquiry processing</div>
      </div>
      <div>
        <div class="card-stat-label">Uptime</div>
        <div class="card-stat-value">1d 4h</div>
      </div>
    </div>
    <div class="activity-log">
      <div class="log-line">[14:32] Processed 3 customer inquiries</div>
      <div class="log-line">[14:15] Updated compliance calendar</div>
      <div class="log-line">[13:48] Generated weekly summary</div>
    </div>
    <div class="card-actions">
      <!-- TODO: Replace href with mila-agent worker URL -->
      <a href="#" class="view-details-btn">View Details</a>
      <button class="ping-btn">Ping</button>
    </div>
  </div>

  <!-- Agent 2: Agent-177 -->
  <div class="agent-card status-standby">
    <div class="card-header">
      <div class="agent-name">Agent-177</div>
      <div class="status-badge badge-standby">Standby</div>
    </div>
    <div class="agent-role">Operations Monitor</div>
    <div class="card-stats">
      <div>
        <div class="card-stat-label">Location</div>
        <div class="card-stat-value">Cloudflare Workers</div>
      </div>
      <div>
        <div class="card-stat-label">Skill Level</div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill amber" style="width: 67%;"></div>
          <div class="skill-bar-text">67%</div>
        </div>
      </div>
      <div>
        <div class="card-stat-label">Last Task</div>
        <div class="card-stat-value">Fleet schedule monitoring</div>
      </div>
      <div>
        <div class="card-stat-label">Uptime</div>
        <div class="card-stat-value">12h</div>
      </div>
    </div>
    <div class="activity-log">
      <div class="log-line">[14:20] Standby - awaiting assignment</div>
      <div class="log-line">[12:00] Completed daily systems check</div>
      <div class="log-line">[09:15] Health scan passed</div>
    </div>
    <div class="card-actions">
      <button class="ping-btn">Ping</button>
    </div>
  </div>

  <!-- Agent 3: OpenClaw Bot -->
  <div class="agent-card status-active">
    <div class="card-header">
      <div class="agent-name">OpenClaw Bot</div>
      <div class="status-badge badge-active">Active</div>
    </div>
    <div class="agent-role">Zapier MCP Integration</div>
    <div class="card-stats">
      <div>
        <div class="card-stat-label">Location</div>
        <div class="card-stat-value">Zapier Cloud</div>
      </div>
      <div>
        <div class="card-stat-label">Skill Level</div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill green" style="width: 78%;"></div>
          <div class="skill-bar-text">78%</div>
        </div>
      </div>
      <div>
        <div class="card-stat-label">Last Task</div>
        <div class="card-stat-value">CRM contact sync</div>
      </div>
      <div>
        <div class="card-stat-label">Uptime</div>
        <div class="card-stat-value">6d 8h</div>
      </div>
    </div>
    <div class="activity-log">
      <div class="log-line">[14:28] Triggered 2 Zap workflows</div>
      <div class="log-line">[14:00] CRM sync complete</div>
      <div class="log-line">[13:30] Email automation dispatched</div>
    </div>
    <div class="card-actions">
      <button class="ping-btn">Ping</button>
    </div>
  </div>

  <!-- Agent 4: Stockton Worker -->
  <div class="agent-card status-online">
    <div class="card-header">
      <div class="agent-name">Stockton Worker</div>
      <div class="status-badge badge-online">Online</div>
    </div>
    <div class="agent-role">Marketing Site - Clean Truck Check</div>
    <div class="card-stats">
      <div>
        <div class="card-stat-label">Location</div>
        <div class="card-stat-value">Cloudflare Edge Network</div>
      </div>
      <div>
        <div class="card-stat-label">Skill Level</div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill cyan" style="width: 100%;"></div>
          <div class="skill-bar-text">100%</div>
        </div>
      </div>
      <div>
        <div class="card-stat-label">Last Task</div>
        <div class="card-stat-value">Serving customer requests</div>
      </div>
      <div>
        <div class="card-stat-label">Uptime</div>
        <div class="card-stat-value">15d 3h</div>
      </div>
    </div>
    <div class="activity-log">
      <div class="log-line">[continuous] Serving requests at edge</div>
      <div class="log-line">[14:00] 127 page views today</div>
      <div class="log-line">[12:00] SSL certificate valid</div>
    </div>
    <div class="card-actions">
      <button class="ping-btn">Ping</button>
    </div>
  </div>

  <!-- Agent 5: Fleet Dispatch AI -->
  <div class="agent-card status-offline">
    <div class="card-header">
      <div class="agent-name">Fleet Dispatch AI</div>
      <div class="status-badge badge-offline">Offline</div>
    </div>
    <div class="agent-role">Route Optimization &amp; Scheduling</div>
    <div class="card-stats">
      <div>
        <div class="card-stat-label">Location</div>
        <div class="card-stat-value">Planned - Not Deployed</div>
      </div>
      <div>
        <div class="card-stat-label">Skill Level</div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill red" style="width: 0%;"></div>
          <div class="skill-bar-text">0%</div>
        </div>
      </div>
      <div>
        <div class="card-stat-label">Last Task</div>
        <div class="card-stat-value">N/A - Awaiting deployment</div>
      </div>
      <div>
        <div class="card-stat-label">Uptime</div>
        <div class="card-stat-value">--</div>
      </div>
    </div>
    <div class="activity-log">
      <div class="log-line">[--:--] Agent not yet deployed</div>
      <div class="log-line">[--:--] Scheduled for Q2 2026</div>
      <div class="log-line">[--:--] Pending resource allocation</div>
    </div>
    <div class="card-actions">
      <button class="ping-btn">Ping</button>
    </div>
  </div>

</div>

<!-- ===== SLACK BANNER ===== -->
<div class="slack-banner">
  <div class="slack-banner-inner">
    <div>
      <span class="slack-icon">&#x1F4AC;</span>
      <span>Connected to <span class="slack-channel">#openclaw-agents</span></span>
    </div>
    <div class="slack-subtitle">All agent updates are posted to Slack</div>
  </div>
</div>

<!-- ===== FOOTER ===== -->
<footer class="footer">
  <p>NorCal CARB Mobile LLC - OpenClaw Operations Center</p>
  <p>Powered by Cloudflare Workers + OpenClaw Framework</p>
  <p>&copy; 2026</p>
</footer>

<script>
  // Live clock - updates every second, Pacific Time
  function updateClock() {
    var now = new Date();
    var options = { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    var dateOptions = { timeZone: 'America/Los_Angeles', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('clock-time').textContent = now.toLocaleTimeString('en-US', options) + ' PST';
    document.getElementById('clock-date').textContent = now.toLocaleDateString('en-US', dateOptions);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Last sync counter - increments every 60 seconds
  var syncMinutes = 2;
  setInterval(function() {
    syncMinutes++;
    document.getElementById('last-sync').textContent = syncMinutes + 'm ago';
  }, 60000);

  // Ping button - adds ripple animation class
  document.querySelectorAll('.ping-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = this.closest('.agent-card');
      card.classList.add('ping-active');
      setTimeout(function() { card.classList.remove('ping-active'); }, 1000);
    });
  });
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
