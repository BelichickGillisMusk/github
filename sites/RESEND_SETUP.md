# Resend Email Setup — One-Time, ~10 minutes

**Goal:** Wire up the email fallback so every form submission, intake, and chat message gets emailed to `chigbulaw@sbcglobal.net` even if the webhook is down.

**Why Resend:** Free 100 emails/day (more than enough), works with one API key, no DNS surgery, deliverability is excellent.

---

## Before you start

You need:
- A computer for ~10 minutes (some of this is hard to do on phone)
- Cloudflare login
- Access to chigbulaws.com's DNS (this will be Cloudflare after cutover, or Squarespace before)

---

## Step 1 — Sign up for Resend (3 min)

1. Go to https://resend.com
2. Sign up with any email (your business email is fine, doesn't need to be Clifford's)
3. Free plan — no credit card required
4. Verify your email
5. You're in.

---

## Step 2 — Add chigbulaws.com as a sending domain (5 min)

1. Resend dashboard → Domains → Add Domain
2. Enter `chigbulaws.com`
3. Resend gives you 3 DNS records to add (1 SPF, 2 DKIM)
4. Open **Cloudflare DNS** for chigbulaws.com (or Squarespace DNS if pre-cutover)
5. Add the 3 records exactly as Resend shows them:
   - **SPF** (TXT record on the root domain)
   - **DKIM #1** (TXT record at a specific subdomain like `resend._domainkey`)
   - **DKIM #2** (TXT record at a specific subdomain)
6. Back in Resend, click **Verify DNS Records**
7. Wait 1-5 min, refresh — should turn green ✅

> ⚠️ If your SPF record already has a value (Squarespace might have added one), you need to **merge** them, not replace. Example: `v=spf1 include:_spf.squarespace.com include:resend.io ~all`

---

## Step 3 — Create an API key (1 min)

1. Resend dashboard → API Keys → Create API Key
2. Name: `chigbulaws-cloudflare-worker`
3. Permission: **Sending access** (full access not needed)
4. Domain: chigbulaws.com only (scope it)
5. Copy the key — starts with `re_` — **this is shown once, save it now**

---

## Step 4 — Add the key to Cloudflare as a secret (2 min)

This is the only command-line part. From any computer with `wrangler` installed:

```bash
cd sites/dist/chigbulaws
wrangler secret put RESEND_API_KEY --name chigbulaws
# paste the re_xxxxx key when prompted
```

**Don't have wrangler?** Use the Cloudflare dashboard instead:
1. cloudflare.com → Workers & Pages → `chigbulaws` worker
2. Settings → Variables → Add variable
3. Type: **Secret** (not Variable)
4. Name: `RESEND_API_KEY`
5. Value: paste the `re_xxxxx` key
6. Save

---

## Step 5 — Test it (1 min)

The fastest way:

1. GitHub mobile app → repo `belichickgillismusk/github` → Actions
2. Tap **📧 Send Test Intake Email**
3. Tap **Run workflow**
4. Site: `chigbulaws`, Area: `general`
5. Tap green **Run workflow** button
6. Within 30 seconds, check `chigbulaw@sbcglobal.net` inbox
7. There should be an email titled `[chigbulaws] Intake (general) — GitHub Actions Test`

If it arrives ✅ — you're done. The email fallback is live for every form submission and chat message from now on.

If it doesn't arrive ❌:
- Check Resend dashboard → Logs to see if the request reached Resend
- If Resend received it, the issue is delivery (sbcglobal.net might be filtering)
- If Resend didn't receive it, the API key isn't set correctly in Cloudflare — repeat Step 4

---

## Bonus: Set up an alert webhook too (Make / Zapier)

The email is the **fallback**. The **primary** alert path is a webhook (Make.com or Zapier) that can text Clifford instantly.

1. Make.com → New scenario → Webhook trigger → copy the webhook URL
2. Add steps after: SMS via Twilio, Slack message, etc.
3. Cloudflare → workers → chigbulaws → Variables → add `ALERT_WEBHOOK` (Variable, not Secret) = the webhook URL
4. Done. Now every form submission triggers BOTH a webhook AND an email — double belt.

---

## Same setup for other Silverback sites

Each site has its own `chatbot.alertWebhook` and `fallbackEmail` in `sites.json`. Repeat steps 2-4 for any site you want to wire up email for. The same Resend account can verify multiple domains for free.

---

## Troubleshooting

### Resend says "Domain not verified"
- Wait longer. SPF/DKIM propagation can take up to an hour even when the records are correct.
- Use https://mxtoolbox.com to verify TXT records are visible globally.

### Email arrives but goes to spam
- Add the sending domain to your contacts
- Make sure SPF + DKIM are both verified (not just one)
- Add a DMARC record for extra deliverability: `v=DMARC1; p=none; rua=mailto:chigbulaw@sbcglobal.net`

### "The fromEmail field has not been verified" error in Resend
- The `fromEmail` in sites.json is `noreply@chigbulaws.com`
- Resend requires the from-domain to be verified (which it is after Step 2)
- If you change `fromEmail` to use a different domain, you have to verify that domain too

---

*Once this is done, the email fallback is permanent. You only set it up once.*
