-- Sack Me! — PostgreSQL schema (reference tables + content migrated from src/data/dataStack/*.ts)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Reference tables ─────────────────────────────────────────

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

CREATE TABLE IF NOT EXISTS role_project_kinds (
  role_id      TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  project_kind TEXT NOT NULL REFERENCES project_kinds(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, project_kind)
);

CREATE TABLE IF NOT EXISTS career_titles (
  id         TEXT PRIMARY KEY,
  label_fr   TEXT NOT NULL,
  label_en   TEXT NOT NULL,
  min_score  INTEGER NOT NULL,
  blurb_fr   TEXT NOT NULL,
  blurb_en   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_phases (
  id       TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  label_fr TEXT NOT NULL,
  label_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tools (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  phase           TEXT NOT NULL REFERENCES project_phases(id),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  blurb_fr        TEXT NOT NULL DEFAULT '',
  blurb_en        TEXT NOT NULL DEFAULT '',
  practice_focus  TEXT[] DEFAULT '{}',
  unlock_after    TEXT[] DEFAULT '{}',
  code_focus      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS role_tool_stacks (
  project_kind TEXT NOT NULL REFERENCES project_kinds(id) ON DELETE CASCADE,
  role_id      TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  tool_id      TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  market_id    TEXT,
  PRIMARY KEY (project_kind, role_id, tool_id)
);

CREATE TABLE IF NOT EXISTS entity_domain_beats (
  entity_id  TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  phase      TEXT NOT NULL REFERENCES project_phases(id),
  text_fr    TEXT NOT NULL,
  text_en    TEXT NOT NULL,
  PRIMARY KEY (entity_id, phase)
);

CREATE TABLE IF NOT EXISTS game_datasets (
  id      TEXT PRIMARY KEY,
  href    TEXT NOT NULL,
  label   TEXT NOT NULL,
  hint_fr TEXT NOT NULL DEFAULT '',
  hint_en TEXT NOT NULL DEFAULT '',
  source  TEXT NOT NULL CHECK (source IN ('Python', 'Spark', 'SQL'))
);

-- ─── Adventure (MVP columns + full JSONB payload) ─────────────

CREATE TABLE IF NOT EXISTS adventure_levels (
  id       INTEGER PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  intro_fr TEXT NOT NULL,
  intro_en TEXT NOT NULL,
  phase    TEXT REFERENCES project_phases(id),
  tools    TEXT[] DEFAULT '{}',
  payload_fr JSONB,
  payload_en JSONB
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
  keywords      TEXT[] DEFAULT '{}',
  tool_id       TEXT,
  phase         TEXT,
  payload_fr    JSONB,
  payload_en    JSONB
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
  framework_ref TEXT,
  payload_fr    JSONB,
  payload_en    JSONB
);

-- ─── QCM packs / banks (ex-TS Records) ─────────────────────────

CREATE TABLE IF NOT EXISTS content_packs (
  pack_type  TEXT NOT NULL,
  item_key   TEXT NOT NULL,
  locale     TEXT NOT NULL CHECK (locale IN ('fr', 'en')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  payload    JSONB NOT NULL,
  PRIMARY KEY (pack_type, item_key, locale)
);
-- pack_type examples:
--   pm_curated, gov_curated, gov_operational,
--   pm_human, pm_human_twist, pm_phase_bank,
--   meeting, tool_onboarding, role_story, role_profile,
--   practice_exercise

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
  closing_en TEXT NOT NULL,
  payload_fr JSONB,
  payload_en JSONB
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

-- ─── Player progression ───────────────────────────────────────

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
CREATE INDEX IF NOT EXISTS idx_content_packs_type ON content_packs(pack_type, locale);
CREATE INDEX IF NOT EXISTS idx_role_tools ON role_tool_stacks(project_kind, role_id);
