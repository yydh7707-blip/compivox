import crypto from "node:crypto";

const b64u = (b) => Buffer.from(b).toString("base64url");

export function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hmac(key, data) {
  return crypto.createHmac("sha256", key).update(data).digest("base64url");
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

const ARGON = { memory: 19456, passes: 2, parallelism: 1, tagLength: 32 };

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  if (typeof crypto.argon2Sync === "function") {
    const tag = crypto.argon2Sync("argon2id", { message: Buffer.from(password), nonce: salt, ...ARGON });
    return `argon2id$${salt.toString("base64")}$${tag.toString("base64")}`;
  }
  const tag = crypto.scryptSync(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${salt.toString("base64")}$${tag.toString("base64")}`;
}

export function verifyPassword(password, stored) {
  const [kind, saltB64, tagB64] = String(stored).split("$");
  if (!saltB64 || !tagB64) return false;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(tagB64, "base64");
  let actual;
  if (kind === "argon2id" && typeof crypto.argon2Sync === "function") {
    actual = crypto.argon2Sync("argon2id", { message: Buffer.from(password), nonce: salt, ...ARGON });
  } else if (kind === "scrypt") {
    actual = crypto.scryptSync(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  } else return false;
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export function signJwt(payload, key, ttlSec) {
  const iat = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat, exp: iat + ttlSec };
  const head = b64u(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const data = `${head}.${b64u(JSON.stringify(body))}`;
  return `${data}.${hmac(key, data)}`;
}

export function verifyJwt(token, key) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const data = `${parts[0]}.${parts[1]}`;
  if (!safeEqual(parts[2], hmac(key, data))) return null;
  try {
    const head = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    if (head.alg !== "HS256") return null;
    const body = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (!body.exp || body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}

const COMMON = new Set(["password", "12345678", "123456789", "qwertyui", "password1", "iloveyou", "11111111", "abc12345", "qwerty123", "1q2w3e4r"]);

export function passwordProblem(pw, username) {
  if (typeof pw !== "string" || pw.length < 10) return "password_too_short";
  if (pw.length > 128) return "password_too_long";
  if (COMMON.has(pw.toLowerCase())) return "password_too_common";
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  if (classes < 3) return "password_too_simple";
  const identity = String(username || "").toLowerCase();
  if (identity.length >= 4 && pw.toLowerCase().includes(identity)) return "password_contains_username";
  return null;
}
