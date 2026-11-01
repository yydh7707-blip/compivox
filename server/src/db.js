import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS email_verification_tokens(
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  used INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_evt_user ON email_verification_tokens(user_id, purpose);
CREATE TABLE IF NOT EXISTS user_sessions(
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family TEXT NOT NULL,
  refresh_hash TEXT NOT NULL UNIQUE,
  client TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  last_used_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0,
  rotated INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_sess_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sess_family ON user_sessions(family);
CREATE TABLE IF NOT EXISTS devices(
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  name TEXT NOT NULL,
  registered_ip TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  UNIQUE(user_id, device_id)
);
CREATE TABLE IF NOT EXISTS device_registrations(
  id INTEGER PRIMARY KEY,
  ip TEXT NOT NULL,
  device_id TEXT NOT NULL,
  first_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(ip, device_id)
);
CREATE INDEX IF NOT EXISTS idx_devreg_ip ON device_registrations(ip);
CREATE TABLE IF NOT EXISTS ip_exceptions(
  ip TEXT PRIMARY KEY,
  max_devices INTEGER NOT NULL,
  note TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS login_history(
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email TEXT,
  ip TEXT,
  client TEXT,
  success INTEGER NOT NULL,
  reason TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_user ON login_history(user_id, created_at);
CREATE TABLE IF NOT EXISTS ip_risk_assessments(
  id INTEGER PRIMARY KEY,
  ip TEXT NOT NULL,
  provider TEXT NOT NULL,
  available INTEGER NOT NULL,
  result_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_risk_ip ON ip_risk_assessments(ip, created_at);
CREATE TABLE IF NOT EXISTS user_entitlements(
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'FREE',
  source TEXT NOT NULL DEFAULT 'default',
  expires_at INTEGER,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS build_usage(
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT,
  month TEXT NOT NULL,
  project TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_build_user_month ON build_usage(user_id, month);
CREATE TABLE IF NOT EXISTS security_events(
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  type TEXT NOT NULL,
  ip TEXT,
  detail TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS settings(
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits(
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
`;

export function openDb(path) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
  db.exec(SCHEMA);
  return db;
}

export const now = () => Math.floor(Date.now() / 1000);

export function event(db, userId, type, ip, detail) {
  db.prepare("INSERT INTO security_events(user_id,type,ip,detail,created_at) VALUES(?,?,?,?,?)")
    .run(userId ?? null, type, ip ?? null, detail ?? null, now());
}
