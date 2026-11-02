CREATE TABLE IF NOT EXISTS turnstile_verifications (
  id_hash TEXT PRIMARY KEY NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  action TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  used_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_turnstile_expiry
  ON turnstile_verifications(expires_at);

CREATE TABLE IF NOT EXISTS edge_rate_limits (
  bucket_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (bucket_key, window_start)
);
