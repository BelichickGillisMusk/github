# norcalcarbmobile.com

NorCal CARB Mobile business site — currently on Squarespace, migrating to Cloudflare.

## Status: MIGRATING

### Current State
- **Live at:** norcalcarbmobile.com
- **Platform:** Squarespace (last Squarespace property)
- **Goal:** Migrate to Cloudflare Pages

### Migration Plan
1. [ ] Export/capture current Squarespace site content and assets
2. [ ] Build replacement on Cloudflare Pages
3. [ ] Set up DNS on Cloudflare (if not already)
4. [ ] Test new site at staging URL
5. [ ] Cut over DNS to Cloudflare Pages
6. [ ] Verify everything works
7. [ ] Cancel Squarespace subscription

### Directory Structure
```
norcalcarbmobile.com/
├── README.md          # This file
├── site/              # New Cloudflare Pages site files
└── migration/         # Migration notes, content exports, asset inventory
```

### Key Info
- This is Bryan's CARB compliance business — 1,000+ jobs, recurring VIN retests every 6 months
- Primary app is carbcleantruckcheck.app (already on Cloudflare)
- This site is the public-facing business presence
- DO NOT break anything during migration — the business runs on this
