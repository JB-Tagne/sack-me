import type { FireAlertLevel } from '../lib/careerTrack'
import { usePmGameI18n } from '../i18n/PmGameI18n'

interface PmGameFireAlertProps {
  level: FireAlertLevel
  fireRisk: number
  onAcknowledge: () => void
}

const ICONS: Record<NonNullable<FireAlertLevel>, string> = {
  danger: '⚠',
  warning: '🚨',
  notice: '📋',
  fired: '🚪',
}

/**
 * Panneau narratif COMEX bloquant — s'affiche après une mauvaise décision
 * quand le fireRisk franchit un seuil critique.
 */
export function PmGameFireAlert({ level, fireRisk, onAcknowledge }: PmGameFireAlertProps) {
  const { t } = usePmGameI18n()
  if (!level) return null

  const titleKey = `fire.${level}.title`
  const bodyKey = `fire.${level}.body`
  const ctaKey = `fire.${level}.cta`

  return (
    <div className={`fire-alert-overlay fire-alert-${level}`} role="alertdialog" aria-modal="true" aria-labelledby="fire-alert-title">
      <div className="fire-alert-panel adventure-enter">
        <div className="fire-alert-icon" aria-hidden>{ICONS[level]}</div>
        <p className="fire-alert-risk" aria-hidden>{fireRisk} %</p>
        <h2 id="fire-alert-title" className="fire-alert-title">{t(titleKey)}</h2>
        <p className="fire-alert-body">{t(bodyKey)}</p>
        <button
          type="button"
          className={`btn fire-alert-cta${level === 'fired' ? ' fire-alert-cta-fired' : ' adventure-cta'}`}
          onClick={onAcknowledge}
          autoFocus
        >
          {t(ctaKey)}
        </button>
      </div>
    </div>
  )
}
