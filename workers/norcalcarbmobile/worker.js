// worker.js — NorCal CARB Mobile
// Pass-through to Workers Static Assets. /api/* reserved for future endpoints
// (e.g. native Google Calendar booking via /api/schedule).

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Reserved hook for native Google Calendar booking. Returns a friendly
    // 503 until the real endpoint is wired (uses GOOGLE_API_KEY from secrets).
    if (url.pathname === "/api/schedule") {
      return new Response(
        JSON.stringify({
          status: "not_yet_wired",
          message: "Online scheduling is in progress. Please call 916-890-4427 or email sales@norcalcarbmobile.com to book.",
          phone: "+19168904427",
          email: "sales@norcalcarbmobile.com"
        }),
        { status: 503, headers: { "content-type": "application/json", "cache-control": "no-store" } }
      );
    }

    // Catch-all for any other /api/* path.
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "not_implemented" }), {
        status: 501,
        headers: { "content-type": "application/json" }
      });
    }

    // Everything else: serve from static assets.
    return env.ASSETS.fetch(request);
  }
};
