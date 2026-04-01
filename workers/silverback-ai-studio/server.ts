import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());

  // Store connected clients
  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("Client connected to WebSocket");

    ws.on("close", () => {
      clients.delete(ws);
      console.log("Client disconnected");
    });
  });

  // Broadcast function
  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // API to trigger high-severity alerts (for testing/demo)
  app.post("/api/trigger-alert", (req, res) => {
    const { type, description, severity, location } = req.body;

    if (severity === 'high' || severity === 'critical') {
      const alert = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: type || 'weirdness_alert',
        description: description || 'High-severity event detected!',
        severity: severity || 'high',
        location: location || 'Main Entrance',
      };

      broadcast({ type: 'ALERT', payload: alert });
      return res.json({ status: "Alert broadcasted", alert });
    }

    res.status(400).json({ error: "Only high or critical severity alerts are broadcasted via WebSocket" });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", clients: clients.size });
  });

  // ── Vercel domain proxy routes ──────────────────────────────────────────────
  // Proxies to Vercel API so the React client avoids CORS issues.
  // Requires VERCEL_TOKEN in env.

  app.get("/api/vercel/projects/:projectId/domains", async (req, res) => {
    const { projectId } = req.params;
    const token = process.env.VERCEL_TOKEN;
    if (!token) return res.status(500).json({ error: "VERCEL_TOKEN not configured" });
    const upstream = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/domains`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.status(upstream.status).json(await upstream.json());
  });

  app.post("/api/vercel/projects/:projectId/domains", async (req, res) => {
    const { projectId } = req.params;
    const token = process.env.VERCEL_TOKEN;
    if (!token) return res.status(500).json({ error: "VERCEL_TOKEN not configured" });
    const upstream = await fetch(`https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/domains`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: req.body.name }),
    });
    res.status(upstream.status).json(await upstream.json());
  });

  app.delete("/api/vercel/projects/:projectId/domains/:domain", async (req, res) => {
    const { projectId, domain } = req.params;
    const token = process.env.VERCEL_TOKEN;
    if (!token) return res.status(500).json({ error: "VERCEL_TOKEN not configured" });
    const upstream = await fetch(
      `https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/domains/${encodeURIComponent(domain)}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
    );
    res.status(upstream.status).json(await upstream.json());
  });

  app.post("/api/vercel/projects/:projectId/domains/:domain/verify", async (req, res) => {
    const { projectId, domain } = req.params;
    const token = process.env.VERCEL_TOKEN;
    if (!token) return res.status(500).json({ error: "VERCEL_TOKEN not configured" });
    const upstream = await fetch(
      `https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/domains/${encodeURIComponent(domain)}/verify`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
    );
    res.status(upstream.status).json(await upstream.json());
  });

  // ── Cloudflare DNS proxy routes ─────────────────────────────────────────────
  // Proxies to Cloudflare API so the React client avoids CORS issues.
  // Requires CLOUDFLARE_TOKEN (and optionally CLOUDFLARE_ACCOUNT_ID) in env.

  app.get("/api/cloudflare/zones", async (_req, res) => {
    const token = process.env.CLOUDFLARE_TOKEN;
    if (!token) return res.status(500).json({ error: "CLOUDFLARE_TOKEN not configured" });
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const qs = accountId ? `?account.id=${encodeURIComponent(accountId)}&per_page=50` : '?per_page=50';
    const upstream = await fetch(`https://api.cloudflare.com/client/v4/zones${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.status(upstream.status).json(await upstream.json());
  });

  app.get("/api/cloudflare/zones/:zoneId/dns_records", async (req, res) => {
    const { zoneId } = req.params;
    const token = process.env.CLOUDFLARE_TOKEN;
    if (!token) return res.status(500).json({ error: "CLOUDFLARE_TOKEN not configured" });
    const upstream = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=100`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.status(upstream.status).json(await upstream.json());
  });

  app.post("/api/cloudflare/zones/:zoneId/dns_records", async (req, res) => {
    const { zoneId } = req.params;
    const token = process.env.CLOUDFLARE_TOKEN;
    if (!token) return res.status(500).json({ error: "CLOUDFLARE_TOKEN not configured" });
    const { type, name, content, ttl, proxied } = req.body;
    const upstream = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, content, ttl, proxied }),
      }
    );
    res.status(upstream.status).json(await upstream.json());
  });

  app.put("/api/cloudflare/zones/:zoneId/dns_records/:recordId", async (req, res) => {
    const { zoneId, recordId } = req.params;
    const token = process.env.CLOUDFLARE_TOKEN;
    if (!token) return res.status(500).json({ error: "CLOUDFLARE_TOKEN not configured" });
    const { type, name, content, ttl, proxied } = req.body;
    const upstream = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, content, ttl, proxied }),
      }
    );
    res.status(upstream.status).json(await upstream.json());
  });

  app.delete("/api/cloudflare/zones/:zoneId/dns_records/:recordId", async (req, res) => {
    const { zoneId, recordId } = req.params;
    const token = process.env.CLOUDFLARE_TOKEN;
    if (!token) return res.status(500).json({ error: "CLOUDFLARE_TOKEN not configured" });
    const upstream = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
    );
    res.status(upstream.status).json(await upstream.json());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
