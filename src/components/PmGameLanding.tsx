import type { PmGameLocale } from '../i18n/pmGameLocale'

const TITLE_LETTERS = ['S', 'a', 'c', 'k', ' ', 'M', 'e', '!'] as const

interface PmGameLandingProps {
  onChoose: (locale: PmGameLocale) => void
}

/**
 * Accueil Sack Me! — titre animé + choix de langue uniquement.
 */
export function PmGameLanding({ onChoose }: PmGameLandingProps) {
  return (
    <div className="pm-landing adventure-enter">
      <h1 className="pm-landing-title-letters" aria-label="Sack Me!">
        {TITLE_LETTERS.map((char, index) =>
          char === ' ' ? (
            <span
              key={`space-${index}`}
              className="pm-landing-letter is-space"
              aria-hidden
            />
          ) : (
            <span
              key={`${char}-${index}`}
              className="pm-landing-letter"
              style={{ animationDelay: `${index * 0.12}s` }}
              aria-hidden
            >
              {char}
            </span>
          ),
        )}
      </h1>

      <div
        className="pm-landing-actions"
        role="group"
        aria-label="Language / Langue"
        style={{ animationDelay: `${TITLE_LETTERS.length * 0.12 + 0.35}s` }}
      >
        <button
          type="button"
          className="btn adventure-cta pm-landing-btn pm-landing-lang"
          onClick={() => onChoose('fr')}
        >
          Français
        </button>
        <button
          type="button"
          className="btn adventure-cta pm-landing-btn pm-landing-lang"
          onClick={() => onChoose('en')}
        >
          English
        </button>
      </div>
    </div>
  )
}
