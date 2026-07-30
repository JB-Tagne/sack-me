import { describe, expect, it } from 'vitest'
import { getLevel } from './adventure'
import { PRACTICE_EXERCISES, resolvePracticeExercise } from './exercises'
import { PRACTICE_EXERCISES_EN } from './exercises.en'
import { CURATED_STEPS_EN } from './adventureCurated.en'
import { getMeetingForStep, resolveComexMeeting } from './meetingBank'

describe('i18n exercises and meetings', () => {
  it('covers every practice exercise with an EN overlay', () => {
    for (const ex of PRACTICE_EXERCISES) {
      expect(PRACTICE_EXERCISES_EN[ex.id], `missing EN for ${ex.id}`).toBeTruthy()
      const resolved = resolvePracticeExercise(ex, 'en')
      expect(resolved.title).toBe(PRACTICE_EXERCISES_EN[ex.id]!.title)
      expect(resolved.context).toBe(PRACTICE_EXERCISES_EN[ex.id]!.context)
      expect(resolved.description).toBe(PRACTICE_EXERCISES_EN[ex.id]!.description)
    }
  })

  it('covers every curated step with an EN overlay', () => {
    for (let id = 0; id < 6; id++) {
      const fr = getLevel(id, [], 'fr', 'pm')
      const en = getLevel(id, [], 'en', 'pm')
      for (const step of fr.steps) {
        expect(CURATED_STEPS_EN[step.id], `missing EN for ${step.id}`).toBeTruthy()
      }
      for (let i = 0; i < fr.steps.length; i++) {
        expect(en.steps[i]!.title).toBe(CURATED_STEPS_EN[fr.steps[i]!.id]!.title)
        expect(en.steps[i]!.say).toBe(CURATED_STEPS_EN[fr.steps[i]!.id]!.say)
        expect(en.steps[i]!.do).not.toMatch(/Colle |Télécharge |Écris /)
      }
      expect(en.brief.consigne.toLowerCase()).not.toContain('télécharge')
    }
  })

  it('serves English meetings when locale is en', () => {
    const fr = getMeetingForStep(3, 'fr')
    const en = getMeetingForStep(3, 'en')
    expect(fr).toBeTruthy()
    expect(en).toBeTruthy()
    expect(en!.title).not.toBe(fr!.title)
    expect(en!.questions[0]!.question).not.toBe(fr!.questions[0]!.question)
    expect(en!.questions[0]!.correctIndex).toBe(fr!.questions[0]!.correctIndex)
  })

  it('serves English COMEX meetings', () => {
    const fr = resolveComexMeeting('comex-danger', 'fr')
    const en = resolveComexMeeting('comex-danger', 'en')
    expect(en.title).not.toBe(fr.title)
    expect(en.questions).toHaveLength(5)
    expect(en.questions[0]!.correctIndex).toBe(fr.questions[0]!.correctIndex)
  })

  it('localizes endless exercise steps in English', () => {
    const fr = getLevel(6, ['sql', 'python'], 'fr', 'pm')
    const en = getLevel(6, ['sql', 'python'], 'en', 'pm')
    expect(en.endless).toBe(true)
    expect(en.steps[0]!.say).toMatch(/Mutualis situation/)
    expect(fr.steps[0]!.say).toMatch(/Situation Mutualis/)
  })
})
