# Data stack — source of truth

**PostgreSQL** holds the canonical game tables:

| SQL table | Former TS source |
|-----------|------------------|
| `entities`, `project_kinds`, `roles`, `role_project_kinds` | `mutualisEntities.ts`, `projectPaths.ts` |
| `tools`, `project_phases`, `role_tool_stacks` | `tools.ts`, `roleToolStacks.ts` |
| `game_datasets` | `gameDatasets.ts` |
| `adventure_levels`, `adventure_steps`, `step_questions` | `adventure.ts` (+ packs) |
| `meetings`, `meeting_questions` | `meetingBank.ts` |
| `content_packs` | `pmPacks*`, `governancePacks*`, `pmHumanBank*`, `exercises.ts`, `toolOnboarding*`, `roleStories.ts`, `roleContent.ts` |
| `career_titles` | `careerTrack.ts` |

## Regenerate SQL from TypeScript (until reverse sync exists)

```bash
npm run export:sql
python scripts/apply_ts_sql.py   # load into local Postgres
```

Outputs: [`sql/seed_from_ts.sql`](../../sql/seed_from_ts.sql)

The React UI still imports the `.ts` modules at runtime. Treat them as a **read mirror**; prefer editing then re-exporting to SQL, or edit SQL and keep TS in sync via export for now.
