import { usePmGameI18n } from '../i18n/PmGameI18n'

interface PmGameIntroProps {
  onContinue: () => void
}

const FR_LINES = [
  'Sack Me!',
  'le jeu d\u2019aventure orient\u00e9 gestion de projet et gouvernance.',
  'Tu choisis un r\u00f4le. Tu m\u00e8nes \u00e0 bien les t\u00e2ches qui te sont confi\u00e9es et tu \u00e9volues.',
  'Toute mauvaise d\u00e9cision te rapproche de la sortie.',
]

const EN_LINES = [
  'Sack Me!',
  'An adventure game focused on project management and governance.',
  'You choose a role. You complete the tasks assigned to you and grow in your career.',
  'Every bad decision brings you closer to the exit.',
]

/** Page d'intro — pitch du jeu dans la langue choisie, animé ligne par ligne. */
export function PmGameIntro({ onContinue }: PmGameIntroProps) {
  const { locale, t } = usePmGameI18n()
  const lines = locale === 'en' ? EN_LINES : FR_LINES

  return (
    <div className="pm-landing pm-intro adventure-enter">
      <div className="pm-intro-lines" aria-label={lines.join(' ')}>
        {lines.map((line, i) => (
          <p
            key={i}
            className={`pm-intro-line${i === 0 ? ' pm-intro-line-title' : ''}`}
            style={{ animationDelay: `${i * 0.28}s` }}
            aria-hidden
          >
            {line}
          </p>
        ))}
      </div>

      <div
        className="pm-landing-actions pm-intro-actions"
        style={{ animationDelay: `${lines.length * 0.28 + 0.2}s` }}
      >
        <button type="button" className="btn adventure-cta pm-landing-btn" onClick={onContinue}>
          {t('landing.continue')}
        </button>
      </div>
    </div>
  )
}
