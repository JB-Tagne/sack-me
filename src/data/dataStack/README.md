# Data stack — source of truth

**PostgreSQL** holds the canonical game tables (see [`sql/schema.sql`](../../../sql/schema.sql)).

| SQL table | Former TS source |
|-----------|------------------|
| `entities`, `project_kinds`, `roles`, `role_project_kinds` | `mutualisEntities.ts`, `projectPaths.ts` |
| `tools`, `project_phases`, `role_tool_stacks` | `tools.ts`, `roleToolStacks.ts` |
| `game_datasets` | `gameDatasets.ts` |
| `adventure_levels`, `adventure_steps`, `step_questions` | `adventure.ts` (+ packs) |
| `meetings`, `meeting_questions` | `meetingBank.ts` |
| `content_packs` | `pmPacks*`, `governancePacks*`, `pmHumanBank*`, `exercises.ts`, `toolOnboarding*`, `roleStories.ts`, `roleContent.ts` |
| `career_titles` | `careerTrack.ts` |
| `players`, `player_completed_steps` | runtime progression |

## Regenerate SQL from TypeScript

```bash
npm run export:sql
```

Outputs: [`sql/seed_from_ts.sql`](../../../sql/seed_from_ts.sql)

The React UI still imports the `.ts` modules at runtime. Edit TS (or SQL), then re-export to keep both in sync.

## Apply to PostgreSQL

```bash
psql "$DATABASE_URL" -f sql/schema.sql
psql "$DATABASE_URL" -f sql/seed.sql
psql "$DATABASE_URL" -f sql/seed_from_ts.sql
```

Migrations: [`sql/migrations/`](../../../sql/migrations/)
