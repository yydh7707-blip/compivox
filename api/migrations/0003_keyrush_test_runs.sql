ALTER TABLE keyrush_runs
  ADD COLUMN test_only INTEGER NOT NULL DEFAULT 0 CHECK (test_only IN (0, 1));
