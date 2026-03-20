# Bryan's Full Capabilities & Toolkit Reference
> Use this when planning a project — run through the checklist so nothing gets missed.

## AI Assistants
| Tool | Access Level | Use For |
|---|---|---|
| Claude MAX (Claude Code) | Full — primary | Development, automation, deployment, repo management, MCP integrations |
| Claude MAX (Chat) | Full | Strategy, writing, analysis, file review |
| Gemini Pro | Full | Google AI Studio, API calls, secondary AI tasks |
| Gemini Developer | API access | Programmatic AI calls, embeddings |
| Milla-claude-2426 | Claude project | Dedicated agent/project workspace |

## Infrastructure (Cloudflare)
| Service | What It Does | When To Use |
|---|---|---|
| Workers | Serverless functions at the edge | APIs, webhooks, backend logic |
| Pages | Static site hosting + functions | Websites, dashboards, landing pages |
| D1 | SQLite database at the edge | Structured data, queries, app state |
| R2 | Object storage (S3-compatible) | Files, images, PDFs, backups |
| KV | Key-value store | Config, cache, session data, flags |
| DNS | Domain management | All domains route through Cloudflare |
| Hyperdrive | Database connection pooling | Connect to external Postgres DBs |

## Connected Services (MCP — Live in Claude Code)

### Slack
- Send/read messages to any channel
- Search public and private channels
- Read threads and user profiles
- Create and update canvases
- Schedule messages

### Gmail
- Search emails
- Read messages and threads
- Create drafts
- List labels
- Get profile info

### Google Calendar
- List all calendars
- Create/update/delete events
- Find free time slots
- Find meeting times across people
- RSVP to events

### Asana
- Create/update/delete tasks
- Manage projects, sections, goals
- Search tasks across workspaces
- Track portfolios and allocations
- Add comments (stories) to tasks
- Manage task dependencies

### Figma
- Read design files and get context
- Get screenshots of designs
- Get metadata and variables
- Generate diagrams in FigJam
- Code Connect mapping (design → code)

### Cloudflare (via MCP)
- List/manage Workers
- Read Worker code
- Create/query D1 databases
- Manage KV namespaces
- Manage R2 buckets
- Search Cloudflare docs
- Manage Hyperdrive configs

## Claude Code Skills (Slash Commands)
| Command | Purpose |
|---|---|
| `/commit` | Generate smart commit messages and commit |
| `/review-pr` | Review a pull request |
| `/simplify` | Audit changed code for quality, reuse, efficiency |
| `/loop 5m /command` | Run a command on a recurring interval (polling, monitoring) |
| `/claude-api` | Help building with Claude API / Anthropic SDK |
| `/session-start-hook` | Set up startup hooks for Claude Code web sessions |
| `/update-config` | Modify Claude Code settings, hooks, permissions |

## Automation Layer
| Tool | Role |
|---|---|
| Claude Code | Primary — builds, deploys, manages repos, runs automations |
| OpenClaw | AI workflow automation (replaced Make.com) |
| GitHub Actions | CI/CD pipelines, scheduled jobs |

## Payments & Comms
| Tool | Role |
|---|---|
| Stripe | Payments, billing, invoicing |
| Twilio | SMS/comms (Claude-managed, runs in background) |
| Slack | Team alerts, notifications, internal comms |
| Gmail | Customer/business email |

## Domains & Projects
| Domain | What | Platform |
|---|---|---|
| carbcleantruckcheck.app | Primary CARB compliance app | Cloudflare |
| norcalcarbmobile.com | Business site (migrating off Squarespace) | Squarespace → Cloudflare |
| silverbackai.agency | AI agency site | Cloudflare |
| DMC Properties | Property management | Cloudflare |
| chigbulaws.com | Law site | Cloudflare |

---

## Project Planning Checklist
When starting something new, run through this:

- [ ] **What is it?** (app, site, worker, automation, API)
- [ ] **Where does it live?** → Cloudflare (Workers/Pages)
- [ ] **Does it need a database?** → D1
- [ ] **Does it need file storage?** → R2
- [ ] **Does it need key-value/cache?** → KV
- [ ] **Does it need AI?** → Claude API or Gemini API
- [ ] **Does it need payments?** → Stripe
- [ ] **Does it need notifications?** → Slack
- [ ] **Does it need email?** → Gmail integration
- [ ] **Does it need scheduling?** → Google Calendar
- [ ] **Does it need task tracking?** → Asana
- [ ] **Does it need a design?** → Figma
- [ ] **Does it need CI/CD?** → GitHub Actions
- [ ] **Which domain?** → Pick from the roster or register new via Cloudflare
- [ ] **Who maintains it?** → Claude Code (primary), Bryan (oversight)
