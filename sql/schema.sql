-- Sack Me! — schéma PostgreSQL
-- Jeu de simulation carrière PM / Gouvernance

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Référentiels ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS entities (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  domain_fr   TEXT NOT NULL,
  domain_en   TEXT NOT NULL,
  blurb_fr    TEXT NOT NULL,
  blurb_en    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_kinds (
  id       TEXT PRIMARY KEY,
  label_fr TEXT NOT NULL,
  label_en TEXT NOT NULL,
  hint_fr  TEXT NOT NULL,
  hint_en  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
  id         TEXT PRIMARY KEY,
  label_fr   TEXT NOT NULL,
  label_en   TEXT NOT NULL,
  track      TEXT NOT NULL CHECK (track IN ('pm', 'governance')),
  project_kind TEXT NOT NULL REFERENCES project_kinds(id)
);

CREATE TABLE IF NOT EXISTS career_titles (
  id         TEXT PRIMARY KEY,
  label_fr   TEXT NOT NULL,
  label_en   TEXT NOT NULL,
  min_score  INTEGER NOT NULL,
  blurb_fr   TEXT NOT NULL,
  blurb_en   TEXT NOT NULL
);

-- ─── Contenu de jeu ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS adventure_levels (
  id       INTEGER PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  intro_fr TEXT NOT NULL,
  intro_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS adventure_steps (
  id            TEXT PRIMARY KEY,
  level_id      INTEGER NOT NULL REFERENCES adventure_levels(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  title_fr      TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  say_fr        TEXT NOT NULL,
  say_en        TEXT NOT NULL,
  do_fr         TEXT NOT NULL,
  do_en         TEXT NOT NULL,
  expect_type   TEXT NOT NULL DEFAULT 'text'
                CHECK (expect_type IN ('text', 'python', 'sql', 'screenshot')),
  correction_fr TEXT NOT NULL,
  correction_en TEXT NOT NULL,
  keywords      TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS step_questions (
  id            SERIAL PRIMARY KEY,
  step_id       TEXT NOT NULL REFERENCES adventure_steps(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('pm', 'gov')),
  question_fr   TEXT NOT NULL,
  question_en   TEXT NOT NULL,
  option_a_fr   TEXT NOT NULL,
  option_a_en   TEXT NOT NULL,
  option_b_fr   TEXT NOT NULL,
  option_b_en   TEXT NOT NULL,
  option_c_fr   TEXT NOT NULL,
  option_c_en   TEXT NOT NULL,
  correct_index SMALLINT NOT NULL CHECK (correct_index IN (0, 1, 2)),
  correction_fr TEXT NOT NULL,
  correction_en TEXT NOT NULL,
  framework_ref TEXT
);

-- ─── Réunions ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS meetings (
  id         TEXT PRIMARY KEY,
  kind       TEXT NOT NULL
             CHECK (kind IN (
               'coproj', 'copil',
               'sprint-planning', 'daily', 'sprint-review', 'sprint-retro',
               'comex-danger', 'comex-warning', 'comex-notice', 'comex-fired'
             )),
  title_fr   TEXT NOT NULL,
  title_en   TEXT NOT NULL,
  opening_fr TEXT NOT NULL,
  opening_en TEXT NOT NULL,
  closing_fr TEXT NOT NULL,
  closing_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meeting_questions (
  id              SERIAL PRIMARY KEY,
  meeting_id      TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  sort_order      SMALLINT NOT NULL CHECK (sort_order BETWEEN 0 AND 4),
  npc_line_fr     TEXT NOT NULL,
  npc_line_en     TEXT NOT NULL,
  question_fr     TEXT NOT NULL,
  question_en     TEXT NOT NULL,
  option_a_fr     TEXT NOT NULL,
  option_a_en     TEXT NOT NULL,
  option_b_fr     TEXT NOT NULL,
  option_b_en     TEXT NOT NULL,
  option_c_fr     TEXT NOT NULL,
  option_c_en     TEXT NOT NULL,
  correct_index   SMALLINT NOT NULL CHECK (correct_index IN (0, 1, 2)),
  correction_fr   TEXT NOT NULL,
  correction_en   TEXT NOT NULL,
  fire_risk_delta INTEGER DEFAULT 0,
  UNIQUE (meeting_id, sort_order)
);

-- ─── Progression joueur ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS players (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key   TEXT UNIQUE NOT NULL,
  locale        TEXT NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en')),
  entity_id     TEXT REFERENCES entities(id),
  project_kind  TEXT REFERENCES project_kinds(id),
  role_id       TEXT REFERENCES roles(id),
  career_score  INTEGER NOT NULL DEFAULT 0,
  fire_risk     INTEGER NOT NULL DEFAULT 18 CHECK (fire_risk BETWEEN 0 AND 100),
  wins          INTEGER NOT NULL DEFAULT 0,
  fails         INTEGER NOT NULL DEFAULT 0,
  level_id      INTEGER NOT NULL DEFAULT 0,
  step_index    INTEGER NOT NULL DEFAULT 0,
  phase         TEXT NOT NULL DEFAULT 'career-pick',
  step_half     TEXT NOT NULL DEFAULT 'pm',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_completed_steps (
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  step_id   TEXT NOT NULL REFERENCES adventure_steps(id) ON DELETE CASCADE,
  PRIMARY KEY (player_id, step_id)
);

CREATE INDEX IF NOT EXISTS idx_steps_level ON adventure_steps(level_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_meeting_q ON meeting_questions(meeting_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_step_q ON step_questions(step_id, kind);
