# DNS Cutover Runbook — Squarespace → Cloudflare

**Goal:** Move chigbulaws.com from Squarespace to the new Cloudflare Worker without breaking email or causing downtime.

**Time required:** ~20 minutes of active work, then DNS propagation (usually <1 hour, max 48 hours).

**When to do this:** ONLY after the punch list shows green (real bio, real reviews, real photos, Resend set up, test email confirmed). Do not cut over while critical content is still placeholder.

---

## ⚠️ Before you start

1. **Back up Squarespace.** In Squarespace: Settings → Advanced → Import / Export → Export → Download. Save the XML file. This is your safety net if anything goes wrong.

2. **Find out where his email is hosted.** This is critical:
   - If `chigbulaw@sbcglobal.net` is on AT&T (sbcglobal.net is AT&T) → **email is unaffected** by this DNS change because email points to sbcglobal.net's MX records, not chigbulaws.com. ✅
   - If he uses an `info@chigbulaws.com` style address → **stop and find out where MX records point** before cutting over. We need to preserve those.
   - **Check now:** `dig MX chigbulaws.com` from any terminal, or use https://mxtoolbox.com/MXLookup.aspx?domain=chigbulaws.com — write down whatever MX records show up. Those need to be preserved in the new DNS zone.

3. **Confirm the worker is deployed and tested.**
   - Open https://chigbulaws.silverbackai.workers.dev/ on your phone — site should load
   - Test the contact form — Clifford should get the test email
   - Test all 5 practice area pages
   - Only then proceed.

---

## Path A: Squarespace currently manages DNS (most common)

If chigbulaws.com's nameservers point to Squarespace, follow this.

### Step 1 — Add the domain to Cloudflare (5 min)

1. cloudflare.com → Add a Site → enter `chigbulaws.com` → Free plan
2. Cloudflare scans existing DNS records (it'll find Squarespace's records — that's fine, leave them all enabled for now)
3. **VERY IMPORTANT:** Cloudflare will give you 2 nameserver addresses (e.g. `ana.ns.cloudflare.com` and `bob.ns.cloudflare.com`). Write them down.
4. Do NOT change the nameservers at the registrar yet.

### Step 2 — Verify DNS records came over correctly

In the Cloudflare DNS tab, look for:
- ✅ MX records — should match what `dig MX chigbulaws.com` showed earlier
- ✅ TXT records (SPF, DKIM, DMARC) — should all be there
- ✅ A or CNAME for `chigbulaws.com` and `www.chigbulaws.com` — these point to Squarespace right now, that's OK

If anything is missing from the original (especially MX or SPF/TXT), **manually add it** before proceeding.

### Step 3 — Add the worker route (2 min)

1. Cloudflare → Workers & Pages → `chigbulaws` worker → Settings → Triggers → Add Custom Domain
2. Add `chigbulaws.com` and `www.chigbulaws.com`
3. Cloudflare will automatically:
   - Issue an SSL certificate
   - Add a worker route `chigbulaws.com/*` and `www.chigbulaws.com/*`
   - Update the A/AAAA/CNAME records to point to the worker

### Step 4 — Cut nameservers (the big switch)

1. Find the registrar where chigbulaws.com is registered (GoDaddy, Namecheap, Google Domains, etc.)
2. If unsure: WhoIs lookup at https://whois.com/whois/chigbulaws.com — look for "Registrar"
3. Log in to the registrar
4. Find the nameserver settings for chigbulaws.com
5. Replace whatever's there with the 2 Cloudflare nameservers from Step 1
6. Save

### Step 5 — Wait and verify

- DNS propagation is usually 5-30 minutes but can take up to 48 hours
- Check at https://dnschecker.org/#NS/chigbulaws.com
- Once nameservers are switched globally, Cloudflare's records take over and the worker starts serving the site

### Step 6 — Verify the live site

1. Phone browser → chigbulaws.com → should show new site (not Squarespace)
2. Check that the lock icon shows valid SSL
3. Test the contact form on the live domain
4. Run the 🩺 Site Health Check workflow (Actions tab in GitHub) to confirm

### Step 7 — Cancel Squarespace (only after verifying)

- Wait at least 7 days after cutover to make sure everything is stable
- Then cancel the Squarespace subscription
- Keep the exported XML in `sites/archive/` as permanent backup

---

## Path B: chigbulaws.com is registered AT Squarespace (Squarespace = registrar)

This is trickier because Squarespace does both registration AND DNS, and they don't always release domains gracefully.

### Option 1 — Transfer the domain out of Squarespace
- Cleanest option but takes 5-7 days
- In Squarespace: Settings → Domains → chigbulaws.com → Advanced → "Transfer domain out"
- Get the auth code (EPP code)
- Initiate transfer at the new registrar (Cloudflare Registrar is free, $10/yr — no markup)
- Wait for transfer

### Option 2 — Keep Squarespace as registrar but use Cloudflare nameservers
- Faster — same as Path A
- In Squarespace: Settings → Domains → chigbulaws.com → DNS Settings → Use custom nameservers → paste Cloudflare's 2 nameservers
- Then proceed with Path A from Step 3

I recommend **Option 1** long-term but **Option 2** for speed.

---

## 🚨 If something goes wrong

### Symptom: chigbulaws.com shows the old Squarespace site after cutover
- DNS still propagating. Wait 30 min and try a different network or your phone's mobile data.

### Symptom: chigbulaws.com shows "Site not found" or a Cloudflare error page
- The worker route isn't set up correctly.
- Check Cloudflare → Workers → chigbulaws → Settings → Triggers → Custom Domains. Make sure `chigbulaws.com` and `www.chigbulaws.com` are both listed.

### Symptom: SSL warning in browser
- Cloudflare's cert hasn't issued yet. Wait 5-10 min and refresh.

### Symptom: Email stops working
- **STOP.** Revert nameservers to Squarespace's at the registrar.
- Wait 30 min for propagation back.
- Check the MX records you copied in "Before you start" — they likely got dropped during the migration.
- Re-add them in Cloudflare DNS, then re-cut the nameservers.

### Symptom: Forms don't submit / chatbot doesn't respond
- Worker is reachable but the API endpoints aren't.
- Run the 📧 Send Test Intake Email workflow — if it fails, check `wrangler tail chigbulaws` for errors.

---

## ✅ Cutover checklist

```
☐ Squarespace XML backed up
☐ MX records noted from current DNS
☐ Worker tested at chigbulaws.silverbackai.workers.dev
☐ Test email received via Resend/MailChannels
☐ Domain added to Cloudflare
☐ All MX/TXT records present in Cloudflare DNS
☐ Worker custom domain route added (chigbulaws.com + www)
☐ Nameservers switched at registrar
☐ DNS propagation confirmed at dnschecker.org
☐ chigbulaws.com loads new site in browser
☐ SSL valid
☐ Contact form tested on live domain
☐ Email still working (test inbound to chigbulaw@sbcglobal.net)
☐ 7 days passed without issues
☐ Squarespace subscription cancelled
```

---

*Print this. Keep it open in another tab during cutover. Don't improvise.*
