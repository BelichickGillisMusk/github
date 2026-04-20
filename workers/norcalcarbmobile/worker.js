// worker.js — NorCal CARB Mobile
// Minimal pass-through to Workers Static Assets. All content lives in /public.
// Reserved hook at /api/* for future form handler (Turnstile + MailChannels).

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Reserve /api/* for future dynamic endpoints (e.g., /api/contact).
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "not implemented" }), {
        status: 501,
        headers: { "content-type": "application/json" },
      });
    }

    // Everything else: serve from static assets.
    return env.ASSETS.fetch(request);
  },
};
