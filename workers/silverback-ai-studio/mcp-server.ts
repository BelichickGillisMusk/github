/**
 * MCP Server — Vercel Domain Management + Cloudflare DNS
 *
 * Run with:  npm run mcp-server
 * Or add to Claude Code's MCP settings:
 *   { "command": "npx", "args": ["tsx", "mcp-server.ts"], "cwd": "<path-to-this-dir>" }
 *
 * Required env vars:
 *   VERCEL_TOKEN           — Vercel API token
 *   CLOUDFLARE_TOKEN       — Cloudflare API token
 *   CLOUDFLARE_ACCOUNT_ID  — Cloudflare account ID (needed for zone listing)
 */

import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// ─── helpers ────────────────────────────────────────────────────────────────

const log = (msg: string) => process.stderr.write(`[mcp-domain] ${msg}\n`);

function vercelHeaders(): Record<string, string> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error('VERCEL_TOKEN env var is not set');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function cfHeaders(): Record<string, string> {
  const token = process.env.CLOUDFLARE_TOKEN;
  if (!token) throw new Error('CLOUDFLARE_TOKEN env var is not set');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function vercelFetch(path: string, init?: RequestInit) {
  const url = `https://api.vercel.com${path}`;
  log(`vercel → ${init?.method ?? 'GET'} ${url}`);
  const res = await fetch(url, { ...init, headers: { ...vercelHeaders(), ...(init?.headers as Record<string, string> ?? {}) } });
  const body = await res.json();
  if (!res.ok) throw new Error(`Vercel API error ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

async function cfFetch(path: string, init?: RequestInit) {
  const url = `https://api.cloudflare.com/client/v4${path}`;
  log(`cloudflare → ${init?.method ?? 'GET'} ${url}`);
  const res = await fetch(url, { ...init, headers: { ...cfHeaders(), ...(init?.headers as Record<string, string> ?? {}) } });
  const body = await res.json() as { success: boolean; errors: unknown[]; result: unknown };
  if (!res.ok || !body.success) throw new Error(`Cloudflare API error ${res.status}: ${JSON.stringify(body.errors)}`);
  return body.result;
}

// ─── server ──────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'domain-manager',
  version: '1.0.0',
});

// ═══════════════════════════════════════════════════════════════════════════════
// VERCEL TOOLS
// ═══════════════════════════════════════════════════════════════════════════════

server.tool(
  'vercel_list_domains',
  'List all custom domains attached to a Vercel project',
  { project_id: z.string().describe('Vercel project ID or name') },
  async ({ project_id }) => {
    const data = await vercelFetch(`/v9/projects/${encodeURIComponent(project_id)}/domains`);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'vercel_add_domain',
  'Add a custom domain to a Vercel project',
  {
    project_id: z.string().describe('Vercel project ID or name'),
    domain: z.string().describe('Domain name to add, e.g. example.com'),
  },
  async ({ project_id, domain }) => {
    const data = await vercelFetch(`/v10/projects/${encodeURIComponent(project_id)}/domains`, {
      method: 'POST',
      body: JSON.stringify({ name: domain }),
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'vercel_remove_domain',
  'Remove a custom domain from a Vercel project',
  {
    project_id: z.string().describe('Vercel project ID or name'),
    domain: z.string().describe('Domain name to remove'),
  },
  async ({ project_id, domain }) => {
    const data = await vercelFetch(
      `/v9/projects/${encodeURIComponent(project_id)}/domains/${encodeURIComponent(domain)}`,
      { method: 'DELETE' }
    );
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'vercel_verify_domain',
  'Trigger domain verification for a domain on a Vercel project',
  {
    project_id: z.string().describe('Vercel project ID or name'),
    domain: z.string().describe('Domain name to verify'),
  },
  async ({ project_id, domain }) => {
    const data = await vercelFetch(
      `/v9/projects/${encodeURIComponent(project_id)}/domains/${encodeURIComponent(domain)}/verify`,
      { method: 'POST' }
    );
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUDFLARE TOOLS
// ═══════════════════════════════════════════════════════════════════════════════

server.tool(
  'cloudflare_list_zones',
  'List all Cloudflare zones (domains) in the account',
  {},
  async () => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const qs = accountId ? `?account.id=${encodeURIComponent(accountId)}&per_page=50` : '?per_page=50';
    const data = await cfFetch(`/zones${qs}`);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'cloudflare_list_dns_records',
  'List all DNS records for a Cloudflare zone',
  { zone_id: z.string().describe('Cloudflare zone ID') },
  async ({ zone_id }) => {
    const data = await cfFetch(`/zones/${zone_id}/dns_records?per_page=100`);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'cloudflare_add_dns_record',
  'Create a new DNS record in a Cloudflare zone',
  {
    zone_id: z.string().describe('Cloudflare zone ID'),
    type: z.enum(['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS', 'SRV']).describe('DNS record type'),
    name: z.string().describe('Record name (e.g. @ or subdomain)'),
    content: z.string().describe('Record content / value'),
    ttl: z.number().int().min(1).default(1).describe('TTL in seconds (1 = auto)'),
    proxied: z.boolean().default(false).describe('Enable Cloudflare proxy (orange cloud) — only valid for A, AAAA, CNAME'),
  },
  async ({ zone_id, type, name, content, ttl, proxied }) => {
    const data = await cfFetch(`/zones/${zone_id}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({ type, name, content, ttl, proxied }),
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'cloudflare_update_dns_record',
  'Update an existing DNS record in a Cloudflare zone',
  {
    zone_id: z.string().describe('Cloudflare zone ID'),
    record_id: z.string().describe('DNS record ID to update'),
    type: z.enum(['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS', 'SRV']).describe('DNS record type'),
    name: z.string().describe('Record name'),
    content: z.string().describe('Record content / value'),
    ttl: z.number().int().min(1).default(1).describe('TTL in seconds (1 = auto)'),
    proxied: z.boolean().default(false).describe('Enable Cloudflare proxy'),
  },
  async ({ zone_id, record_id, type, name, content, ttl, proxied }) => {
    const data = await cfFetch(`/zones/${zone_id}/dns_records/${record_id}`, {
      method: 'PUT',
      body: JSON.stringify({ type, name, content, ttl, proxied }),
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'cloudflare_delete_dns_record',
  'Delete a DNS record from a Cloudflare zone',
  {
    zone_id: z.string().describe('Cloudflare zone ID'),
    record_id: z.string().describe('DNS record ID to delete'),
  },
  async ({ zone_id, record_id }) => {
    const data = await cfFetch(`/zones/${zone_id}/dns_records/${record_id}`, { method: 'DELETE' });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

// ─── start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
log('MCP domain-manager server started on stdio');
