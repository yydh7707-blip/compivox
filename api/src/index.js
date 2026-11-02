const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "no-referrer",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

const TURNSTILE_ACTIONS = new Map([
  ["/api/auth/login", "login"],
  ["/api/auth/register", "register"],
  ["/api/security/ip-verify", "ip_verify"],
  ["/api/devices/register", "device_register"],
]);
const PAGE_ROUTES = new Map([
  ["/privacy", "/privacy.html"],
  ["/terms", "/terms.html"],
  ["/service-information", "/service-information.html"],
  ["/legal-information", "/legal-information.html"],
  ["/faq", "/faq.html"],
  ["/account", "/account.html"],
  ["/download", "/download.html"],
]);

const encoder = new TextEncoder();
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...headers } });
const error = (code, status = 400) => json({ error: code }, status);
const digest = async (value) => {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};
const randomId = () => crypto.randomUUID().replaceAll("-", "");
const csv = (value) => String(value ?? "").split(",").map((part) => part.trim()).filter(Boolean);

function clientIp(request) {
  return request.headers.get("cf-connecting-ip") ?? "unknown";
}

function originAllowed(request, env) {
  const origin = request.headers.get("origin");
  return !origin || csv(env.WEB_ORIGIN).includes(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  return origin && csv(env.WEB_ORIGIN).includes(origin)
    ? {
        "access-control-allow-origin": origin,
        "access-control-allow-headers": "content-type, authorization",
        "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
        vary: "Origin",
      }
    : {};
}

function withCors(request, env, response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(corsHeaders(request, env))) headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function configReady(env) {
  if (!(
    env.DB &&
      env.COMPIVOX_ORIGIN &&
      env.EDGE_PROXY_SECRET?.length >= 32 &&
      env.RATE_LIMIT_PEPPER?.length >= 16 &&
      env.TURNSTILE_SECRET?.length >= 8 &&
      env.TURNSTILE_SITE_KEY &&
      csv(env.EXPECTED_HOSTNAME).length > 0 &&
      csv(env.WEB_ORIGIN).length > 0
  )) return false;
  try {
    const origin = new URL(env.COMPIVOX_ORIGIN);
    return origin.protocol === "https:" && origin.pathname === "/";
  } catch {
    return false;
  }
}

async function readJson(request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 8192) throw new RequestError("payload_too_large", 413);
  const text = await request.text();
  if (text.length > 8192) throw new RequestError("payload_too_large", 413);
  if (!text.trim()) return {};
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new RequestError("invalid_json", 400);
  }
}

class RequestError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

async function hitLimit(request, env, scope, limit, windowSeconds) {
  const ipHash = await digest(`${env.RATE_LIMIT_PEPPER}|${clientIp(request)}`);
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  await env.DB.prepare(
    `INSERT INTO edge_rate_limits (bucket_key, window_start, count)
     VALUES (?, ?, 1)
     ON CONFLICT(bucket_key, window_start) DO UPDATE SET count = count + 1`,
  ).bind(`${scope}:${ipHash}`, windowStart).run();
  const row = await env.DB.prepare(
    "SELECT count FROM edge_rate_limits WHERE bucket_key = ? AND window_start = ?",
  ).bind(`${scope}:${ipHash}`, windowStart).first();
  await env.DB.prepare("DELETE FROM edge_rate_limits WHERE window_start < ?")
    .bind(windowStart - 172800).run();
  if (Number(row?.count ?? 0) > limit) throw new RequestError("rate_limited", 429);
}

async function verifyTurnstile(request, env) {
  await hitLimit(request, env, "turnstile", 12, 600);
  const body = await readJson(request);
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const action = typeof body.action === "string" ? body.action : "";
  if (!token || token.length > 2048 || ![...TURNSTILE_ACTIONS.values()].includes(action)) {
    return error("invalid_request", 400);
  }

  const form = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
    remoteip: clientIp(request),
  });
  let result;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return error("verification_unavailable", 503);
    result = await response.json();
  } catch {
    return error("verification_unavailable", 503);
  }

  const hostAllowed = csv(env.EXPECTED_HOSTNAME).some(
    (host) => host.toLowerCase() === String(result.hostname ?? "").toLowerCase(),
  );
  if (!result.success || result.action !== action || !hostAllowed) {
    return error("verification_failed", 403);
  }

  const verificationId = randomId();
  const now = Math.floor(Date.now() / 1000);
  try {
    await env.DB.prepare(
      "DELETE FROM turnstile_verifications WHERE expires_at < ? OR used_at < ?",
    ).bind(now, now - 86400).run();
    await env.DB.prepare(
      `INSERT INTO turnstile_verifications
        (id_hash, token_hash, action, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).bind(
      await digest(`${env.RATE_LIMIT_PEPPER}|${verificationId}`),
      await digest(`${env.RATE_LIMIT_PEPPER}|turnstile|${token}`),
      action,
      now + 300,
      now,
    ).run();
  } catch {
    return error("verification_failed", 403);
  }
  return json({ verificationId });
}

async function consumeVerification(request, env, action, body) {
  const id = typeof body.verificationId === "string" ? body.verificationId : "";
  if (!/^[a-f0-9]{32}$/i.test(id)) throw new RequestError("verification_required", 403);
  const now = Math.floor(Date.now() / 1000);
  const result = await env.DB.prepare(
    `UPDATE turnstile_verifications SET used_at = ?
     WHERE id_hash = ? AND action = ? AND expires_at > ? AND used_at IS NULL`,
  ).bind(
    now,
    await digest(`${env.RATE_LIMIT_PEPPER}|${id}`),
    action,
    now,
  ).run();
  if (Number(result.meta?.changes ?? 0) !== 1) {
    throw new RequestError("verification_required", 403);
  }
}

async function proxy(request, env, bodyText, verifiedAction) {
  const origin = new URL(env.COMPIVOX_ORIGIN);
  const incoming = new URL(request.url);
  const target = new URL(incoming.pathname + incoming.search, origin);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("origin");
  headers.set("x-compivox-edge-auth", env.EDGE_PROXY_SECRET);
  if (verifiedAction) headers.set("x-compivox-turnstile-action", verifiedAction);
  headers.set("x-forwarded-for", clientIp(request));
  headers.set("cf-connecting-ip", clientIp(request));
  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : bodyText,
    redirect: "manual",
  });
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.set("cache-control", "no-store");
  for (const [name, value] of Object.entries(corsHeaders(request, env))) responseHeaders.set(name, value);
  for (const [name, value] of Object.entries(JSON_HEADERS)) {
    if (!responseHeaders.has(name)) responseHeaders.set(name, value);
  }
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
    if (!originAllowed(request, env)) return error("bad_origin", 403);
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }

  if (url.pathname.startsWith("/api/")) {
    if (!originAllowed(request, env)) return error("bad_origin", 403);
    if (!configReady(env)) return error("configuration_error", 503);
    if (request.method === "GET" && url.pathname === "/api/security/turnstile-config") {
      return json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY }, 200, corsHeaders(request, env));
    }
    if (request.method === "POST" && url.pathname === "/api/security/turnstile-verify") {
      const response = await verifyTurnstile(request, env);
      const headers = new Headers(response.headers);
      for (const [name, value] of Object.entries(corsHeaders(request, env))) headers.set(name, value);
      return new Response(response.body, { status: response.status, headers });
    }
    const action = TURNSTILE_ACTIONS.get(url.pathname);
    let bodyText;
    if (action && request.method === "POST") {
      const body = await readJson(request);
      await hitLimit(request, env, action, action === "login" ? 30 : 12, 900);
      await consumeVerification(request, env, action, body);
      delete body.verificationId;
      bodyText = JSON.stringify(body);
    } else if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "DELETE") {
      if (Number(request.headers.get("content-length") ?? 0) > 16384) {
        throw new RequestError("payload_too_large", 413);
      }
      bodyText = await request.text();
      if (bodyText.length > 16384) throw new RequestError("payload_too_large", 413);
    }
    return proxy(request, env, bodyText, action && request.method === "POST" ? action : undefined);
  }

  if (!configReady(env)) return error("configuration_error", 503);
  if (url.pathname.startsWith("/downloads/")) {
    if (!["GET", "HEAD"].includes(request.method)) return error("method_not_allowed", 405);
    return proxy(request, env);
  }
  if (env.ASSETS) {
    const assetUrl = new URL(request.url);
    const assetPath = PAGE_ROUTES.get(assetUrl.pathname);
    if (assetPath) assetUrl.pathname = assetPath;
    const response = await env.ASSETS.fetch(assetPath ? new Request(assetUrl, request) : request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(JSON_HEADERS)) {
      if (name !== "content-type" && !headers.has(name)) headers.set(name, value);
    }
    if (/^(text\/html|text\/css|text\/javascript|application\/javascript)/i.test(headers.get("content-type") ?? "")) {
      headers.set("cache-control", "no-cache");
    }
    headers.set("content-security-policy", [
      "default-src 'self'",
      "script-src 'self' https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self' https://challenges.cloudflare.com",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "));
    return new Response(response.body, { status: response.status, headers });
  }
  return error("not_found", 404);
}

export default {
  async fetch(request, env) {
    try {
      return withCors(request, env, await handle(request, env));
    } catch (caught) {
      if (caught instanceof RequestError) return withCors(request, env, error(caught.code, caught.status));
      return withCors(request, env, error("server_error", 500));
    }
  },
};
