import "./styles.css";

const providers = [
  { id: "claude", label: "Claude", mark: "C" },
  { id: "chatgpt", label: "ChatGPT", mark: "G" },
  { id: "grok", label: "SuperGrok", mark: "X" },
  { id: "gemini", label: "Gemini", mark: "♢" },
  { id: "copilot", label: "Copilot", mark: "▶" },
];

const agents = [
  { id: "samantha", name: "Samantha", role: "Command Center / GCP Owner", avatar: "🧠", status: "online" },
  { id: "hermes", name: "Hermes", role: "Cold Sales / Outbound", avatar: "🪽", status: "online" },
  { id: "openclaw", name: "OpenClaw", role: "B2B / Solar / Rent-Ruby", avatar: "🔭", status: "active" },
  { id: "kesha", name: "Kesha", role: "CRM / SMS / Fleet", avatar: "📱", status: "online" },
  { id: "belichick", name: "Belichick", role: "Strategy / Review", avatar: "📊", status: "active" },
  { id: "datasync", name: "DataSync", role: "CARB / VIN Pipelines", avatar: "⚙️", status: "idle" },
  { id: "finbot", name: "FinBot", role: "Invoices / Reconcile", avatar: "💰", status: "idle" },
  { id: "nemoclaw", name: "NemoClaw", role: "Infra / Security", avatar: "🛡️", status: "active" },
];

const channels = [
  { id: "hq", icon: "🏛", label: "#hq", helper: "Brain Trust command" },
  { id: "invoices", icon: "💰", label: "Invoices", helper: "Billing flow" },
  { id: "tests", icon: "🔬", label: "CARB Tests", helper: "DOORS submissions" },
  { id: "gcp", icon: "☁️", label: "GCP Move", helper: "Cloud Run launch" },
  { id: "agents", icon: "🤖", label: "Agents", helper: "Provider handoff" },
];

const invoices = [
  { id: "INV0247", customer: "A+ Clean Truck Check", total: 180, status: "pending", source: "aplus", due: "Today" },
  { id: "INV0245", customer: "Danny Barbosa", total: 70, status: "pending", source: "aplus", due: "Tomorrow" },
  { id: "INV0239", customer: "Port City Fleet", total: 760, status: "paid", source: "direct", due: "Paid" },
  { id: "INV0231", customer: "Sunpath Solar", total: 1240, status: "paid", source: "solar", due: "Paid" },
  { id: "INV0226", customer: "Bay Area Logistics", total: 410, status: "paid", source: "direct", due: "Paid" },
];

const tests = [
  { id: "2113220", customer: "Unknown - needs match", vin: "YE2XC82B1G3048768", result: "fail", invoice: "orphan", action: "Customer follow-up required" },
  { id: "2113219", customer: "A+ Clean Truck Check", vin: "1FDXF46S12EC58331", result: "pass", invoice: "INV0247", action: "Ready to reconcile" },
  { id: "2113212", customer: "Port City Fleet", vin: "3AKJHHDR1MSMU7154", result: "pass", invoice: "INV0239", action: "Complete" },
  { id: "2113198", customer: "Sunpath Solar", vin: "1HTMMAAL7KH123771", result: "pass", invoice: "INV0231", action: "Complete" },
];

const initialMessages = [
  {
    id: "m1",
    channel: "hq",
    author: "Samantha",
    avatar: "🧠",
    time: "5/10/2026, 7:06 PM",
    body: "Brain Trust HQ online. Loaded 80 invoices + 60 CARB tests. Auto-joined where possible.",
  },
  {
    id: "m2",
    channel: "hq",
    author: "Belichick",
    avatar: "📊",
    time: "5/11/2026, 7:06 AM",
    body: "Strategy note: orphan tests = revenue leakage. Orphan invoices = work owed but not delivered. Both flagged in KPI bar.",
  },
  {
    id: "m3",
    channel: "invoices",
    author: "FinBot",
    avatar: "💰",
    time: "Today, 8:42 AM",
    body: "Pending payments today: 2 A+ invoices ($250 total). Both are sub-7-day, no escalation needed.",
  },
  {
    id: "m4",
    channel: "tests",
    author: "DataSync",
    avatar: "⚙️",
    time: "Today, 9:10 AM",
    body: "DOORS export ingested through 5/7. 1 FAIL flagged: Test 2113220. Customer follow-up required.",
  },
  {
    id: "m5",
    channel: "gcp",
    author: "NemoClaw",
    avatar: "🛡️",
    time: "Today, 10:18 AM",
    body: "Firebase Hosting + Cloud Run split is now the target: static cockpit on CDN, provider keys behind gumption-api.",
  },
];

const params = new URLSearchParams(window.location.search);
const requestedView = params.get("view");
const requestedProvider = params.get("provider");
const demoMode = params.get("demo");

const state = {
  view: channels.some((channel) => channel.id === requestedView) ? requestedView : "hq",
  provider: providers.some((provider) => provider.id === requestedProvider) ? requestedProvider : "claude",
  search: "",
  prompt: "Draft a handoff for Samantha to finish the GCP launch.",
  messages: loadMessages(),
  assistantReply: "Provider keys stay server-side in Cloud Run via Secret Manager.",
  toast: params.get("toast") || "",
};

if (demoMode === "launch") {
  state.messages = [
    {
      id: "demo-launch",
      channel: "gcp",
      author: "Samantha",
      avatar: "🧠",
      time: "Demo mode",
      body: "GCP launch note: deploy Firebase Hosting, verify /api/health through Cloud Run, map production domain, then retire Vercel.",
    },
    ...state.messages.filter((message) => message.id !== "demo-launch"),
  ];
}

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem("brain_trust_messages_v1") || "[]");
    return saved.length ? saved : initialMessages;
  } catch {
    return initialMessages;
  }
}

function saveMessages() {
  localStorage.setItem("brain_trust_messages_v1", JSON.stringify(state.messages));
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function setToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2400);
}

function filteredMessages() {
  const query = state.search.trim().toLowerCase();
  return state.messages.filter((message) => {
    const matchesChannel = state.view === "hq" || message.channel === state.view || state.view === "agents";
    const haystack = `${message.author} ${message.body} ${message.channel}`.toLowerCase();
    return matchesChannel && (!query || haystack.includes(query));
  });
}

function filteredRows(rows) {
  const query = state.search.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(query));
}

function kpis() {
  const paidTotal = 16206;
  const pending = invoices.filter((invoice) => invoice.status === "pending");
  const pendingTotal = pending.reduce((sum, invoice) => sum + invoice.total, 0);
  const pass = tests.filter((test) => test.result === "pass").length + 24;
  const fail = tests.filter((test) => test.result === "fail").length;
  return [
    { label: "Paid YTD", value: money(paidTotal), color: "var(--green)" },
    { label: "Pending", value: `${money(pendingTotal)} (${pending.length})`, color: "var(--yellow)" },
    { label: "A+ Net", value: money(1976), color: "var(--blue)" },
    { label: "Tests", value: `${pass}P / ${fail}F`, color: "var(--purple)" },
    { label: "Orphans", value: "6T / 77I", color: "var(--red)" },
  ];
}

function renderSidebar() {
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">BT</div>
        <div>
          <div class="eyebrow">Gumption Ops</div>
          <h1>Brain Trust</h1>
        </div>
      </div>
      <section class="agent-stack" aria-label="Agent roster">
        ${agents
          .slice(0, 6)
          .map(
            (agent) => `
              <div class="agent">
                <div class="avatar">${agent.avatar}</div>
                <div><strong>${esc(agent.name)}</strong><span>${esc(agent.role)}</span></div>
                <i class="dot" title="${esc(agent.status)}"></i>
              </div>
            `,
          )
          .join("")}
      </section>
      <nav class="nav" aria-label="Command center sections">
        ${channels
          .map(
            (channel) => `
              <button class="${state.view === channel.id ? "active" : ""}" data-view="${channel.id}">
                ${state.view === channel.id ? '<span aria-hidden="true">▸</span>' : ""}
                <span>${channel.icon}</span>
                <span><strong>${channel.label}</strong><br /><small>${channel.helper}</small></span>
              </button>
            `,
          )
          .join("")}
      </nav>
      <section class="deploy-card">
        <strong>Cloud Run readiness</strong>
        <p>Firebase Hosting, Cloud Run API rewrites, and Secret Manager-ready provider keys are wired for GCP.</p>
        <div class="progress" style="--value: 94%"><span></span></div>
      </section>
    </aside>
  `;
}

function renderTopbar() {
  return `
    <header class="topbar">
      <label class="search">
        <span>⌕</span>
        <input id="search" value="${esc(state.search)}" placeholder="Search invoices, customers, tests, VINs, plates..." />
      </label>
      <div class="provider-strip" aria-label="AI providers">
        ${providers
          .map(
            (provider) => `
              <button class="provider ${state.provider === provider.id ? "active" : ""}" data-provider="${provider.id}">
                ${provider.mark} ${provider.label}
              </button>
            `,
          )
          .join("")}
      </div>
    </header>
  `;
}

function renderHero() {
  return `
    <section class="hero">
      <div class="hero-card">
        <div>
          <div class="eyebrow">Moved from Vercel target to Google Cloud</div>
          <h2>Brain Trust command, invoices, CARB tests, and GCP launch in one cockpit.</h2>
          <p>
            Enhanced from the live Vercel app with Firebase Hosting for the static cockpit,
            a Cloud Run provider proxy, Secret Manager-ready keys, and sharper revenue-leakage triage.
          </p>
          <div class="hero-actions">
            <button class="button primary" data-action="deploy-note">Send GCP launch note</button>
            <button class="button" data-action="sync-note">Log reconciliation sync</button>
            <button class="button" data-action="export">Export open issues</button>
          </div>
        </div>
        <div class="gcp-panel">
          <span class="status-pill">● Cloud Run target ready</span>
          <div class="checklist">
            <div class="check done">✓ Firebase Hosting serves the Vite <code>dist</code> build</div>
            <div class="check done">✓ <code>/api/**</code> rewrites to Cloud Run</div>
            <div class="check done">✓ Provider keys stay in Secret Manager</div>
            <div class="check done">✓ Vertex Gemini uses project-scoped auth</div>
            <div class="check">□ Add production domain + IAM after GCP project selection</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderKpis() {
  return `<section class="kpis">${kpis()
    .map(
      (item) => `
        <article class="kpi">
          <strong style="color: ${item.color}">${item.value}</strong>
          <span>${item.label}</span>
        </article>
      `,
    )
    .join("")}</section>`;
}

function renderStream() {
  const messages = filteredMessages();
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h3>${channels.find((channel) => channel.id === state.view)?.label || "Command Stream"}</h3>
          <span>${messages.length} visible updates</span>
        </div>
        <button class="button" data-action="seed-alert">Add alert</button>
      </div>
      <div class="stream">
        ${messages
          .map(
            (message) => `
              <article class="message">
                <div class="avatar">${message.avatar}</div>
                <div>
                  <h4>${esc(message.author)} <time>${esc(message.time)}</time></h4>
                  <p>${esc(message.body)}</p>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderInvoices() {
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Invoice reconciliation</h3><span>A+ and direct revenue queue</span></div>
      </div>
      <table class="table">
        <thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Status</th><th>Due</th></tr></thead>
        <tbody>
          ${filteredRows(invoices)
            .map(
              (invoice) => `
                <tr>
                  <td>${invoice.id}</td>
                  <td>${esc(invoice.customer)}</td>
                  <td>${money(invoice.total)}</td>
                  <td><span class="badge ${invoice.status}">${invoice.status}</span></td>
                  <td>${invoice.due}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderTests() {
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>CARB test matching</h3><span>DOORS exports joined to invoice records</span></div>
      </div>
      <table class="table">
        <thead><tr><th>Test</th><th>Customer</th><th>VIN</th><th>Result</th><th>Invoice</th><th>Action</th></tr></thead>
        <tbody>
          ${filteredRows(tests)
            .map(
              (test) => `
                <tr>
                  <td>${test.id}</td>
                  <td>${esc(test.customer)}</td>
                  <td>${test.vin}</td>
                  <td><span class="badge ${test.result}">${test.result}</span></td>
                  <td>${test.invoice}</td>
                  <td>${esc(test.action)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderGcp() {
  const steps = [
    ["Build static web", "ready", "Vite emits dist/ for Firebase Hosting's CDN."],
    ["Rewrite API calls", "ready", "Firebase Hosting sends /api/** to gumption-api in us-west1."],
    ["Deploy provider proxy", "ready", "Cloud Run receives AI Assist prompts and reads secrets server-side."],
    ["Use Vertex Gemini", "ready", "Gemini traffic uses samantha-gumption project auth and GCP credits."],
    ["Attach domain", "warn", "Map the final production hostname after Firebase Hosting deploy."],
    ["Lock down IAM", "warn", "Set invoker policy based on whether the proxy stays public or private."],
  ];
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>GCP migration board</h3><span>Launch state for Samantha and NemoClaw</span></div>
      </div>
      <div class="quick-grid">
        ${steps
          .map(
            ([title, status, detail]) => `
              <article class="quick-card">
                <span class="badge ${status}">${status}</span>
                <p><strong>${title}</strong></p>
                <p>${detail}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderAgents() {
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Agent provider matrix</h3><span>Route each task to the right assistant</span></div>
      </div>
      <div class="quick-grid">
        ${agents
          .map(
            (agent) => `
              <article class="quick-card">
                <div class="avatar">${agent.avatar}</div>
                <p><strong>${esc(agent.name)}</strong></p>
                <p>${esc(agent.role)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderQuickCards() {
  return `
    <section class="panel">
      <div class="panel-head"><h3>Today’s focus</h3><span>Highest-leverage work</span></div>
      <div class="quick-grid">
        <article class="quick-card"><strong>Recover leakage</strong><p>Start with 6 orphan tests and the failed VIN follow-up.</p></article>
        <article class="quick-card"><strong>Collect A+ pending</strong><p>Close INV0247 and INV0245 before escalation is needed.</p></article>
        <article class="quick-card"><strong>Ship GCP</strong><p>Deploy Firebase Hosting, verify Cloud Run API, map domain, then retire Vercel.</p></article>
        <article class="quick-card"><strong>SEO blocker</strong><p>Resolve missing og:image on the flagged sites after launch.</p></article>
      </div>
    </section>
  `;
}

function renderPrimaryPanel() {
  if (state.view === "invoices") return renderInvoices();
  if (state.view === "tests") return renderTests();
  if (state.view === "gcp") return renderGcp();
  if (state.view === "agents") return renderAgents();
  return renderStream();
}

function renderAssistant() {
  const activeProvider = providers.find((provider) => provider.id === state.provider);
  return `
    <aside class="panel assistant">
      <div class="panel-head">
        <div><h3>AI Assist</h3><span>Send to ${activeProvider.mark} ${activeProvider.label}</span></div>
      </div>
      <div class="assistant-body">
        <textarea id="prompt">${esc(state.prompt)}</textarea>
        <div class="assistant-actions">
          <button class="button primary" data-action="send-prompt">Send</button>
          <button class="button" data-action="copy-prompt">Copy</button>
        </div>
        <div class="assistant-output">
          ${esc(state.assistantReply)}
        </div>
      </div>
    </aside>
  `;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="shell">
      ${renderSidebar()}
      <main class="main">
        ${renderTopbar()}
        ${renderHero()}
        <div class="content">
          <div>
            ${renderKpis()}
            ${renderPrimaryPanel()}
            <div style="height: 18px"></div>
            ${renderQuickCards()}
          </div>
          ${renderAssistant()}
        </div>
      </main>
      ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
    </div>
  `;
  bindEvents();
}

function addMessage(channel, author, avatar, body) {
  state.messages = [
    {
      id: `m${Date.now()}`,
      channel,
      author,
      avatar,
      time: new Date().toLocaleString(),
      body,
    },
    ...state.messages,
  ];
  saveMessages();
}

function exportOpenIssues() {
  const rows = [
    ["type", "id", "owner", "status", "next_step"],
    ...invoices
      .filter((invoice) => invoice.status === "pending")
      .map((invoice) => ["invoice", invoice.id, invoice.customer, invoice.status, `Collect ${money(invoice.total)}`]),
    ...tests
      .filter((test) => test.result === "fail" || test.invoice === "orphan")
      .map((test) => ["test", test.id, test.customer, test.result, test.action]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "brain-trust-open-issues.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function sendPromptToProxy(provider) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      provider: provider.id,
      prompt: state.prompt || "Review current command center state.",
      context: {
        view: state.view,
        pendingInvoices: invoices.filter((invoice) => invoice.status === "pending").length,
        orphanTests: tests.filter((test) => test.invoice === "orphan").length,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Proxy returned ${response.status}`);
  }

  return payload;
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  document.querySelectorAll("[data-provider]").forEach((button) => {
    button.addEventListener("click", () => {
      state.provider = button.dataset.provider;
      render();
    });
  });

  const search = document.getElementById("search");
  search?.addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
    document.getElementById("search")?.focus();
  });

  const prompt = document.getElementById("prompt");
  prompt?.addEventListener("input", (event) => {
    state.prompt = event.target.value;
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.action;
      if (action === "deploy-note") {
        addMessage("gcp", "Samantha", "🧠", "GCP launch note: deploy Firebase Hosting, verify /api/health through Cloud Run, map production domain, then retire Vercel.");
        setToast("GCP launch note posted to #gcp");
      }
      if (action === "sync-note") {
        addMessage("invoices", "FinBot", "💰", "Reconciliation sync queued: 2 pending A+ invoices and 1 failed CARB test need owner review.");
        setToast("Reconciliation sync logged");
      }
      if (action === "seed-alert") {
        addMessage(state.view === "hq" ? "alerts" : state.view, "NemoClaw", "🛡️", "Alert generated: verify Cloud Run revision and invoice/test orphan queue before launch.");
        setToast("Alert added");
      }
      if (action === "export") {
        exportOpenIssues();
        setToast("Open issues CSV exported");
      }
      if (action === "copy-prompt") {
        await navigator.clipboard.writeText(state.prompt);
        setToast("Prompt copied");
      }
      if (action === "send-prompt") {
        const provider = providers.find((item) => item.id === state.provider);
        setToast(`Sending to ${provider.label} via Cloud Run proxy...`);
        try {
          const result = await sendPromptToProxy(provider);
          const reply = result.reply || result.message || "Provider proxy accepted the request.";
          state.assistantReply = reply;
          addMessage("hq", provider.label, provider.mark, reply);
          setToast(`Prompt sent to ${provider.label}`);
        } catch (error) {
          state.assistantReply = `Proxy unavailable: ${error.message}`;
          addMessage("hq", "Samantha", "🧠", `Proxy unavailable for ${provider.label}: ${error.message}`);
          setToast("Cloud Run proxy needs deployment or secrets");
        }
      }
    });
  });
}

render();
