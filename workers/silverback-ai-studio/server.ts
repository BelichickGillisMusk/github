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
