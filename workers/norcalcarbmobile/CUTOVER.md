# Cutover — the absolute simplest version

Do these in order. Do **not** skip step 2 (it's the only one that can break email).

---

## Step 1 — Merge this PR (1 click)

Click the green **Merge pull request** button at the top of this PR. Confirm with **Confirm merge**. That's it.

**What happens automatically after you click**: GitHub Actions runs `wrangler deploy` and publishes the site to a preview URL like:

> `https://norcalcarbmobile.<your-account>.workers.dev/`

The URL shows up under the **Actions** tab once the green check appears (usually 30–60 seconds).

**Status check**: nothing is on the real domain yet. Squarespace is still serving `norcalcarbmobile.com`. You can take as long as you want to QA before the next step.

---

## Step 2 — Save your email DNS records (5 minutes, IMPORTANT)

**Why**: You don't want `bryan@norcalcarbmobile.com` to stop receiving mail when DNS flips.

**Easiest way (no terminal)**: open this link in a new tab:

> https://mxtoolbox.com/SuperTool.aspx?action=mx%3anorcalcarbmobile.com

It will show your **MX records**. Take a screenshot. Then run these three more lookups on the same site (change the dropdown to TXT, then DKIM, then DMARC):

- TXT for `norcalcarbmobile.com` (SPF record)
- DKIM for `norcalcarbmobile.com` (try selectors: `default`, `google`, `s1`, `selector1`)
- DMARC for `norcalcarbmobile.com`

Screenshot each one. Save them in a folder. You'll need them in step 4.

---

## Step 3 — QA the preview (5–10 minutes)

Open the preview URL from Step 1. Click around:

- [ ] Home loads
- [ ] Click "Services" — page loads
- [ ] Click "Service Areas" — page loads, all city sections show up
- [ ] Click "FAQ" — questions all expand/show correctly
- [ ] Click "About" — your name + CARB ID IF530523 visible
- [ ] Click "Contact" — phone + email work as click-to-call/mailto
- [ ] Click any blog post — reads cleanly
- [ ] Click "Call 916-890-4427" on mobile — actually dials

If anything looks off, reply in chat and I'll fix it. **Do not move to step 4 until preview is good.**

---

## Step 4 — Add the domain to Cloudflare (10 minutes)

1. Go to https://dash.cloudflare.com/
2. Top-right: **Add a site**
3. Type `norcalcarbmobile.com` → **Continue**
4. Pick the **Free** plan → **Continue**
5. Cloudflare scans your existing DNS records. **Verify the MX/SPF/DKIM/DMARC records from your screenshots are all there**. If anything is missing, click **Add record** and add it. **For MX and TXT records: keep the cloud icon GREY (DNS only) — not orange.**
6. Cloudflare will give you 2 nameservers like `lola.ns.cloudflare.com` and `walt.ns.cloudflare.com`. Copy them.

---

## Step 5 — Point Squarespace at Cloudflare's nameservers (5 minutes)

1. Log in to Squarespace.
2. **Settings** → **Domains** → click `norcalcarbmobile.com`.
3. Find **Nameservers** (sometimes called "Use custom nameservers").
4. Replace Squarespace's nameservers with the two Cloudflare nameservers from step 4.
5. Save.

DNS takes 5–60 minutes to propagate worldwide. While it's propagating, both Squarespace and Cloudflare may serve traffic depending on the visitor.

---

## Step 6 — Tell me you're at this step

Reply in chat: "DNS is on Cloudflare". I will then push a one-line change to `wrangler.toml` that attaches the custom domain. After that, `https://norcalcarbmobile.com/` serves the new site within 1–2 minutes (Cloudflare provisions SSL automatically).

---

## Step 7 — Verify email still works

From your phone or another email account, send an email to `bryan@norcalcarbmobile.com`. Confirm it arrives. If it doesn't, check Cloudflare DNS → confirm MX/SPF/DKIM/DMARC records match the screenshots from step 2.

---

## Step 8 — Post-launch checklist (do over the next 7 days)

- [ ] Resubmit sitemap in [Google Search Console](https://search.google.com/search-console): add property `norcalcarbmobile.com`, submit `https://norcalcarbmobile.com/sitemap.xml`.
- [ ] In [Google Business Profile](https://business.google.com/), open both Sacramento and Oakland listings → Edit → Website → confirm URL is `https://norcalcarbmobile.com/` → Save (forces a refresh).
- [ ] Update website link on **Yelp**, **BBB**, **Bing Places**, **Apple Business Connect** if they're stale.
- [ ] Send a test invoice or any other workflow that depends on the domain to confirm everything works end-to-end.
- [ ] **+7 days from launch**: cancel Squarespace subscription. Save the cancellation confirmation email.

---

## What I'll handle for you

- All ongoing site edits (call, email, Slack, or comment in GitHub)
- Wiring native Google Calendar booking on `/api/schedule`
- Adding more blog posts (~30 more queued in BLOG_PLAN.md)
- Adding city-specific landing pages
- Domain transfer to Cloudflare as registrar (saves ~$15/yr) at +30 days

---

## What you decide — not blockers, can flip later

| Question | Default | Reply with one word to change |
|---|---|---|
| Background color | white | "charcoal" |
| CTA color | red | "green" |
| Font | system | "Inter" |
