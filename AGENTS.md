# Sack Me! — agent notes

## Game content

- Subsidiaries: `data/catalog/entities.yaml` → `python scripts/sync_game_content.py --write`
- Consistency check: `python scripts/sync_game_content.py --check`
- TS → SQL export: `npm run export:sql` then `python scripts/apply_ts_sql.py`
- See `.cursor/rules/sync-game-content.mdc`

## Language

- **All scripts/code** (comments, docstrings, messages): English only — `.cursor/rules/english-code.mdc`
- **Git commit messages**: English only — `.cursor/rules/commit-messages-en.mdc`
- Game locale fields (`*_fr` / `*_en`) stay bilingual for players
