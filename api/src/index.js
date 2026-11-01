const SUPPORT = {
  supported: ["Python", "C#/.NET", "C/C++", "Java", "Go", "Rust"],
  partial: ["JavaScript/TypeScript (web)", "React / Vue / Svelte", ".NET Framework", "Windows Script (.bat/.cmd/.ps1)"],
  planned: ["PHP", "Ruby"]
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=300",
  "access-control-allow-origin": "*"
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok", service: "compivox-api" }), { headers: JSON_HEADERS });
    }
    if (url.pathname === "/api/support") {
      return new Response(JSON.stringify(SUPPORT), { headers: JSON_HEADERS });
    }
    return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: JSON_HEADERS });
  }
};
