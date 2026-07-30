-- Apply schema extensions on existing Sack Me! databases
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS project_phases (
  id       TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  label_fr TEXT NOT NULL,
  label_en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role_project_kinds (
  role_id      TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  project_kind TEXT NOT NULL REFERENCES project_kinds(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, project_kind)
);

CREATE TABLE IF NOT EXISTS tools (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  phase           TEXT NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  blurb_fr        TEXT NOT NULL DEFAULT '',
  blurb_en        TEXT NOT NULL DEFAULT '',
  practice_focus  TEXT[] DEFAULT '{}',
  unlock_after    TEXT[] DEFAULT '{}',
  code_focus      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS role_tool_stacks (
  project_kind TEXT NOT NULL,
  role_id      TEXT NOT NULL,
  tool_id      TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  market_id    TEXT,
  PRIMARY KEY (project_kind, role_id, tool_id)
);

CREATE TABLE IF NOT EXISTS entity_domain_beats (
  entity_id  TEXT NOT NULL,
  phase      TEXT NOT NULL,
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
  source  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_packs (
  pack_type  TEXT NOT NULL,
  item_key   TEXT NOT NULL,
  locale     TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  payload    JSONB NOT NULL,
  PRIMARY KEY (pack_type, item_key, locale)
);

ALTER TABLE adventure_levels ADD COLUMN IF NOT EXISTS phase TEXT;
ALTER TABLE adventure_levels ADD COLUMN IF NOT EXISTS tools TEXT[] DEFAULT '{}';
ALTER TABLE adventure_levels ADD COLUMN IF NOT EXISTS payload_fr JSONB;
ALTER TABLE adventure_levels ADD COLUMN IF NOT EXISTS payload_en JSONB;

ALTER TABLE adventure_steps ADD COLUMN IF NOT EXISTS tool_id TEXT;
ALTER TABLE adventure_steps ADD COLUMN IF NOT EXISTS phase TEXT;
ALTER TABLE adventure_steps ADD COLUMN IF NOT EXISTS payload_fr JSONB;
ALTER TABLE adventure_steps ADD COLUMN IF NOT EXISTS payload_en JSONB;

ALTER TABLE step_questions ADD COLUMN IF NOT EXISTS payload_fr JSONB;
ALTER TABLE step_questions ADD COLUMN IF NOT EXISTS payload_en JSONB;

ALTER TABLE meetings ADD COLUMN IF NOT EXISTS payload_fr JSONB;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS payload_en JSONB;
