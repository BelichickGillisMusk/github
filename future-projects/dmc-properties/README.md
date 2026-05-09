# DMC Properties — deferred (not deploying)

**Status**: parked. Removed from `workers/` to stop Cloudflare's Git integration from auto-building it (was failing every commit, costing build minutes).

## What it was

A single self-contained HTML page — "Dave Cowan Properties — West Region | Rent Roll" — a polished property-management rent-roll dashboard.

Details:
- **Title**: Dave Cowan Properties — West Region | Rent Roll
- **Branding**: Irish flag motif (green / white / orange), Playfair Display + IBM Plex Sans + IBM Plex Mono fonts
- **Format**: single-file HTML with all CSS embedded (90,833 bytes)
- **Original path**: `workers/dmc-properties/rent-roll.html`
- **Last commit before removal**: SHA `e421384d6a8abbba5f6df8cf2e58213e1ba530ed`

## Why it was failing

The directory had **no `wrangler.toml`**. Cloudflare's Git integration, configured to build everything under `workers/`, kept trying and failing because there was nothing to deploy as a Worker.

## To revive later

1. **Get the file back**:
   ```bash
   git show e421384d6a8abbba5f6df8cf2e58213e1ba530ed > rent-roll.html
   ```
   Or browse: https://github.com/BelichickGillisMusk/github/blob/4973ca98bc7c0efd200516771b167f2f800bed8a/workers/dmc-properties/rent-roll.html

2. **Decide what kind of project it should be**:
   - **Static page** (recommended): use Cloudflare Workers Static Assets pattern same as `norcalcarbmobile`. Drop the file in `workers/dmc-properties/public/index.html`, add a `wrangler.toml`, add a `worker.js` pass-through, add a deploy workflow under `.github/workflows/`. ≈1 hour of setup.
   - **Internal-only / not-public**: keep it out of `workers/` entirely. Move to `future-projects/dmc-properties/` (this folder), open it as a local file, or host on a private Cloudflare Pages project not connected to this repo.

3. **Disconnect the Cloudflare Git integration** for the abandoned `dmc-properties` worker (one-click in dashboard) so the build queue stops retrying it on every commit.

## TODO when reviving

- [ ] Decide if this is public or internal-only (changes hosting choice)
- [ ] If public: pick a domain or subdomain (e.g. `rentroll.davecowanproperties.com`)
- [ ] Add `wrangler.toml` for Workers Static Assets
- [ ] Add deploy workflow under `.github/workflows/deploy-dmc-properties.yml`
- [ ] Decide if the rent-roll data is hard-coded (current design) or pulled from a database
- [ ] If multi-tenant, add auth (Cloudflare Access or similar)
