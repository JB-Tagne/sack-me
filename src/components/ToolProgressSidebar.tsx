import { STACK_TOOLS, toolById, type ToolId } from '../data/dataStack/tools'
import { usePmGameI18n } from '../i18n/PmGameI18n'
import {
  coveredTools,
  difficultyFocusTools,
  masteryScore,
  masteryTone,
  type ToolStatsMap,
} from '../lib/toolMastery'

interface ToolProgressSidebarProps {
  toolStats: ToolStatsMap
  completedStepIds: string[]
  /** Conservé pour compat ; le focus UI se calcule sur les outils déjà couverts. */
  focusTools?: ToolId[]
  /** Outils jouables de la stack rôle — radar centré dessus. */
  rolePlayableTools?: ToolId[]
  /** Noms marché (10) affichés sous le radar. */
  roleMarketToolNames?: string[]
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** Teinte arc-en-ciel stable par index d’outil (0–360). */
export function toolRainbowHue(index: number, total = STACK_TOOLS.length): number {
  return Math.round((index / Math.max(1, total)) * 360)
}

/** Couleur segment : teinte outil + intensité = maîtrise. */
export function toolRainbowFill(
  index: number,
  score: number | null,
  total = STACK_TOOLS.length,
): string {
  const hue = toolRainbowHue(index, total)
  const tone = masteryTone(score)
  if (tone === 'idle') return `hsl(${hue} 55% 88%)`
  if (tone === 'weak') return `hsl(${hue} 70% 42%)`
  if (tone === 'mid') return `hsl(${hue} 78% 52%)`
  return `hsl(${hue} 85% 45%)`
}

function labelFill(score: number | null): string {
  const tone = masteryTone(score)
  return tone === 'idle' || tone === 'mid' ? '#111111' : '#ffffff'
}

export function ToolProgressSidebar({
  toolStats,
  completedStepIds,
  rolePlayableTools = [],
  roleMarketToolNames = [],
}: ToolProgressSidebarProps) {
  const { t } = usePmGameI18n()
  const ringTools =
    rolePlayableTools.length > 0
      ? rolePlayableTools.map((id) => toolById(id))
      : STACK_TOOLS
  const n = ringTools.length
  const cx = 110
  const cy = 110
  const rOuter = 88
  const rInner = 52
  const covered = coveredTools(toolStats).filter(
    (id) => rolePlayableTools.length === 0 || rolePlayableTools.includes(id),
  )
  const focus = difficultyFocusTools(toolStats, 5).filter(
    (id) => rolePlayableTools.length === 0 || rolePlayableTools.includes(id),
  )
  const masteryScores = ringTools
    .map((tool) => masteryScore(toolStats[tool.id]))
    .filter((s): s is number => s != null)
  const masteryAvg =
    masteryScores.length === 0
      ? null
      : Math.round(
          (masteryScores.reduce((sum, s) => sum + s, 0) / masteryScores.length) * 100,
        )

  return (
    <aside className="adventure-side" aria-label={t('side.title')}>
      <h2 className="adventure-side-title">{t('side.title')}</h2>
      <p className="adventure-side-lead">{t('side.lead')}</p>
      {masteryAvg != null && (
        <p className="adventure-side-mastery">
          {t('side.mastery')}: <strong>{masteryAvg}%</strong>
        </p>
      )}

      {roleMarketToolNames.length > 0 && (
        <p className="adventure-side-stack" aria-label={t('side.roleStack')}>
          <strong>{t('side.roleStack')}</strong>
          {' · '}
          {roleMarketToolNames.join(' · ')}
        </p>
      )}

      <div className="adventure-radar-wrap">
        <svg
          viewBox="0 0 220 220"
          className="adventure-radar"
          role="img"
          aria-label="Diagramme circulaire des outils"
        >
          {ringTools.map((tool, i) => {
            const start = (i / n) * 360
            const end = ((i + 1) / n) * 360 - 1.2
            const score = masteryScore(toolStats[tool.id])
            const fill = toolRainbowFill(i, score, n)
            const p0 = polar(cx, cy, rOuter, start)
            const p1 = polar(cx, cy, rOuter, end)
            const p2 = polar(cx, cy, rInner, end)
            const p3 = polar(cx, cy, rInner, start)
            const large = end - start > 180 ? 1 : 0
            const d = [
              `M ${p0.x} ${p0.y}`,
              `A ${rOuter} ${rOuter} 0 ${large} 1 ${p1.x} ${p1.y}`,
              `L ${p2.x} ${p2.y}`,
              `A ${rInner} ${rInner} 0 ${large} 0 ${p3.x} ${p3.y}`,
              'Z',
            ].join(' ')
            const mid = polar(cx, cy, (rOuter + rInner) / 2, (start + end) / 2)
            return (
              <g key={tool.id}>
                <path d={d} className="adventure-radar-seg" fill={fill} />
                <text
                  x={mid.x}
                  y={mid.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="adventure-radar-label"
                  fill={labelFill(score)}
                >
                  {tool.name.length > 8 ? tool.name.slice(0, 6) + '…' : tool.name}
                </text>
              </g>
            )
          })}
          <circle cx={cx} cy={cy} r={rInner - 6} className="adventure-radar-hole" />
          <text x={cx} y={cy - 6} textAnchor="middle" className="adventure-radar-center">
            {covered.length}/{n}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" className="adventure-radar-center-sub">
            couverts
          </text>
        </svg>
      </div>

      <div className="adventure-side-legend adventure-side-legend-rainbow" aria-hidden>
        {ringTools.map((_, i) => (
          <span
            key={ringTools[i]!.id}
            className="adventure-rainbow-swatch"
            style={{ background: `hsl(${toolRainbowHue(i, n)} 80% 50%)` }}
          />
        ))}
      </div>
      <p className="adventure-side-legend-caption">{t('side.legend')}</p>

      <h3 className="adventure-side-h">{t('side.covered')}</h3>
      {covered.length === 0 ? (
        <p className="adventure-side-empty">{t('side.empty')}</p>
      ) : (
        <ul className="adventure-side-list">
          {covered.map((id) => {
            const tool = STACK_TOOLS.find((t) => t.id === id)!
            const idx = ringTools.findIndex((t) => t.id === id)
            const s = toolStats[id]!
            const pct = Math.round((masteryScore(s) ?? 0) * 100)
            const hue = toolRainbowHue(Math.max(0, idx), n)
            return (
              <li key={id}>
                <strong>
                  <span
                    className="adventure-tool-dot"
                    style={{ background: `hsl(${hue} 80% 48%)` }}
                    aria-hidden
                  />
                  {tool.name}
                </strong>
                <span>
                  {pct}% · {s.passes}/{s.attempts}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      <h3 className="adventure-side-h">{t('side.focus')}</h3>
      {focus.length === 0 ? (
        <p className="adventure-side-empty">{t('side.focusEmpty')}</p>
      ) : (
        <ul className="adventure-side-list">
          {focus.map((id) => {
            const tool = STACK_TOOLS.find((t) => t.id === id)
            if (!tool) return null
            const idx = ringTools.findIndex((t) => t.id === id)
            const hue = toolRainbowHue(Math.max(0, idx), n)
            return (
              <li key={id}>
                <strong>
                  <span
                    className="adventure-tool-dot"
                    style={{ background: `hsl(${hue} 80% 48%)` }}
                    aria-hidden
                  />
                  {tool.name}
                </strong>
              </li>
            )
          })}
        </ul>
      )}

      <p className="adventure-side-meta">
        {completedStepIds.length} {t('side.meta')}
      </p>
    </aside>
  )
}
