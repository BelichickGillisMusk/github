# carbcleantruckcheck.app

Primary CARB clean truck compliance application.

## Overview
- **Domain:** carbcleantruckcheck.app
- **Platform:** Cloudflare (Workers/Pages)
- **Scale:** 1,000+ jobs, VIN-based, retests every 6 months
- **Worker:** See `/workers/cleantruckcheckstockton/`

## Architecture
- Cloudflare Worker handles the main application logic
- D1 for database (if applicable)
- R2 for file/document storage (if applicable)
- KV for caching and session data

## Related
- Worker source: `/workers/cleantruckcheckstockton/worker.js`
- Worker config: `/workers/cleantruckcheckstockton/wrangler.toml`
