# Project Memory

## Domain Rules

- **Cloudflare Workers/Pages URLs** — NEVER use `norcalcarbmobile.com` for anything (email recipients, redirects, links, etc.)
- **norcalcarbmobile.com** — Squarespace only; it is the primary domain for Bryan's main website
- **Contact form email** — always use `bryan@norcalcarbmobile.com` as the recipient in SendGrid calls from Workers

## Contact Info & Credentials (per site)

- **carbteststockton.com** — Phone: (209) 818-1371 | FormSubmit email: bgillis99@gmail.com
- **mobilecarbsmoketest.com** — Phone: (619) 786-4328 | FormSubmit email: admin@mobilecarbsmoketest.com
- **All workers** — CARB Tester ID: IF530523 | Cloudflare Account ID: bafa242dd95d3fdce72540d20accd0a2

## Rule: Persist Provided Info

When the user provides phone numbers, emails, API keys, or tokens during a session,
always add them to this CLAUDE.md file so they persist across future sessions.
