# Data stack — source of truth

**TypeScript** modules under `src/data/dataStack/` hold the canonical game content:

| Module | Content |
|--------|---------|
| `mutualisEntities.ts`, `projectPaths.ts` | Subsidiaries, project kinds, roles |
| `tools.ts`, `roleToolStacks.ts` | Tool stacks per role |
| `gameDatasets.ts` | CSV / JSON datasets |
| `adventure.ts` (+ packs) | Levels, steps, questions |
| `meetingBank.ts` | Meetings (exec committee, etc.) |
| `pmPacks*`, `governancePacks*`, `pmHumanBank*`, `exercises.ts`, `toolOnboarding*`, `roleStories.ts`, `roleContent.ts` | Content packs |
| `careerTrack.ts` | Career titles |

Edit these files directly, then run `npm test` and `npm run build`.
