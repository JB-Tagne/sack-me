import { describe, expect, it } from 'vitest'
import {
  applyCareerOutcome,
  EMPTY_CAREER,
  normalizeCareer,
  posteLabel,
  titleForScore,
} from './careerTrack'

describe('careerTrack', () => {
  it('raises fire risk on fail and lowers it on pass', () => {
    const afterFail = applyCareerOutcome(EMPTY_CAREER, false, 'pm')
    expect(afterFail.fireRisk).toBeGreaterThan(EMPTY_CAREER.fireRisk)
    expect(afterFail.fails).toBe(1)

    const afterPass = applyCareerOutcome(afterFail, true, 'tech')
    expect(afterPass.fireRisk).toBeLessThan(afterFail.fireRisk)
    expect(afterPass.careerScore).toBeGreaterThan(afterFail.careerScore)
    expect(afterPass.wins).toBe(1)
  })

  it('promotes title when career score rises', () => {
    expect(titleForScore(0).id).toBe('junior')
    expect(titleForScore(0).label).toBe('Junior')
    expect(titleForScore(40).id).toBe('pm')
    expect(titleForScore(100).id).toBe('senior')
    expect(titleForScore(280).id).toBe('head')
  })

  it('builds poste label from role + evolving grade', () => {
    expect(posteLabel(0, 'fr', 'Product Owner')).toBe('Product Owner · Junior')
    expect(posteLabel(100, 'fr', 'Product Owner')).toBe('Product Owner · Senior')
    expect(posteLabel(0, 'fr')).toBe('Mutualis · Junior')
  })

  it('preserves fireRisk 0 on normalize (does not fall back to 18)', () => {
    expect(normalizeCareer({ careerScore: 20, fireRisk: 0, wins: 3, fails: 0 }).fireRisk).toBe(0)
  })

  it('caps fire risk at 100', () => {
    let s = { ...EMPTY_CAREER, fireRisk: 95 }
    s = applyCareerOutcome(s, false, 'pm')
    expect(s.fireRisk).toBe(100)
  })
})
