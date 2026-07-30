# Sack Me! — agent notes

## Game content

- SQL schema: `sql/schema.sql`
- SQL seed (MVP): `sql/seed.sql`
- Full content export: `npm run export:sql` → `sql/seed_from_ts.sql`
- Migrations: `sql/migrations/`
- TS mirror (React runtime): `src/data/dataStack/`
- See `src/data/dataStack/README.md`

## Language

- **All scripts/code** (comments, docstrings, messages): English only — `.cursor/rules/english-code.mdc`
- **Git commit messages**: English only — `.cursor/rules/commit-messages-en.mdc`
- Game locale fields (`*_fr` / `*_en`) stay bilingual for players
