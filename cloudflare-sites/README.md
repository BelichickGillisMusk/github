# Cloudflare Sites

All Cloudflare-managed domains and sites. These are separate from norcalcarbmobile.com (Squarespace, has its own branch).

## Sites

| Site | Domain | Type | Status |
|---|---|---|---|
| CARB Clean Truck Check | carbcleantruckcheck.app | Workers/Pages | Active — primary app |
| SilverbackAI Agency | silverbackai.agency | Pages | Building |
| DMC Properties | — | Pages | Active |
| Chigbu Laws | chigbulaws.com | Pages | Active |

## How We Manage These
- All DNS through Cloudflare
- Sites deployed via Cloudflare Pages or Workers
- Workers in `/workers/` at repo root (existing structure)
- Site configs and assets in this `cloudflare-sites/` directory
- Each site gets its own subfolder

## Deploying
```bash
# Deploy a worker
cd workers/<name> && npx wrangler deploy

# Deploy a Pages site (if using direct upload)
npx wrangler pages deploy ./dist --project-name=<project>
```

## Adding a New Site
1. Create folder: `cloudflare-sites/<domain>/`
2. Add `wrangler.toml` or Pages config
3. Update this README
4. Update `Claude-Gillis-Musk/projects/README.md`
