import type { AdventureStep } from '../data/dataStack/adventure'
import type { StepGovernance } from '../data/dataStack/governancePacks'
import type { StepProjectMgmt } from '../data/dataStack/pmPacks'
import type { PmGameLocale } from '../i18n/pmGameLocale'

export interface StepSubmission {
  text: string
  /** Index QCM gouvernance (0 | 1 | 2). */
  govChoice?: number
  /** Index QCM gestion de projet (0 | 1 | 2). */
  pmChoice?: number
  fileName?: string
  fileDataUrl?: string
}

export interface StepEval {
  passed: boolean
  message: string
  correction: string
  govCorrection?: string
  damaRef?: string
  frameworkRef?: string
  scriptPassed: boolean
  govPassed: boolean
  pmPassed: boolean
}

function norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function usableKeywords(keywords: string[]): string[] {
  return keywords.filter((k) => norm(k).replace(/\s+/g, '').length >= 2)
}

function countKeywordHits(textNorm: string, keywords: string[]): number {
  return usableKeywords(keywords).filter((k) => textNorm.includes(norm(k))).length
}

function countPatternHits(raw: string, patterns: string[]): number {
  let hits = 0
  for (const p of patterns) {
    try {
      if (new RegExp(p, 'i').test(raw)) hits += 1
    } catch {
      // ignore
    }
  }
  return hits
}

function expectBaselineOk(step: AdventureStep, raw: string, textNorm: string): boolean {
  if (step.expect === 'sql') {
    return (
      textNorm.includes('select') ||
      textNorm.includes('with ') ||
      textNorm.includes('stg') ||
      textNorm.includes('mart')
    )
  }
  if (step.expect === 'python') {
    return (
      textNorm.includes('import') ||
      textNorm.includes('def ') ||
      textNorm.includes('read_csv') ||
      textNorm.includes('pandas') ||
      textNorm.includes('json') ||
      textNorm.includes('dag') ||
      /[=:]/.test(raw)
    )
  }
  return textNorm.length > 0
}

function evaluateScript(step: AdventureStep, sub: StepSubmission): boolean {
  const v = step.validate
  let passed = true
  const raw = sub.text
  const t = norm(raw)

  if (step.expect === 'screenshot') {
    const needFile = v.requireFile !== false
    if (needFile && !sub.fileName) passed = false
    if (v.minLength && t.length < v.minLength) passed = false
    if (v.mustInclude && v.mustInclude.length > 0) {
      if (!v.mustInclude.every((m) => t.includes(norm(m)))) passed = false
    }
    if (v.keywords && v.keywords.length > 0 && raw.trim()) {
      const usable = usableKeywords(v.keywords)
      const need = Math.min(v.keywordMin ?? 1, usable.length || 1)
      if (usable.length > 0 && countKeywordHits(t, usable) < need) passed = false
    }
    if (v.patterns && v.patterns.length > 0) {
      const need = v.patternMin ?? 1
      if (countPatternHits(raw, v.patterns) < need) passed = false
    }
    return passed
  }

  if (v.minLength && t.length < v.minLength) passed = false
  if (v.mustInclude && v.mustInclude.length > 0) {
    if (!v.mustInclude.every((m) => t.includes(norm(m)))) passed = false
  }
  if (v.keywords && v.keywords.length > 0) {
    const usable = usableKeywords(v.keywords)
    if (usable.length > 0) {
      const need = Math.min(v.keywordMin ?? 1, usable.length)
      if (countKeywordHits(t, usable) < need) passed = false
    }
  }
  if (v.patterns && v.patterns.length > 0) {
    const need = v.patternMin ?? 1
    if (countPatternHits(raw, v.patterns) < need) passed = false
  }
  if (step.expect === 'sql' || step.expect === 'python') {
    if (!expectBaselineOk(step, raw, t)) passed = false
  }
  return passed
}

export function evaluateGovernance(
  gov: StepGovernance | undefined,
  govChoice: number | undefined,
): boolean {
  if (!gov) return true
  if (govChoice === undefined || govChoice === null || Number.isNaN(govChoice)) return false
  return govChoice === gov.correctIndex
}

export function evaluateProjectMgmt(
  pm: StepProjectMgmt | undefined,
  pmChoice: number | undefined,
): boolean {
  if (!pm) return true
  if (pmChoice === undefined || pmChoice === null || Number.isNaN(pmChoice)) return false
  return pmChoice === pm.correctIndex
}

export type EvalMode = 'pm' | 'tech' | 'gov'

export function evaluateStep(
  step: AdventureStep,
  sub: StepSubmission,
  mode: EvalMode = 'tech',
  locale: PmGameLocale = 'fr',
): StepEval {
  const en = locale === 'en'
  if (mode === 'pm') {
    const pm = step.projectMgmt
    const pmPassed = evaluateProjectMgmt(pm, sub.pmChoice)
    const correction = pm
      ? en
        ? `${pm.correction}\n\nCorrect answer: ${pm.options[pm.correctIndex]}\nRef. ${pm.frameworkRef}`
        : `${pm.correction}\n\nBonne réponse : ${pm.options[pm.correctIndex]}\nRéf. ${pm.frameworkRef}`
      : undefined
    return {
      passed: pmPassed,
      message: pmPassed
        ? en
          ? 'Project management passed — solid PM / Agile stance.'
          : 'Gestion de projet validée — bonne posture PM / Agile.'
        : en
          ? 'Project-management MCQ incorrect — read the correction and framework ref.'
          : 'QCM gestion de projet incorrecte — lis la correction et la réf. framework.',
      correction:
        correction ??
        (en ? 'No PM sheet on this task.' : 'Pas de fiche PM sur cette tâche.'),
      frameworkRef: pm?.frameworkRef,
      scriptPassed: true,
      govPassed: true,
      pmPassed,
    }
  }

  if (mode === 'tech') {
    const scriptPassed = evaluateScript(step, sub)
    return {
      passed: scriptPassed,
      message: scriptPassed ? step.feedbackPass : step.feedbackFail,
      correction: step.correction,
      scriptPassed,
      govPassed: true,
      pmPassed: true,
    }
  }

  const gov = step.governance
  const govPassed = evaluateGovernance(gov, sub.govChoice)
  const govCorrection = gov
    ? en
      ? `${gov.correction}\n\nCorrect answer: ${gov.options[gov.correctIndex]}\nRef. ${gov.damaRef}`
      : `${gov.correction}\n\nBonne réponse : ${gov.options[gov.correctIndex]}\nRéf. ${gov.damaRef}`
    : undefined

  return {
    passed: govPassed,
    message: govPassed
      ? en
        ? 'Governance passed — solid data-governance reading of the project case.'
        : 'Gouvernance validée — bonne lecture gouvernance data du cas projet.'
      : en
        ? 'Governance MCQ incorrect — read the correction and the governance reference.'
        : 'QCM gouvernance incorrecte — lis la correction et la référence gouvernance data.',
    correction:
      govCorrection ??
      (en ? 'No governance sheet on this task.' : 'Pas de fiche gouvernance sur cette tâche.'),
    govCorrection,
    damaRef: gov?.damaRef,
    scriptPassed: true,
    govPassed,
    pmPassed: true,
  }
}
