import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 8080);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function getStaticPath(requestPath) {
  const cleanPath = decodeURIComponent(requestPath.split("?")[0]);
  const requested = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = path.normalize(path.join(publicDir, requested));

  if (!resolved.startsWith(publicDir)) {
    return null;
  }

  return resolved;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/health") {
    sendJson(res, 200, {
      status: "ok",
      app: "brain-trust-command-center",
      platform: "google-cloud-run",
      revision: process.env.K_REVISION || "local",
      service: process.env.K_SERVICE || "local",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (url.pathname === "/api/status") {
    sendJson(res, 200, {
      paidYtd: 16206,
      pendingTotal: 250,
      pendingCount: 2,
      aplusNet: 1976,
      tests: { pass: 27, fail: 1 },
      orphans: { tests: 6, invoices: 77 },
      gcp: {
        runtime: "Cloud Run",
        region: process.env.GCP_REGION || "us-central1",
        readiness: 94,
      },
    });
    return;
  }

  const staticPath = getStaticPath(url.pathname);
  if (!staticPath) {
    sendJson(res, 400, { error: "Invalid path" });
    return;
  }

  try {
    await readFile(staticPath);
    const ext = path.extname(staticPath);
    res.writeHead(200, {
      "content-type": contentTypes[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    });
    createReadStream(staticPath).pipe(res);
  } catch {
    const indexPath = path.join(publicDir, "index.html");
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-cache",
    });
    createReadStream(indexPath).pipe(res);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Brain Trust Command Center listening on http://0.0.0.0:${port}`);
});
