import { useId, useState } from 'react'
import type { PmGameLocale } from '../i18n/pmGameLocale'
import { parsePlayerDisplayName } from '../lib/playerIdentity'

const TITLE_LETTERS = ['S', 'a', 'c', 'k', ' ', 'M', 'e', '!'] as const

interface PmGameLandingProps {
  /** Prefill when the player already saved a name. */
  initialDisplayName?: string
  onChoose: (locale: PmGameLocale, displayName: string) => void
}

/**
 * Sack Me! home — animated title, required "First Last" pseudo, then language.
 */
export function PmGameLanding({ initialDisplayName = '', onChoose }: PmGameLandingProps) {
  const nameId = useId()
  const [name, setName] = useState(initialDisplayName)
  const [error, setError] = useState<string | null>(null)

  function tryChoose(locale: PmGameLocale) {
    const parsed = parsePlayerDisplayName(name)
    if (!parsed) {
      setError(
        locale === 'en'
          ? 'Enter your player name as First Last (e.g. Alex Martin). No email needed.'
          : 'Saisis ton pseudo au format Prénom Nom (ex. Alex Martin). Pas besoin d’e-mail.',
      )
      return
    }
    setError(null)
    onChoose(locale, parsed.displayName)
  }

  const actionsDelay = `${TITLE_LETTERS.length * 0.12 + 0.35}s`

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

      <div className="pm-landing-identity" style={{ animationDelay: actionsDelay }}>
        <label className="pm-landing-name-label" htmlFor={nameId}>
          Pseudo joueur / Player name
        </label>
        <p className="pm-landing-name-hint" id={`${nameId}-hint`}>
          Format : Prénom Nom · First Last — pas d’e-mail / no email
        </p>
        <input
          id={nameId}
          className="pm-landing-name-input"
          type="text"
          name="playerDisplayName"
          autoComplete="nickname"
          autoCapitalize="words"
          spellCheck={false}
          maxLength={80}
          placeholder="Alex Martin"
          value={name}
          aria-describedby={`${nameId}-hint${error ? ` ${nameId}-error` : ''}`}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              tryChoose('fr')
            }
          }}
        />
        {error && (
          <p id={`${nameId}-error`} className="pm-landing-name-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div
        className="pm-landing-actions"
        role="group"
        aria-label="Language / Langue"
        style={{ animationDelay: `${TITLE_LETTERS.length * 0.12 + 0.55}s` }}
      >
        <button
          type="button"
          className="btn adventure-cta pm-landing-btn pm-landing-lang"
          onClick={() => tryChoose('fr')}
        >
          Français
        </button>
        <button
          type="button"
          className="btn adventure-cta pm-landing-btn pm-landing-lang"
          onClick={() => tryChoose('en')}
        >
          English
        </button>
      </div>
    </div>
  )
}
