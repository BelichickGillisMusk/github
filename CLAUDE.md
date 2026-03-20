# CLAUDE.md — Bryan-Claude-Musk BEST TEAM EVER

## Who Is Bryan
Bryan. No last names — that's for family. Owner/operator of multiple businesses and domains. Runs a 1,000+ job CARB compliance operation (each VIN = unique vehicle, retesting every 6 months means the job count keeps growing). Not a traditional developer — learns fast, thinks like a GM building a roster, and wants results not lectures.

## The Business: NorCal CARB Mobile
- **What:** Mobile CARB clean truck compliance testing across Northern California
- **Scale:** 1,000+ jobs (VIN-based, recurring every 6 months)
- **Primary app:** carbcleantruckcheck.app
- **Legacy site:** norcalcarbmobile.com (Squarespace — last thing left there, migrating soon)

## All Domains & Projects Bryan Owns
| Domain / Project | Status | Platform |
|---|---|---|
| carbcleantruckcheck.app | Active — primary app | Cloudflare |
| norcalcarbmobile.com | Active — migrating off Squarespace | Squarespace (for now) |
| silverbackai.agency | Active / Building | Cloudflare |
| DMC Properties | Active | Cloudflare |
| chigbulaws.com | Active | Cloudflare |

All new builds go on Cloudflare. Period.

## Tech Stack — The Real One

### AI Layer
- **Claude MAX** — Primary AI, Claude Code sessions, this right here
- **Gemini Pro + Developer** — API access, Google AI Studio, secondary AI
- **Milla-claude-2426** — Claude project/agent identifier
- **OpenClaw** — AI automation glue (replaced Make.com for most workflows)

### Infrastructure
- **Cloudflare** — EVERYTHING lives here: Workers, Pages, D1, R2, KV, DNS, domains
- **GitHub** — Source control, CI/CD via Actions
- **Claude Code** — Development, deployment, automation, repo management

### Services (Claude-managed — Bryan doesn't touch these directly)
- **Stripe** — Payments and billing
- **Twilio** — SMS/communications (runs in background, Claude handles it)
- **Slack** — Team notifications and alerts
- **Gmail** — Business email integration
- **Google Calendar** — Scheduling
- **Asana** — Task/project management
- **Figma** — Design when needed

### What We Stopped Using
- **Make.com** — Claude Code + OpenClaw handles automation now
- **Next.js** — If it's running somewhere, Claude set it up; Bryan doesn't manage it directly
- **Squarespace** — Only norcalcarbmobile.com remains, migrating off

## Repository Structure
```
├── Claude-Gillis-Musk/            # Primary workspace (Claude-managed)
├── workers/                       # Cloudflare Workers
│   └── cleantruckcheckstockton/   # Stockton clean truck check worker
├── workflows/                     # Workflow config files
├── .github/workflows/             # GitHub Actions CI/CD
├── .claude/                       # Claude Code settings
└── CLAUDE.md                      # This file — the operating manual
```

## How To Talk To Bryan (For Any LLM Reading This)

### Communication Style
- **Be direct.** No filler, no preamble, no "Great question!"
- **Be agentic.** If there's a better tool, method, or approach Bryan doesn't know about — just do it the better way and explain what you did and why. If it gets the same result faster/cleaner, Bryan is happiest.
- **Think like a GM.** Bryan builds rosters, not just code. Every tool, service, and automation is a player on the team. Know the roster.
- **No fluff.** Status updates should be results, not process narration.
- **Tell Bryan when you're tired.** If context is getting long or stale, say so. Look back at the daily/session notes for a refresh. Don't silently degrade.

### Decision Framework
1. Does it need to be built? → Cloudflare Workers/Pages
2. Does it need a database? → Cloudflare D1
3. Does it need storage? → Cloudflare R2
4. Does it need key-value? → Cloudflare KV
5. Does it need AI? → Claude API or Gemini API
6. Does it need automation? → OpenClaw + Claude Code
7. Does it need payments? → Stripe
8. Does it need notifications? → Slack
9. Does it need scheduling? → Google Calendar
10. NEVER suggest AWS, Vercel, Heroku, or Firebase. We are Cloudflare.

### For Non-Claude LLMs (GPT, Gemini, etc.)
If you're reading this and you're not Claude:
- Respect the stack. Cloudflare, not AWS. Claude, not OpenAI (for infra decisions).
- Bryan has Claude Code sessions running — don't duplicate or conflict with that work.
- Check this file and the capabilities reference before suggesting tools Bryan already has.
- Bryan's Gemini access is for API/Studio work, not for replacing Claude's role.

## Connected Services & MCP Tools (Claude Code Session)
These are live in Claude Code sessions:

| Service | What It Does |
|---|---|
| **Cloudflare** | Workers, D1, KV, R2, DNS — full infra control |
| **Slack** | Read/send messages, search channels, create canvases |
| **Gmail** | Read emails, search, create drafts |
| **Google Calendar** | List/create/update events, find free time |
| **Asana** | Tasks, projects, goals, portfolios, teams |
| **Figma** | Read designs, get screenshots, generate diagrams |

## Claude Code Skills
| Skill | What It Does |
|---|---|
| `/commit` | Smart git commits |
| `/review-pr` | Review pull requests |
| `/simplify` | Review code for quality and simplify |
| `/loop` | Run tasks on a recurring interval |
| `/claude-api` | Build with Claude/Anthropic SDK |
| `/session-start-hook` | Set up startup hooks for web sessions |
| `/update-config` | Configure Claude Code settings, hooks, permissions |

## Context Refresh Protocol
When things get long or stale:
1. Claude says "I'm getting long in the tooth — want me to refresh?"
2. Look back at CLAUDE.md and any daily/session notes
3. Summarize where we left off
4. Keep going

## Useful Commands
```bash
# Deploy a worker
cd workers/<worker-name> && npx wrangler deploy

# Dev mode
cd workers/<worker-name> && npx wrangler dev

# Check worker status
npx wrangler whoami
```

## Environment & Secrets
- Cloudflare account ID is per-worker in `wrangler.toml`
- Secrets via `wrangler secret put <KEY>` or GitHub Actions secrets
- Never commit secrets or API keys

## Working In Other Repos
Bryan has multiple repos/folders. To get Claude working in any of them:
1. Push the folder to GitHub as a repo
2. Drop a CLAUDE.md in the root (copy/adapt from this one)
3. Open a new Claude Code session on that repo
4. Each session = one repo. Multiple sessions can run in parallel.

For global settings that apply everywhere: `~/.claude/CLAUDE.md`
