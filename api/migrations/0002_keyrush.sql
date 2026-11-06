CREATE TABLE IF NOT EXISTS keyrush_users (
  id TEXT PRIMARY KEY NOT NULL,
  username TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'owner')),
  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_keyrush_single_owner
  ON keyrush_users(role) WHERE role = 'owner';

CREATE TABLE IF NOT EXISTS keyrush_sessions (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES keyrush_users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_keyrush_sessions_user
  ON keyrush_sessions(user_id, expires_at);

CREATE TABLE IF NOT EXISTS keyrush_maps (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'normal', 'hard', 'expert')),
  bpm INTEGER NOT NULL CHECK (bpm BETWEEN 30 AND 240),
  keyset TEXT NOT NULL,
  pattern TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS keyrush_runs (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES keyrush_users(id) ON DELETE CASCADE,
  map_id TEXT NOT NULL REFERENCES keyrush_maps(id) ON DELETE RESTRICT,
  map_revision INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('keyboard', 'touch')),
  pattern TEXT NOT NULL,
  keyset TEXT NOT NULL,
  bpm INTEGER NOT NULL,
  started_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  finished_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_keyrush_runs_user
  ON keyrush_runs(user_id, started_at);

CREATE TABLE IF NOT EXISTS keyrush_scores (
  id TEXT PRIMARY KEY NOT NULL,
  run_id TEXT NOT NULL UNIQUE REFERENCES keyrush_runs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES keyrush_users(id) ON DELETE CASCADE,
  map_id TEXT NOT NULL REFERENCES keyrush_maps(id) ON DELETE RESTRICT,
  mode TEXT NOT NULL CHECK (mode IN ('keyboard', 'touch')),
  score INTEGER NOT NULL CHECK (score >= 0),
  accuracy REAL NOT NULL CHECK (accuracy BETWEEN 0 AND 100),
  wpm REAL NOT NULL CHECK (wpm >= 0),
  max_combo INTEGER NOT NULL CHECK (max_combo >= 0),
  elapsed_ms INTEGER NOT NULL CHECK (elapsed_ms > 0),
  events_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_keyrush_scores_map_mode
  ON keyrush_scores(map_id, mode, score DESC, accuracy DESC, created_at);

CREATE INDEX IF NOT EXISTS idx_keyrush_scores_user
  ON keyrush_scores(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS keyrush_rate_limits (
  bucket_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (bucket_key, window_start)
);

INSERT OR IGNORE INTO keyrush_maps
  (id, title, description, difficulty, bpm, keyset, pattern, revision, published, created_at, updated_at)
VALUES
  ('first-light', 'First Light', 'A gentle warm-up across the home row.', 'easy', 72, 'ASDFJKL', 'ASDFJKLJKLASDFJKL', 1, 1, unixepoch(), unixepoch()),
  ('amber-current', 'Amber Current', 'Build a steady rhythm through alternating hands.', 'normal', 96, 'ASDFJKL', 'ASDKJLFAKSLDJFAKSLDJ', 1, 1, unixepoch(), unixepoch()),
  ('night-circuit', 'Night Circuit', 'A longer pattern for focused, accurate play.', 'hard', 120, 'ASDFJKL', 'AFJDKSLFAKDJLSFJAKSLDFJ', 1, 1, unixepoch(), unixepoch());
