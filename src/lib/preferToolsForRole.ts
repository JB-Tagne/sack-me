import type { ToolStatsMap } from '../lib/toolMastery'
import { masteryScore } from '../lib/toolMastery'
import type { ToolId } from '../data/dataStack/tools'
import { CODE_FOCUS_TOOLS } from '../data/dataStack/tools'

/**
 * Biais outils pour le jeu : d’abord la stack jouable du rôle (faibles en tête),
 * puis éventuellement du code si le rôle en a, sinon fallback code générique.
 */
export function preferToolsForRole(
  stats: ToolStatsMap,
  rolePlayable: ToolId[],
  limit = 5,
): ToolId[] {
  if (rolePlayable.length === 0) {
    return CODE_FOCUS_TOOLS.slice(0, limit)
  }

  const rankedRole = [...rolePlayable]
    .map((id) => {
      const s = stats[id]
      const score = masteryScore(s)
      return {
        id,
        rank: score === null ? 0.35 : score,
        attempts: s?.attempts ?? 0,
      }
    })
    .sort((a, b) => a.rank - b.rank || b.attempts - a.attempts)
    .map((r) => r.id)

  if (rankedRole.length >= limit) return rankedRole.slice(0, limit)

  const roleCode = rolePlayable.filter((id) => CODE_FOCUS_TOOLS.includes(id))
  const fill = CODE_FOCUS_TOOLS.filter((id) => !rankedRole.includes(id))
  const extra = (roleCode.length > 0 ? fill : fill).filter((id) => !rankedRole.includes(id))
  return [...rankedRole, ...extra].slice(0, limit)
}
