/** Locale PM Game — fr | en, persistée localement. */

export type PmGameLocale = 'fr' | 'en'

const KEY = 'my-pro-hub-pm-game-locale'

export function loadPmGameLocale(): PmGameLocale {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'en' || v === 'fr') return v
  } catch {
    /* ignore */
  }
  return 'fr'
}

export function savePmGameLocale(locale: PmGameLocale): void {
  try {
    localStorage.setItem(KEY, locale)
  } catch {
    /* ignore */
  }
}

export function pickLocale<T>(locale: PmGameLocale, fr: T, en: T): T {
  return locale === 'en' ? en : fr
}
