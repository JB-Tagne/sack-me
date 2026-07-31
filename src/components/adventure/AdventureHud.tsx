import { PmGameLangToggle } from '../PmGameLangToggle'
import { usePmGameI18n } from '../../i18n/PmGameI18n'

interface AdventureHudProps {
  firstName: string
  playerName: string
  roleLabel: string
  roleBlurb: string
  fireRisk: number
  fireTone: 'ok' | 'warn' | 'critical'
  careerScore: number
  levelLabel: string
  projectKindSuffix: string
  resumeSuffix: string
}

/** Top header: title, language toggle, career HUD. */
export function AdventureHud({
  firstName,
  playerName,
  roleLabel,
  roleBlurb,
  fireRisk,
  fireTone,
  careerScore,
  levelLabel,
  projectKindSuffix,
  resumeSuffix,
}: AdventureHudProps) {
  const { t } = usePmGameI18n()

  return (
    <header className="adventure-top">
      <div>
        <p className="adventure-eyebrow">{t('eyebrow')}</p>
        <h1>{t('header.title')}</h1>
        <p className="adventure-sub">
          {t('header.sub')}
          {projectKindSuffix}
          {resumeSuffix}
        </p>
      </div>
      <div className="adventure-top-actions">
        <PmGameLangToggle />
        <div className="adventure-hud">
          {firstName ? (
            <div className="adventure-hud-item" title={playerName}>
              <span>{t('hud.player')}</span>
              <strong className="adventure-hud-title">{firstName}</strong>
            </div>
          ) : null}
          <div className="adventure-hud-item" title={roleBlurb}>
            <span>{t('hud.role')}</span>
            <strong className="adventure-hud-title">{roleLabel}</strong>
          </div>
          <div className={`adventure-hud-item adventure-hud-fire is-${fireTone}`}>
            <span>{t('hud.fire')}</span>
            <strong>{fireRisk} %</strong>
          </div>
          <div className="adventure-hud-item">
            <span>{t('hud.career')}</span>
            <strong>{careerScore}</strong>
          </div>
          <div className="adventure-hud-item">
            <span>{t('hud.level')}</span>
            <strong>{levelLabel}</strong>
          </div>
        </div>
      </div>
    </header>
  )
}
