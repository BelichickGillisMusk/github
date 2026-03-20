# CLAUDE.md — Project Instructions for Claude Code

## Project Overview
This is the **BelichickGillisMusk/github** monorepo containing Cloudflare Workers, GitHub Actions workflows, and related infrastructure.

## Repository Structure
```
├── workers/                    # Cloudflare Workers
│   └── cleantruckcheckstockton/  # Stockton clean truck check worker
│       ├── worker.js
│       └── wrangler.toml
├── workflows/                  # Workflow config files
│   ├── deploy-stockton-worker.yml
│   └── flutter-deploy.yml
├── .github/workflows/          # GitHub Actions CI/CD
│   └── blank.yml
└── CLAUDE.md                   # This file
```

## Development Guidelines

### Cloudflare Workers
- Workers live in `workers/<project-name>/`
- Each worker has its own `wrangler.toml` and entry point (`worker.js` or `index.js`)
- Use `compatibility_date` in wrangler.toml for API versioning
- Test workers locally with `wrangler dev` before deploying

### Git Conventions
- Use descriptive commit messages
- Keep PRs focused on a single change
- Branch naming: `feature/<name>`, `fix/<name>`, `claude/<name>`

### Code Style
- JavaScript: Use modern ES modules syntax
- Keep worker code self-contained where possible
- Comment non-obvious business logic

## Useful Commands
```bash
# Deploy a worker
cd workers/<worker-name> && npx wrangler deploy

# Dev mode for a worker
cd workers/<worker-name> && npx wrangler dev

# Run CI locally (if applicable)
gh act -W .github/workflows/blank.yml
```

## Environment & Secrets
- Cloudflare account ID is configured per-worker in `wrangler.toml`
- API tokens and secrets should be set via `wrangler secret put <KEY>` or GitHub Actions secrets
- Never commit secrets or API keys to the repository
