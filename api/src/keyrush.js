const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};
const SESSION_COOKIE = "keyrush_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 160000;
const DIFFICULTIES = new Set(["easy", "normal", "hard", "expert"]);
const MODES = new Set(["keyboard", "touch"]);
const encoder = new TextEncoder();

class KeyRushError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

function randomToken() {
  return [...crypto.getRandomValues(new Uint8Array(32))]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hash(value) {
  const result = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(result)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left, right) {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

async function passwordHash(password, salt, iterations = PASSWORD_ITERATIONS) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    hash: "SHA-256",
    salt: encoder.encode(salt),
    iterations,
  }, material, 256);
  return [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function readJson(request) {
  const text = await request.text();
  if (text.length > 32768) throw new KeyRushError("payload_too_large", 413);
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new KeyRushError("invalid_json");
  }
}

function originAllowed(request, env) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = String(env.KEYRUSH_ORIGINS ?? env.WEB_ORIGIN ?? "")
    .split(",").map((item) => item.trim()).filter(Boolean);
  if (env.ENVIRONMENT === "development") {
    allowed.push(...String(env.KEYRUSH_DEV_ORIGINS ?? "").split(",").map((item) => item.trim()).filter(Boolean));
  }
  return allowed.includes(origin);
}

function responseHeaders(request, env) {
  const origin = request.headers.get("origin");
  if (!origin) return {};
  const allowed = String(env.KEYRUSH_ORIGINS ?? env.WEB_ORIGIN ?? "")
    .split(",").map((item) => item.trim()).filter(Boolean);
  if (env.ENVIRONMENT === "development") {
    allowed.push(...String(env.KEYRUSH_DEV_ORIGINS ?? "").split(",").map((item) => item.trim()).filter(Boolean));
  }
  return allowed.includes(origin) ? {
    "access-control-allow-origin": origin,
    "access-control-allow-credentials": "true",
    "vary": "Origin",
  } : {};
}

async function rateLimit(request, env, scope, limit = 12) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % 600);
  const key = await hash(`${scope}|${request.headers.get("cf-connecting-ip") ?? "local"}`);
  await env.DB.prepare(
    `INSERT INTO keyrush_rate_limits (bucket_key, window_start, count)
     VALUES (?, ?, 1)
     ON CONFLICT(bucket_key, window_start) DO UPDATE SET count = count + 1`,
  ).bind(key, windowStart).run();
  const row = await env.DB.prepare(
    "SELECT count FROM keyrush_rate_limits WHERE bucket_key = ? AND window_start = ?",
  ).bind(key, windowStart).first();
  await env.DB.prepare("DELETE FROM keyrush_rate_limits WHERE window_start < ?")
    .bind(windowStart - 86400).run();
  if (Number(row?.count ?? 0) > limit) throw new KeyRushError("rate_limited", 429);
}

function cookieToken(request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : "";
}

function sessionCookie(token, maxAge = SESSION_SECONDS) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

async function currentUser(request, env) {
  const token = cookieToken(request);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(
    `SELECT u.id, u.username, u.nickname, u.role
     FROM keyrush_sessions s JOIN keyrush_users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`,
  ).bind(await hash(token), now).first();
  return row ?? null;
}

async function requireUser(request, env) {
  const user = await currentUser(request, env);
  if (!user) throw new KeyRushError("login_required", 401);
  return user;
}

async function requireOwner(request, env) {
  const user = await requireUser(request, env);
  if (user.role !== "owner") throw new KeyRushError("owner_required", 403);
  return user;
}

function publicMap(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    bpm: Number(row.bpm),
    keyset: row.keyset,
    pattern: row.pattern,
    revision: Number(row.revision),
  };
}

function validateMap(body) {
  const id = String(body.id ?? "").trim().toLowerCase();
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const difficulty = String(body.difficulty ?? "");
  const keyset = String(body.keyset ?? "").trim().toUpperCase();
  const pattern = String(body.pattern ?? "").trim().toUpperCase();
  const bpm = Number(body.bpm);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length > 48) throw new KeyRushError("invalid_map_id");
  if (!title || title.length > 60) throw new KeyRushError("invalid_title");
  if (description.length > 300) throw new KeyRushError("invalid_description");
  if (!DIFFICULTIES.has(difficulty)) throw new KeyRushError("invalid_difficulty");
  if (!Number.isInteger(bpm) || bpm < 30 || bpm > 240) throw new KeyRushError("invalid_bpm");
  if (!/^[A-Z]{3,12}$/.test(keyset) || new Set(keyset).size !== keyset.length) throw new KeyRushError("invalid_keyset");
  if (pattern.length < 8 || pattern.length > 240 || [...pattern].some((key) => !keyset.includes(key))) {
    throw new KeyRushError("invalid_pattern");
  }
  return { id, title, description, difficulty, bpm, keyset, pattern };
}

function scoreRun(run, events, serverElapsedMs) {
  if (!Array.isArray(events) || events.length < run.pattern.length || events.length > run.pattern.length * 5) {
    throw new KeyRushError("invalid_replay");
  }
  let matched = 0;
  let combo = 0;
  let maxCombo = 0;
  let previousTime = -1;
  const sanitized = [];
  for (const event of events) {
    const key = typeof event?.key === "string" ? event.key.toUpperCase() : "";
    const atMs = Number(event?.atMs);
    if (key.length !== 1 || !run.keyset.includes(key) || !Number.isInteger(atMs) || atMs < 0 || atMs < previousTime) {
      throw new KeyRushError("invalid_replay");
    }
    if (matched >= run.pattern.length || atMs > 2 * 60 * 60 * 1000) throw new KeyRushError("invalid_replay");
    previousTime = atMs;
    const correct = key === run.pattern[matched];
    if (correct) {
      matched += 1;
      combo += 1;
      maxCombo = Math.max(maxCombo, combo);
    } else {
      combo = 0;
    }
    sanitized.push({ key, atMs, correct });
  }
  if (matched !== run.pattern.length) throw new KeyRushError("pattern_incomplete");
  const elapsedMs = Math.max(1000, Math.round(serverElapsedMs));
  const accuracy = Math.round((matched / sanitized.length) * 10000) / 100;
  const wpm = Math.round((matched / 5 / (elapsedMs / 60000)) * 100) / 100;
  const score = Math.round((matched * 100 + Math.min(2000, wpm * 15)) * (accuracy / 100));
  return { events: sanitized, matched, maxCombo, elapsedMs, accuracy, wpm, score };
}

function mapResponse(row) {
  return { ...publicMap(row), published: Boolean(row.published), updatedAt: Number(row.updated_at) };
}

async function register(request, env, headers) {
  await rateLimit(request, env, "register", 8);
  const body = await readJson(request);
  const username = String(body.username ?? "").trim().toLowerCase();
  const nickname = String(body.nickname ?? "").trim();
  const password = String(body.password ?? "");
  if (!/^[a-z0-9_]{3,20}$/.test(username)) throw new KeyRushError("invalid_username");
  if (nickname.length < 2 || nickname.length > 20) throw new KeyRushError("invalid_nickname");
  if (password.length < 10 || password.length > 128) throw new KeyRushError("invalid_password");
  const salt = randomToken().slice(0, 32);
  const passHash = await passwordHash(password, salt);
  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  const ownerSecret = String(env.KEYRUSH_OWNER_CLAIM_SECRET ?? "");
  let role = "player";
  if (ownerSecret && typeof body.ownerClaim === "string" &&
      constantTimeEqual(await hash(body.ownerClaim), await hash(ownerSecret))) {
    const ownerExists = await env.DB.prepare("SELECT id FROM keyrush_users WHERE role = 'owner'").first();
    if (ownerExists) throw new KeyRushError("owner_already_claimed", 409);
    role = "owner";
  }
  try {
    await env.DB.prepare(
      `INSERT INTO keyrush_users (id, username, nickname, password_hash, role, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(id, username, nickname, `pbkdf2$${PASSWORD_ITERATIONS}$${salt}$${passHash}`, role, now).run();
  } catch (error) {
    if (String(error?.message ?? "").toLowerCase().includes("unique")) throw new KeyRushError("username_taken", 409);
    throw error;
  }
  return createSession(env, id, { id, username, nickname, role }, headers);
}

async function login(request, env, headers) {
  await rateLimit(request, env, "login", 12);
  const body = await readJson(request);
  const username = String(body.username ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!/^[a-z0-9_]{3,20}$/.test(username) || password.length > 128) throw new KeyRushError("invalid_credentials", 401);
  const row = await env.DB.prepare(
    "SELECT id, username, nickname, password_hash, role FROM keyrush_users WHERE username = ?",
  ).bind(username).first();
  if (!row) {
    await passwordHash(password || "invalid-password", "00000000000000000000000000000000");
    throw new KeyRushError("invalid_credentials", 401);
  }
  const [, iterationsText, salt, expected] = String(row.password_hash).split("$");
  const actual = await passwordHash(password, salt, Number(iterationsText));
  if (!constantTimeEqual(actual, expected)) throw new KeyRushError("invalid_credentials", 401);
  return createSession(env, row.id, { id: row.id, username: row.username, nickname: row.nickname, role: row.role }, headers);
}

async function createSession(env, userId, user, headers) {
  const token = randomToken();
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "INSERT INTO keyrush_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
  ).bind(await hash(token), userId, now + SESSION_SECONDS, now).run();
  return json({ user }, 200, { ...headers, "set-cookie": sessionCookie(token) });
}

async function logout(request, env, headers) {
  const token = cookieToken(request);
  if (token) await env.DB.prepare("DELETE FROM keyrush_sessions WHERE token_hash = ?").bind(await hash(token)).run();
  return json({ ok: true }, 200, { ...headers, "set-cookie": sessionCookie("", 0) });
}

async function profile(env, user) {
  const stats = await env.DB.prepare(
    `SELECT COUNT(*) AS plays, MAX(score) AS best_score,
       AVG(accuracy) AS average_accuracy, AVG(wpm) AS average_wpm,
       MAX(max_combo) AS best_combo
     FROM keyrush_scores WHERE user_id = ?`,
  ).bind(user.id).first();
  const ranks = {};
  await Promise.all([...MODES].map(async (mode) => {
    const row = await env.DB.prepare(
      `WITH ranked AS (
         SELECT s.user_id, s.map_id, s.score, s.accuracy,
           ROW_NUMBER() OVER (
             PARTITION BY s.user_id, s.map_id
             ORDER BY s.score DESC, s.accuracy DESC, s.created_at ASC
           ) AS position
         FROM keyrush_scores s WHERE s.mode = ?
       ), totals AS (
         SELECT ranked.user_id, SUM(ranked.score) AS score, AVG(ranked.accuracy) AS accuracy
         FROM ranked JOIN keyrush_maps m
           ON m.id = ranked.map_id AND m.published = 1 AND m.deleted_at IS NULL
         WHERE ranked.position = 1
         GROUP BY ranked.user_id
       )
       SELECT CASE WHEN COUNT(own.user_id) = 0 THEN NULL
         ELSE COUNT(other.user_id) + 1 END AS rank
       FROM totals own
       JOIN keyrush_users own_user ON own_user.id = own.user_id
       LEFT JOIN totals other
         ON other.score > own.score
         OR (other.score = own.score AND other.accuracy > own.accuracy)
         OR (other.score = own.score AND other.accuracy = own.accuracy AND other.user_id < own.user_id)
       WHERE own.user_id = ?`,
    ).bind(mode, user.id).first();
    ranks[mode] = row?.rank == null ? null : Number(row.rank);
  }));
  const maps = await env.DB.prepare(
    `WITH ranked AS (
       SELECT s.map_id, s.score, s.accuracy, s.wpm, s.mode, s.created_at,
         ROW_NUMBER() OVER (
           PARTITION BY s.map_id, s.mode
           ORDER BY s.score DESC, s.accuracy DESC, s.created_at ASC
         ) AS position
       FROM keyrush_scores s WHERE s.user_id = ?
     )
     SELECT m.id AS map_id, m.title, ranked.score, ranked.accuracy,
       ranked.wpm, ranked.mode, ranked.created_at
     FROM ranked JOIN keyrush_maps m ON m.id = ranked.map_id
     WHERE ranked.position = 1 AND m.published = 1 AND m.deleted_at IS NULL
     ORDER BY ranked.score DESC`,
  ).bind(user.id).all();
  return {
    user: { id: user.id, username: user.username, nickname: user.nickname, role: user.role },
    stats: {
      plays: Number(stats?.plays ?? 0),
      bestScore: Number(stats?.best_score ?? 0),
      averageAccuracy: Number(stats?.average_accuracy ?? 0),
      averageWpm: Number(stats?.average_wpm ?? 0),
      bestCombo: Number(stats?.best_combo ?? 0),
    },
    ranks,
    maps: maps.results ?? [],
  };
}

async function rankings(env, mapId, mode) {
  if (!MODES.has(mode)) throw new KeyRushError("invalid_mode");
  if (mapId) {
    const map = await env.DB.prepare(
      "SELECT id FROM keyrush_maps WHERE id = ? AND published = 1 AND deleted_at IS NULL",
    ).bind(mapId).first();
    if (!map) throw new KeyRushError("map_not_found", 404);
    const result = await env.DB.prepare(
      `WITH ranked AS (
         SELECT s.user_id, s.score, s.accuracy, s.wpm, s.max_combo, s.mode, s.created_at,
           ROW_NUMBER() OVER (
             PARTITION BY s.user_id
             ORDER BY s.score DESC, s.accuracy DESC, s.created_at ASC
           ) AS position
         FROM keyrush_scores s WHERE s.map_id = ? AND s.mode = ?
       )
       SELECT u.username, u.nickname, ranked.score, ranked.accuracy,
         ranked.wpm, ranked.max_combo, ranked.mode, ranked.created_at
       FROM ranked JOIN keyrush_users u ON u.id = ranked.user_id
       WHERE ranked.position = 1
       ORDER BY ranked.score DESC, ranked.accuracy DESC, ranked.created_at ASC LIMIT 100`,
    ).bind(mapId, mode).all();
    return result.results ?? [];
  }
  const result = await env.DB.prepare(
    `WITH ranked AS (
       SELECT s.user_id, s.map_id, s.score, s.accuracy, s.wpm, s.max_combo, s.created_at,
         ROW_NUMBER() OVER (
           PARTITION BY s.user_id, s.map_id
           ORDER BY s.score DESC, s.accuracy DESC, s.created_at ASC
         ) AS position
       FROM keyrush_scores s WHERE s.mode = ?
     ), per_map AS (
       SELECT * FROM ranked WHERE position = 1
     )
     SELECT u.username, u.nickname, SUM(per_map.score) AS score,
       AVG(per_map.accuracy) AS accuracy, AVG(per_map.wpm) AS wpm,
       MAX(per_map.max_combo) AS max_combo, COUNT(*) AS maps_played,
       MAX(per_map.created_at) AS created_at, ? AS mode
     FROM per_map JOIN keyrush_users u ON u.id = per_map.user_id
     JOIN keyrush_maps m ON m.id = per_map.map_id AND m.published = 1 AND m.deleted_at IS NULL
     GROUP BY u.id ORDER BY score DESC, accuracy DESC, u.id ASC LIMIT 100`,
  ).bind(mode, mode).all();
  return result.results ?? [];
}

async function startRun(request, env, user) {
  const body = await readJson(request);
  const mapId = String(body.mapId ?? "");
  const mode = String(body.mode ?? "");
  const testOnly = body.testOnly === true;
  if (!MODES.has(mode)) throw new KeyRushError("invalid_mode");
  if (testOnly && user.role !== "owner") throw new KeyRushError("owner_required", 403);
  const map = await env.DB.prepare(
    `SELECT id, pattern, keyset, bpm, revision FROM keyrush_maps
     WHERE id = ? AND deleted_at IS NULL AND (published = 1 OR ? = 1)`,
  ).bind(mapId, testOnly ? 1 : 0).first();
  if (!map) throw new KeyRushError("map_not_found", 404);
  const id = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = Math.floor(now / 1000) + 60 * 60 * 2;
  await env.DB.prepare(
    `INSERT INTO keyrush_runs
      (id, user_id, map_id, map_revision, mode, pattern, keyset, bpm, started_at, expires_at, test_only)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(id, user.id, map.id, map.revision, mode, map.pattern, map.keyset, map.bpm, now, expiresAt, testOnly ? 1 : 0).run();
  return json({
    runId: id,
    startedAt: now,
    expiresAt: expiresAt * 1000,
    map: { pattern: map.pattern, keyset: map.keyset, bpm: Number(map.bpm) },
  });
}

async function finishRun(request, env, user, runId) {
  const body = await readJson(request);
  const run = await env.DB.prepare(
    `SELECT id, user_id, map_id, mode, pattern, keyset, bpm, started_at, expires_at, test_only
     FROM keyrush_runs WHERE id = ? AND user_id = ? AND finished_at IS NULL`,
  ).bind(runId, user.id).first();
  if (!run) throw new KeyRushError("run_not_found", 404);
  const now = Date.now();
  if (Number(run.expires_at) < Math.floor(now / 1000)) throw new KeyRushError("run_expired", 410);
  const serverElapsedMs = Math.max(0, now - Number(run.started_at) - 2250);
  const minimumDuration = Math.max(1000, String(run.pattern).length * 70);
  if (serverElapsedMs + 350 < minimumDuration) throw new KeyRushError("invalid_replay");
  const submittedEvents = body.events;
  const lastEventAt = Array.isArray(submittedEvents)
    ? Number(submittedEvents.at(-1)?.atMs)
    : Number.NaN;
  if (!Number.isFinite(lastEventAt) || lastEventAt > serverElapsedMs + 1000) {
    throw new KeyRushError("invalid_replay");
  }
  const result = scoreRun(run, submittedEvents, serverElapsedMs);
  const createdAt = Math.floor(now / 1000);
  if (Number(run.test_only) === 1) {
    const updated = await env.DB.prepare(
      "UPDATE keyrush_runs SET finished_at = ? WHERE id = ? AND finished_at IS NULL",
    ).bind(createdAt, runId).run();
    if (Number(updated.meta?.changes ?? 0) !== 1) throw new KeyRushError("run_already_finished", 409);
    return json({ ...result, mode: run.mode, mapId: run.map_id, createdAt, testOnly: true });
  }
  const scoreId = crypto.randomUUID();
  const saved = await env.DB.batch([
    env.DB.prepare("UPDATE keyrush_runs SET finished_at = ? WHERE id = ? AND finished_at IS NULL")
      .bind(createdAt, runId),
    env.DB.prepare(`INSERT INTO keyrush_scores
      (id, run_id, user_id, map_id, mode, score, accuracy, wpm, max_combo, elapsed_ms, events_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      scoreId, run.id, user.id, run.map_id, run.mode, result.score, result.accuracy,
      result.wpm, result.maxCombo, result.elapsedMs, JSON.stringify(result.events), createdAt,
    ),
  ]);
  if (Number(saved[0]?.meta?.changes ?? 0) !== 1) throw new KeyRushError("run_already_finished", 409);
  return json({ ...result, mode: run.mode, mapId: run.map_id, createdAt });
}

async function saveMap(request, env, idFromPath = "") {
  const body = await readJson(request);
  const map = validateMap({ ...body, id: idFromPath || body.id });
  const published = body.published === true ? 1 : 0;
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    `INSERT INTO keyrush_maps
      (id, title, description, difficulty, bpm, keyset, pattern, revision, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title, description = excluded.description,
       difficulty = excluded.difficulty, bpm = excluded.bpm,
       keyset = excluded.keyset, pattern = excluded.pattern,
       revision = keyrush_maps.revision + 1, published = excluded.published,
       updated_at = excluded.updated_at, deleted_at = NULL`,
  ).bind(map.id, map.title, map.description, map.difficulty, map.bpm, map.keyset, map.pattern, published, now, now).run();
  return json({ map: { ...map, published: Boolean(published), updatedAt: now } });
}

export async function handleKeyRush(request, env) {
  if (!env.DB) return json({ error: "keyrush_database_unavailable" }, 503);
  if (!originAllowed(request, env)) return json({ error: "bad_origin" }, 403);
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const headers = responseHeaders(request, env);
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: {
        ...headers,
        "access-control-allow-headers": "content-type",
        "access-control-allow-methods": "GET, POST, OPTIONS",
      } });
    }

    if (path === "/api/keyrush/auth/register" && request.method === "POST") {
      return await register(request, env, headers);
    }
    if (path === "/api/keyrush/auth/login" && request.method === "POST") return await login(request, env, headers);
    if (path === "/api/keyrush/auth/logout" && request.method === "POST") return await logout(request, env, headers);
    if (path === "/api/keyrush/auth/me" && request.method === "GET") {
      const user = await currentUser(request, env);
      return json({ user: user ? { id: user.id, username: user.username, nickname: user.nickname, role: user.role } : null }, 200, headers);
    }
    if (path === "/api/keyrush/maps" && request.method === "GET") {
      const rows = await env.DB.prepare(
        "SELECT * FROM keyrush_maps WHERE published = 1 AND deleted_at IS NULL ORDER BY difficulty, title",
      ).all();
      return json({ maps: (rows.results ?? []).map(mapResponse) }, 200, headers);
    }
    if (path === "/api/keyrush/admin/maps" && request.method === "GET") {
      await requireOwner(request, env);
      const rows = await env.DB.prepare(
        "SELECT * FROM keyrush_maps WHERE deleted_at IS NULL ORDER BY updated_at DESC",
      ).all();
      return json({ maps: (rows.results ?? []).map(mapResponse) }, 200, headers);
    }
    if (path === "/api/keyrush/admin/maps" && request.method === "POST") {
      await requireOwner(request, env);
      return await saveMap(request, env);
    }
    const adminMap = path.match(/^\/api\/keyrush\/admin\/maps\/([a-z0-9-]+)(?:\/(publish|delete))?$/);
    if (adminMap && request.method === "POST") {
      await requireOwner(request, env);
      const [, id, action] = adminMap;
      if (action === "delete") {
        const now = Math.floor(Date.now() / 1000);
        const result = await env.DB.prepare(
          "UPDATE keyrush_maps SET published = 0, deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL",
        ).bind(now, now, id).run();
        if (Number(result.meta?.changes ?? 0) !== 1) throw new KeyRushError("map_not_found", 404);
        return json({ ok: true }, 200, headers);
      }
      if (action === "publish") {
        const body = await readJson(request);
        const result = await env.DB.prepare(
          "UPDATE keyrush_maps SET published = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL",
        ).bind(body.published === true ? 1 : 0, Math.floor(Date.now() / 1000), id).run();
        if (Number(result.meta?.changes ?? 0) !== 1) throw new KeyRushError("map_not_found", 404);
        return json({ ok: true, published: body.published === true }, 200, headers);
      }
      const existing = await env.DB.prepare(
        "SELECT id FROM keyrush_maps WHERE id = ? AND deleted_at IS NULL",
      ).bind(id).first();
      if (!existing) throw new KeyRushError("map_not_found", 404);
      return await saveMap(request, env, id);
    }
    if (path === "/api/keyrush/rankings" && request.method === "GET") {
      return json({
        rankings: await rankings(env, url.searchParams.get("mapId") ?? "", url.searchParams.get("mode") ?? "keyboard"),
      }, 200, headers);
    }
    if (path === "/api/keyrush/ghost" && request.method === "GET") {
      const mapId = url.searchParams.get("mapId") ?? "";
      const mode = url.searchParams.get("mode") ?? "keyboard";
      if (!MODES.has(mode)) throw new KeyRushError("invalid_mode");
      const row = await env.DB.prepare(
        `SELECT u.nickname, s.score, s.accuracy, s.wpm, s.events_json
         FROM keyrush_scores s JOIN keyrush_users u ON u.id = s.user_id
         JOIN keyrush_maps m ON m.id = s.map_id AND m.published = 1 AND m.deleted_at IS NULL
         WHERE s.map_id = ? AND s.mode = ?
         ORDER BY s.score DESC, s.accuracy DESC, s.created_at ASC LIMIT 1`,
      ).bind(mapId, mode).first();
      return json({ ghost: row ? {
        nickname: row.nickname,
        score: Number(row.score),
        accuracy: Number(row.accuracy),
        wpm: Number(row.wpm),
        events: JSON.parse(row.events_json),
      } : null }, 200, headers);
    }
    if (path === "/api/keyrush/runs" && request.method === "POST") {
      const user = await requireUser(request, env);
      await rateLimit(request, env, `run:${user.id}`, 30);
      return await startRun(request, env, user);
    }
    const finish = path.match(/^\/api\/keyrush\/runs\/([0-9a-f-]+)\/finish$/i);
    if (finish && request.method === "POST") {
      const user = await requireUser(request, env);
      return await finishRun(request, env, user, finish[1]);
    }
    if (path === "/api/keyrush/profile" && request.method === "GET") {
      const user = await requireUser(request, env);
      return json(await profile(env, user), 200, headers);
    }
    const publicProfile = path.match(/^\/api\/keyrush\/profiles\/([a-z0-9_]{3,20})$/);
    if (publicProfile && request.method === "GET") {
      const user = await env.DB.prepare(
        "SELECT id, username, nickname, role FROM keyrush_users WHERE username = ?",
      ).bind(publicProfile[1]).first();
      if (!user) throw new KeyRushError("profile_not_found", 404);
      const result = await profile(env, user);
      return json({ ...result, user: { username: user.username, nickname: user.nickname } }, 200, headers);
    }
    return json({ error: "not_found" }, 404, headers);
  } catch (error) {
    if (error instanceof KeyRushError) return json({ error: error.code }, error.status, headers);
    console.error("KeyRush request failed.", error);
    return json({ error: "server_error" }, 500, headers);
  }
}
