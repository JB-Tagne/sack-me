/** Carrière Mutualis — évolution vs risque de licenciement. */

import type { PmGameLocale } from '../i18n/pmGameLocale'
import { pickLocale } from '../i18n/pmGameLocale'

export type CareerTitleId =
  | 'junior'
  | 'pm'
  | 'senior'
  | 'lead'
  | 'head'

export interface CareerTitle {
  id: CareerTitleId
  /** Grade affiché (évolue avec le score). */
  label: string
  /** Seuil de careerScore pour atteindre ce titre. */
  minScore: number
  blurb: string
}

const CAREER_TITLES_FR: readonly CareerTitle[] = [
  {
    id: 'junior',
    label: 'Junior',
    minScore: 0,
    blurb: 'Tu intègres la squad Mutualis. On te regarde.',
  },
  {
    id: 'pm',
    label: 'Confirmé',
    minScore: 40,
    blurb: 'Tu portes backlog, livrables et arbitrages métier.',
  },
  {
    id: 'senior',
    label: 'Senior',
    minScore: 100,
    blurb: 'Tu sécurises les Increments sous pression COMEX.',
  },
  {
    id: 'lead',
    label: 'Lead',
    minScore: 180,
    blurb: 'Tu fais grandir l’équipe et le système de delivery.',
  },
  {
    id: 'head',
    label: 'Head',
    minScore: 280,
    blurb: 'Tu incarnes la trajectoire Mutualis data & IA.',
  },
] as const

const CAREER_TITLES_EN: readonly CareerTitle[] = [
  {
    id: 'junior',
    label: 'Junior',
    minScore: 0,
    blurb: 'You join the Mutualis squad. Eyes are on you.',
  },
  {
    id: 'pm',
    label: 'Mid-level',
    minScore: 40,
    blurb: 'You own backlog, deliverables and business trade-offs.',
  },
  {
    id: 'senior',
    label: 'Senior',
    minScore: 100,
    blurb: 'You secure Increments under executive pressure.',
  },
  {
    id: 'lead',
    label: 'Lead',
    minScore: 180,
    blurb: 'You grow the team and the delivery system.',
  },
  {
    id: 'head',
    label: 'Head',
    minScore: 280,
    blurb: 'You embody Mutualis data & AI delivery.',
  },
] as const

/** @deprecated Prefer titleForScore(score, locale) */
export const CAREER_TITLES = CAREER_TITLES_FR

export function careerTitles(locale: PmGameLocale = 'fr'): readonly CareerTitle[] {
  return pickLocale(locale, CAREER_TITLES_FR, CAREER_TITLES_EN)
}

export interface CareerState {
  /** Points d’évolution (bonnes réponses). */
  careerScore: number
  /** Risque de licenciement 0–100 (mauvaises réponses). */
  fireRisk: number
  /** Compteur de validations réussies (tous modes). */
  wins: number
  /** Compteur d’échecs. */
  fails: number
}

export const EMPTY_CAREER: CareerState = {
  careerScore: 0,
  fireRisk: 18,
  wins: 0,
  fails: 0,
}

export type CareerMode = 'pm' | 'tech' | 'gov' | 'meeting'

const PASS_POINTS: Record<CareerMode, number> = {
  pm: 8,
  tech: 10,
  gov: 9,
  meeting: 5,
}

const FAIL_RISK: Record<CareerMode, number> = {
  pm: 14,
  tech: 12,
  gov: 13,
  meeting: 0,
}

const PASS_RELIEF: Record<CareerMode, number> = {
  pm: 6,
  tech: 5,
  gov: 6,
  meeting: 3,
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function titleForScore(score: number, locale: PmGameLocale = 'fr'): CareerTitle {
  const titles = careerTitles(locale)
  let current = titles[0]!
  for (const t of titles) {
    if (score >= t.minScore) current = t
  }
  return current
}

/**
 * Libellé HUD « Poste » : rôle choisi + grade qui évolue avec le score.
 * Ex. « Product Owner · Junior » → « Product Owner · Senior ».
 */
export function posteLabel(
  score: number,
  locale: PmGameLocale = 'fr',
  roleLabel?: string | null,
): string {
  const grade = titleForScore(score, locale).label
  const role = roleLabel?.trim()
  if (role) return `${role} · ${grade}`
  return locale === 'en' ? `Mutualis · ${grade}` : `Mutualis · ${grade}`
}

export function nextTitle(score: number, locale: PmGameLocale = 'fr'): CareerTitle | null {
  const titles = careerTitles(locale)
  const cur = titleForScore(score, locale)
  const idx = titles.findIndex((t) => t.id === cur.id)
  return titles[idx + 1] ?? null
}

export function applyCareerOutcome(
  state: CareerState,
  passed: boolean,
  mode: CareerMode,
): CareerState {
  if (passed) {
    return {
      careerScore: state.careerScore + PASS_POINTS[mode],
      fireRisk: clamp(state.fireRisk - PASS_RELIEF[mode], 0, 100),
      wins: state.wins + 1,
      fails: state.fails,
    }
  }
  return {
    careerScore: state.careerScore,
    fireRisk: clamp(state.fireRisk + FAIL_RISK[mode], 0, 100),
    wins: state.wins,
    fails: state.fails + 1,
  }
}

export function careerPassLine(
  state: CareerState,
  mode: CareerMode,
  locale: PmGameLocale = 'fr',
): string {
  const title = titleForScore(state.careerScore, locale)
  const nxt = nextTitle(state.careerScore, locale)
  const gap = nxt ? Math.max(0, nxt.minScore - state.careerScore) : 0
  const modeBit =
    locale === 'en'
      ? mode === 'pm'
        ? 'Your PM call reassures the squad.'
        : mode === 'gov'
          ? 'Your governance read protects Mutualis.'
          : 'Your technical deliverable stands in review.'
      : mode === 'pm'
        ? 'Ton arbitrage PM rassure la squad.'
        : mode === 'gov'
          ? 'Ta lecture gouvernance protège Mutualis.'
          : 'Ton livrable technique tient la revue.'
  if (state.fireRisk <= 8) {
    return locale === 'en'
      ? `${modeBit} HR trust is green. Grade: ${title.label}.`
      : `${modeBit} Confiance RH au vert. Grade : ${title.label}.`
  }
  if (nxt && gap <= PASS_POINTS[mode] * 2) {
    return locale === 'en'
      ? `${modeBit} Next step: ${nxt.label} (~${gap} pts left).`
      : `${modeBit} Prochaine marche : ${nxt.label} (encore ~${gap} pts).`
  }
  return locale === 'en'
    ? `${modeBit} Growth: ${title.label}. Layoff risk ↓ ${state.fireRisk}%.`
    : `${modeBit} Évolution : ${title.label}. Risque de licenciement ↓ ${state.fireRisk} %.`
}

function modeLabel(mode: CareerMode, locale: PmGameLocale): string {
  if (locale === 'en') {
    if (mode === 'pm') return 'PM decision'
    if (mode === 'gov') return 'governance decision'
    return 'hands-on practice'
  }
  if (mode === 'pm') return 'décision PM'
  if (mode === 'gov') return 'décision gouvernance'
  return 'pratique technique'
}

export function careerFailLine(
  state: CareerState,
  mode: CareerMode,
  locale: PmGameLocale = 'fr',
): string {
  const title = titleForScore(state.careerScore, locale)
  const half = modeLabel(mode, locale)
  if (state.fireRisk >= 100) {
    return locale === 'en'
      ? `HR alert: layoff imminent. ${title.label} under performance plan — fix this now.`
      : `Alerte RH : licenciement imminent. ${title.label} sous plan de performance — corrige vite.`
  }
  if (state.fireRisk >= 75) {
    return locale === 'en'
      ? `Red flag. Execs noted the failed ${half}. Layoff risk ${state.fireRisk}% — ${title.label} is fragile.`
      : `Signal rouge. Le COMEX note l’échec (${half}). Risque de licenciement ${state.fireRisk} % — ${title.label} fragile.`
  }
  if (state.fireRisk >= 50) {
    return locale === 'en'
      ? `Heat is rising. Bad call (${half}): risk ${state.fireRisk}%. Read the correction to keep your seat.`
      : `Ça chauffe. Mauvaise ${half} : risque ${state.fireRisk} %. Lis la correction pour sauver ta place.`
  }
  return locale === 'en'
    ? `Fail logged. Layoff risk ${state.fireRisk}%. You remain ${title.label} — for now.`
    : `Échec enregistré. Risque de licenciement ${state.fireRisk} %. Tu restes ${title.label} — pour l’instant.`
}

/**
 * Niveau d'alerte narratif déclenché après un échec selon le fireRisk résultant.
 * - 'danger'  : 50–74 %  → signalement COMEX, ambiance tendue
 * - 'warning' : 75–79 %  → réunion dernier avertissement
 * - 'notice'  : 80–99 %  → préavis de licenciement (peut encore se rattraper)
 * - 'fired'   : 100 %    → licenciement effectif, fin de partie
 * - null      : < 50 %   → aucune alerte spéciale
 */
export type FireAlertLevel = 'danger' | 'warning' | 'notice' | 'fired' | null

export function fireAlertLevel(
  _prevRisk: number,
  nextRisk: number,
): FireAlertLevel {
  if (nextRisk >= 100) return 'fired'
  if (nextRisk >= 80) return 'notice'
  if (nextRisk >= 75) return 'warning'
  if (nextRisk >= 50) return 'danger'
  return null
}

export function normalizeCareer(partial?: Partial<CareerState> | null): CareerState {
  if (!partial) return { ...EMPTY_CAREER }
  const rawFire = Number(partial.fireRisk)
  return {
    careerScore: Math.max(0, Number(partial.careerScore) || 0),
    // Ne pas traiter 0 comme « falsy » → sinon le risque remonte artificiellement à 18 au reload
    fireRisk: clamp(Number.isFinite(rawFire) ? rawFire : EMPTY_CAREER.fireRisk, 0, 100),
    wins: Math.max(0, Number(partial.wins) || 0),
    fails: Math.max(0, Number(partial.fails) || 0),
  }
}
