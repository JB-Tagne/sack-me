import { describe, expect, it } from 'vitest'
import type { AdventureStep } from '../data/dataStack/adventure'
import { curatedCount, getLevel } from '../data/dataStack/adventure'
import { evaluateStep } from './adventureEngine'
import { resolveResumePhase, type AdventureProgress } from './adventureStorage'

function baseStep(partial: Partial<AdventureStep> & Pick<AdventureStep, 'id' | 'expect'>): AdventureStep {
  return {
    title: 't',
    say: 's',
    do: 'd',
    how: ['h'],
    feedbackPass: 'ok',
    feedbackFail: 'ko',
    correction: 'corr',
    validate: {},
    ...partial,
  }
}

describe('evaluateStep', () => {
  it('rejects trivial single-char keywords and requires real hits', () => {
    const step = baseStep({
      id: 'k',
      expect: 'text',
      validate: { keywords: ['1', 'sales'], keywordMin: 1 },
    })
    expect(evaluateStep(step, { text: '1' }, 'tech').passed).toBe(false)
    expect(evaluateStep(step, { text: 'département SALES' }, 'tech').passed).toBe(true)
  })

  it('requires mustInclude for SQL aggregations', () => {
    const step = baseStep({
      id: 'sql',
      expect: 'sql',
      validate: {
        mustInclude: ['select', 'group by'],
        keywords: ['commune', 'count'],
        keywordMin: 1,
      },
    })
    expect(evaluateStep(step, { text: 'select * from t' }, 'tech').passed).toBe(false)
    expect(
      evaluateStep(
        step,
        { text: 'SELECT Commune, COUNT(*) FROM t GROUP BY Commune' },
        'tech',
      ).passed,
    ).toBe(true)
  })

  it('enforces python baseline markers', () => {
    const step = baseStep({
      id: 'py',
      expect: 'python',
      validate: { minLength: 5 },
    })
    expect(evaluateStep(step, { text: 'hello world xx' }, 'tech').passed).toBe(false)
    expect(evaluateStep(step, { text: 'import pandas as pd' }, 'tech').passed).toBe(true)
  })

  it('requires screenshot file when requireFile', () => {
    const step = baseStep({
      id: 'shot',
      expect: 'screenshot',
      validate: { requireFile: true, minLength: 3 },
    })
    expect(evaluateStep(step, { text: 'sum turnover' }, 'tech').passed).toBe(false)
    expect(
      evaluateStep(step, { text: 'sum turnover', fileName: 'dash.png' }, 'tech').passed,
    ).toBe(true)
  })

  it('matches patterns for active headcount', () => {
    const step = baseStep({
      id: 'filter',
      expect: 'text',
      validate: {
        keywords: ['sales'],
        keywordMin: 1,
        patterns: ['\\b500\\b'],
        patternMin: 1,
      },
    })
    expect(evaluateStep(step, { text: 'SALES actifs' }, 'tech').passed).toBe(false)
    expect(evaluateStep(step, { text: '500 actifs SALES' }, 'tech').passed).toBe(true)
  })

  it('requires correct governance MCQ choice', () => {
    const step = baseStep({
      id: 'l0-open',
      expect: 'python',
      validate: { minLength: 10, keywords: ['pandas'], keywordMin: 1 },
      governance: {
        link: 'catalogue',
        question: 'Qui est owner ?',
        options: ['Mauvaise A', 'Bonne B', 'Mauvaise C'],
        correctIndex: 1,
        correction: 'B car Owner métier + catalogue (gouvernance · rôles / métadonnées).',
        damaRef: 'Référentiel gouvernance · Rôles · Métadonnées',
      },
    })
    expect(evaluateStep(step, { text: '', govChoice: 0 }, 'gov').govPassed).toBe(false)
    expect(evaluateStep(step, { text: '', govChoice: 0 }, 'gov').passed).toBe(false)
    const ok = evaluateStep(step, { text: '', govChoice: 1 }, 'gov')
    expect(ok.passed).toBe(true)
    expect(ok.damaRef).toMatch(/gouvernance|Governance|governance/i)
    expect(ok.correction).toContain('Bonne réponse')
  })

  it('requires correct project-mgmt MCQ choice', () => {
    const step = baseStep({
      id: 'l0-open',
      expect: 'python',
      validate: { minLength: 5 },
      projectMgmt: {
        link: 'discovery',
        question: 'Que faire ?',
        options: ['Gantt figé', 'Discovery sources', 'Attendre cloud'],
        correctIndex: 1,
        correction: 'Réduire l’incertitude utile.',
        frameworkRef: 'Scrum · Project management',
        scenarioTwist: 'Le COMEX avance de 2 semaines.',
      },
    })
    expect(evaluateStep(step, { text: '', pmChoice: 0 }, 'pm').pmPassed).toBe(false)
    expect(evaluateStep(step, { text: '', pmChoice: 0 }, 'pm').passed).toBe(false)
    const ok = evaluateStep(step, { text: '', pmChoice: 1 }, 'pm')
    expect(ok.passed).toBe(true)
    expect(ok.frameworkRef).toMatch(/Gestion de projet|Project management/i)
    expect(ok.correction).toContain('Bonne réponse')
  })
})

describe('resolveResumePhase', () => {
  const empty: AdventureProgress = {
    levelId: 0,
    stepIndex: 0,
    completedStepIds: [],
    completedLevelIds: [],
    drafts: {},
    toolStats: {},
    xp: 0,
    career: { careerScore: 0, fireRisk: 18, wins: 0, fails: 0 },
    started: false,
    phase: 'career-pick',
    stepHalf: 'pm',
  }

  it('returns career-pick when not started and path missing', () => {
    expect(resolveResumePhase(empty)).toBe('career-pick')
  })

  it('returns welcome when not started but project path chosen', () => {
    expect(
      resolveResumePhase({
        ...empty,
        projectKind: 'it',
        playerRole: 'business-analyst',
        homeEntity: 'retail',
      }),
    ).toBe('welcome')
  })

  it('restores play when saved', () => {
    expect(resolveResumePhase({ ...empty, started: true, phase: 'play' })).toBe('play')
  })

  it('maps feedback to play (eval not persisted)', () => {
    expect(resolveResumePhase({ ...empty, started: true, phase: 'feedback' })).toBe('play')
  })

  it('infers play from legacy started+welcome with completed steps', () => {
    expect(
      resolveResumePhase({
        ...empty,
        started: true,
        phase: 'welcome',
        completedStepIds: ['l0-open'],
        stepIndex: 0,
      }),
    ).toBe('play')
  })
})

describe('getLevel', () => {
  it('exposes curated levels 0..5', () => {
    expect(curatedCount()).toBe(6)
    expect(getLevel(0).id).toBe(0)
    expect(getLevel(5).endless).toBeUndefined()
  })

  it('builds endless levels after curated', () => {
    const lvl = getLevel(6)
    expect(lvl.endless).toBe(true)
    expect(lvl.steps.length).toBeGreaterThan(0)
    expect(lvl.steps.every((s) => s.trap)).toBe(true)
  })

  it('attaches governance MCQ to every curated step', () => {
    for (let id = 0; id < curatedCount(); id++) {
      const lvl = getLevel(id)
      for (const s of lvl.steps) {
        expect(s.governance?.options).toHaveLength(3)
        expect(s.governance?.correctIndex).toBeGreaterThanOrEqual(0)
        expect(s.governance?.correctIndex).toBeLessThan(3)
        expect(s.governance?.damaRef).toMatch(/gouvernance|Governance|Référentiel/i)
      }
    }
  })

  it('attaches project-mgmt MCQ to every curated step', () => {
    for (let id = 0; id < curatedCount(); id++) {
      const lvl = getLevel(id)
      for (const s of lvl.steps) {
        expect(s.projectMgmt?.options).toHaveLength(3)
        expect(s.projectMgmt?.correctIndex).toBeGreaterThanOrEqual(0)
        expect(s.projectMgmt?.correctIndex).toBeLessThan(3)
        expect(s.projectMgmt?.frameworkRef.length).toBeGreaterThan(0)
        expect(s.projectMgmt?.question.length).toBeGreaterThan(0)
        expect(s.projectMgmt?.scenarioTwist?.length).toBeGreaterThan(0)
      }
    }
  })

  it('attaches data DoD checklist to every step', () => {
    for (const id of [0, 1, curatedCount(), curatedCount() + 1, curatedCount() + 3]) {
      const lvl = getLevel(id)
      for (const s of lvl.steps) {
        expect(s.dataDoD?.length).toBeGreaterThan(2)
        expect(s.dataDoD?.some((x) => /KPI|succès|Owner|qualité|SQL|Python|RGPD|accès/i.test(x))).toBe(
          true,
        )
      }
    }
  })

  it('keeps core technical practice in endless levels while mixing tools', () => {
    const toolsSeen = new Set<string>()
    let codeSteps = 0
    let total = 0
    for (let id = curatedCount(); id < curatedCount() + 12; id++) {
      const lvl = getLevel(id)
      expect(lvl.steps.length).toBeGreaterThanOrEqual(2)
      const firstTool = lvl.steps[0]?.tool
      expect(['sql', 'python', 'bigquery', 'dbt', 'spark', 'databricks']).toContain(firstTool)
      for (const s of lvl.steps) {
        total++
        if (s.tool) toolsSeen.add(s.tool)
        if (
          s.tool &&
          ['sql', 'python', 'bigquery', 'dbt', 'spark', 'databricks', 'cloudsql', 'airflow'].includes(
            s.tool,
          )
        ) {
          codeSteps++
        }
      }
    }
    expect(codeSteps / total).toBeGreaterThan(0.55)
    expect(toolsSeen.size).toBeGreaterThanOrEqual(3)
  })

  it('auto-varies PM packs across endless levels', () => {
    const a = getLevel(6).steps[0]?.projectMgmt
    const b = getLevel(9).steps[0]?.projectMgmt
    expect(a?.scenarioTwist).toBeTruthy()
    expect(b?.scenarioTwist).toBeTruthy()
    // Intensité haute : pression M… dans le twist
    const hot = getLevel(10).steps[0]?.projectMgmt
    expect(hot?.scenarioTwist).toMatch(/Pression M10|sous tension|Twist/)
  })
})
