import { describe, expect, it } from 'vitest'
import { decisionHalfForTrack, startHalfForStep } from './adventureHalf'
import type { AdventureStep } from '../data/dataStack/adventure'

const pmStep = {
  projectMgmt: { question: 'q' },
  governance: undefined,
} as unknown as AdventureStep

const govStep = {
  projectMgmt: undefined,
  governance: { question: 'q' },
} as unknown as AdventureStep

describe('adventureHalf', () => {
  it('picks pm vs gov decision half by track', () => {
    expect(decisionHalfForTrack('pm', pmStep)).toBe('pm')
    expect(decisionHalfForTrack('governance', govStep)).toBe('gov')
    expect(decisionHalfForTrack('pm', {} as AdventureStep)).toBe('tech')
  })

  it('prefers meeting when a periodic meeting exists at global index', () => {
    // Index 3 is a known COPROJ meeting in the bank (see i18nContent tests).
    expect(startHalfForStep(pmStep, 'pm', 'fr', 3)).toBe('meeting')
    expect(startHalfForStep(pmStep, 'pm', 'fr')).toBe('pm')
  })
})
