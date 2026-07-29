import { usePmGameI18n } from '../i18n/PmGameI18n'
import type { PmGameLocale } from '../i18n/pmGameLocale'

export function PmGameLangToggle() {
  const { locale, setLocale, t } = usePmGameI18n()

  function select(next: PmGameLocale) {
    if (next !== locale) setLocale(next)
  }

  return (
    <div className="pm-lang-toggle" role="group" aria-label={t('lang.label')}>
      <button
        type="button"
        className={locale === 'fr' ? 'is-active' : undefined}
        aria-pressed={locale === 'fr'}
        onClick={() => select('fr')}
      >
        {t('lang.fr')}
      </button>
      <button
        type="button"
        className={locale === 'en' ? 'is-active' : undefined}
        aria-pressed={locale === 'en'}
        onClick={() => select('en')}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}
