import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadPmGameLocale,
  savePmGameLocale,
  type PmGameLocale,
} from './pmGameLocale'
import { pmGameUi } from './pmGameUi'

interface PmGameI18nValue {
  locale: PmGameLocale
  setLocale: (locale: PmGameLocale) => void
  t: (key: string) => string
}

const PmGameI18nContext = createContext<PmGameI18nValue | null>(null)

export function PmGameI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<PmGameLocale>(() => loadPmGameLocale())

  const setLocale = useCallback((next: PmGameLocale) => {
    setLocaleState(next)
    savePmGameLocale(next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<PmGameI18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => pmGameUi(locale, key),
    }),
    [locale, setLocale],
  )

  return (
    <PmGameI18nContext.Provider value={value}>{children}</PmGameI18nContext.Provider>
  )
}

export function usePmGameI18n(): PmGameI18nValue {
  const ctx = useContext(PmGameI18nContext)
  if (ctx) return ctx
  return {
    locale: loadPmGameLocale(),
    setLocale: savePmGameLocale,
    t: (key: string) => pmGameUi(loadPmGameLocale(), key),
  }
}
