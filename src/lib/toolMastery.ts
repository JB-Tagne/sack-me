import type { ToolId } from '../data/dataStack/tools'
import { CODE_FOCUS_TOOLS, STACK_TOOLS } from '../data/dataStack/tools'

export interface ToolStat {
  attempts: number
  passes: number
  fails: number
}

export type ToolStatsMap = Partial<Record<ToolId, ToolStat>>

export function emptyToolStat(): ToolStat {
  return { attempts: 0, passes: 0, fails: 0 }
}

export function recordToolAttempt(
  stats: ToolStatsMap,
  tool: ToolId | undefined,
  passed: boolean,
): ToolStatsMap {
  if (!tool) return stats
  const cur = stats[tool] ?? emptyToolStat()
  return {
    ...stats,
    [tool]: {
      attempts: cur.attempts + 1,
      passes: cur.passes + (passed ? 1 : 0),
      fails: cur.fails + (passed ? 0 : 1),
    },
  }
}

/** Score 0–1 (1 = maîtrise). Jamais tenté → null. */
export function masteryScore(stat: ToolStat | undefined): number | null {
  if (!stat || stat.attempts === 0) return null
  return stat.passes / stat.attempts
}

export function coveredTools(stats: ToolStatsMap): ToolId[] {
  return STACK_TOOLS.map((t) => t.id).filter((id) => (stats[id]?.attempts ?? 0) > 0)
}

/**
 * Focus difficulté : uniquement parmi les outils déjà couverts (réponses validées/tentées),
 * les plus faibles en tête (taux de réussite bas, puis plus d’échecs).
 */
export function difficultyFocusTools(stats: ToolStatsMap, limit = 5): ToolId[] {
  return coveredTools(stats)
    .map((id) => {
      const s = stats[id]!
      const score = masteryScore(s) ?? 0
      return {
        id,
        score,
        fails: s.fails,
        attempts: s.attempts,
      }
    })
    .sort((a, b) => a.score - b.score || b.fails - a.fails || b.attempts - a.attempts)
    .slice(0, limit)
    .map((r) => r.id)
}

/**
 * Biais endless : d’abord les outils déjà couverts les plus faibles,
 * puis compléter avec des outils code jamais tentés.
 */
export function weakestTools(stats: ToolStatsMap, limit = 4): ToolId[] {
  const fromCovered = difficultyFocusTools(stats, limit)
  if (fromCovered.length >= limit) return fromCovered

  const rest = CODE_FOCUS_TOOLS.filter((id) => !fromCovered.includes(id)).map((id) => {
    const s = stats[id]
    const score = masteryScore(s)
    return {
      id,
      rank: score === null ? 0.42 : score,
      attempts: s?.attempts ?? 0,
    }
  })
  const others = STACK_TOOLS.map((t) => t.id)
    .filter((id) => !fromCovered.includes(id) && !CODE_FOCUS_TOOLS.includes(id))
    .map((id) => {
      const s = stats[id]
      const score = masteryScore(s)
      return { id, rank: score === null ? 0.5 : score, attempts: s?.attempts ?? 0 }
    })

  const fill = [...rest, ...others]
    .sort((a, b) => a.rank - b.rank || b.attempts - a.attempts)
    .map((r) => r.id)

  return [...fromCovered, ...fill].slice(0, limit)
}

export function encouragePass(seed: number): string {
  const msgs = [
    'Bien joué — tu consolides le bon réflexe projet.',
    'Nickel. Enchaîne, le pipeline avance.',
    'Validé. Tu es dans le rythme d’une vraie squad data.',
    'Excellent. Ce geste-là, tu le reviendras en entretien.',
    'Bravo. Continue : la suite du lot t’attend.',
  ]
  return msgs[Math.abs(seed) % msgs.length]!
}

export function encourageFail(seed: number): string {
  const msgs = [
    'Pas grave — les erreurs data font partie du métier. Regarde la correction et réessaie.',
    'Presque. Relis le piège « Attention », puis ajuste ton livrable.',
    'On apprend plus fort sur un KO. Voici la piste, tu vas y arriver.',
    'Classique en projet. Prends la correction, corrige, et repars.',
    'Courage : un essai de plus et tu ancreras le pattern.',
  ]
  return msgs[Math.abs(seed) % msgs.length]!
}

/** Couleur sober : fort = noir, moyen = gris, faible = rouge sombre, vierge = clair. */
export function masteryTone(score: number | null): 'strong' | 'mid' | 'weak' | 'idle' {
  if (score === null) return 'idle'
  if (score >= 0.75) return 'strong'
  if (score >= 0.4) return 'mid'
  return 'weak'
}
