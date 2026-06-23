import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALERT_SECRET = process.env.ALERT_SECRET || "";

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

  // Server-side AI analysis — keeps GEMINI_API_KEY off the client
  app.post("/api/analyze", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "gemini_key_not_configured" });
      return;
    }

    const { eventType, description, severity } = req.body;
    if (!eventType || !description) {
      res.status(400).json({ error: "missing_fields" });
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this security event clip description and provide a more detailed, professional security assessment.
        Event Type: ${eventType}
        Initial Description: ${description}
        Severity: ${severity || "unknown"}
        
        Provide a detailed breakdown of what might be happening, potential risks, and recommended actions. Keep it concise but professional.`,
      });

      const analysis = response.text || "No analysis available.";
      res.json({ analysis });
    } catch (err) {
      console.error("AI analysis failed:", err);
      res.status(500).json({ error: "analysis_failed" });
    }
  });

  // API to trigger high-severity alerts — requires shared secret
  app.post("/api/trigger-alert", (req, res) => {
    const authHeader = req.header("x-alert-secret") || "";
    if (!ALERT_SECRET || authHeader !== ALERT_SECRET) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

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
