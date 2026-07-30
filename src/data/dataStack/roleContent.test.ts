import { describe, expect, it } from 'vitest'
import { adaptLevelForRole } from './adaptLevelForRole'
import { curatedCount, getLevel } from './adventure'
import {
  MUTUALIS_ENTITIES,
  resolveExerciseCasting,
} from './mutualisEntities'
import { playableToolsForRole } from './roleContent'
import { preferToolsForRole } from '../../lib/preferToolsForRole'
import { rolesForProject } from './projectPaths'
import { allStoryKeys, roleStory } from './roleStories'

describe('role content adaptation', () => {
  it('exposes playable tools from market stacks', () => {
    const baIt = playableToolsForRole('it', 'business-analyst')
    expect(baIt).toContain('jira')
    expect(baIt).toContain('sql')
    expect(baIt).toContain('powerbi')
    expect(baIt).not.toContain('excel' as never)

    const gov = playableToolsForRole('data-ai', 'data-governance-manager')
    expect(gov).toContain('datagalaxy')
  })

  it('biases prefer tools toward role playable stack', () => {
    const prefer = preferToolsForRole({}, playableToolsForRole('it', 'product-owner'), 4)
    expect(prefer.length).toBeGreaterThan(0)
    expect(prefer.every((id) => ['jira', 'confluence', 'sql', 'powerbi'].includes(id))).toBe(
      true,
    )
  })

  it('keeps curated steps and QCM keys for lots 0–5 when a role is set', () => {
    const raw = getLevel(0, [], 'fr', 'pm')
    expect(raw.steps.map((s) => s.id)).toEqual(['l0-open', 'l0-filter', 'l0-sql'])

    const adapted = adaptLevelForRole(raw, {
      projectKind: 'it',
      playerRole: 'business-analyst',
      locale: 'fr',
      homeEntity: 'bank',
    })

    expect(adapted.steps.map((s) => s.id)).toEqual(['l0-open', 'l0-filter', 'l0-sql'])
    expect(adapted.title).toContain('Lot 1')
    expect(adapted.tools).toEqual(expect.arrayContaining(['python', 'sql']))
    for (const step of adapted.steps) {
      expect(step.projectMgmt?.question?.length).toBeGreaterThan(10)
      expect(step.governance?.question?.length).toBeGreaterThan(10)
    }
  })

  it('uses role-scoped exercises only for endless levels (6+)', () => {
    const raw = getLevel(6, ['sql', 'python'], 'fr', 'pm')
    expect(raw.endless).toBe(true)

    const adapted = adaptLevelForRole(raw, {
      projectKind: 'data-ai',
      playerRole: 'technico-fonctionnel',
      locale: 'fr',
      homeEntity: 'retail',
    })

    expect(adapted.steps.every((s) => s.id.startsWith('e6-'))).toBe(true)
    expect(adapted.steps.length).toBeGreaterThanOrEqual(2)
    const tools = adapted.steps.map((s) => s.tool).filter(Boolean)
    expect(new Set(tools).size).toBe(tools.length)
  })

  it('aligns curated step phases with batch phase', () => {
    const adapted = adaptLevelForRole(getLevel(4, [], 'fr', 'pm'), {
      projectKind: 'data-ai',
      playerRole: 'data-steward',
      locale: 'fr',
      homeEntity: 'retail',
    })
    for (const step of adapted.steps) {
      expect(step.phase).toBe('gouvernance')
    }
  })

  it('varies curated step sets across lots 0–5', () => {
    const role = {
      projectKind: 'data-ai' as const,
      playerRole: 'technico-fonctionnel' as const,
      locale: 'fr' as const,
      homeEntity: 'retail' as const,
    }
    const stepSets: string[][] = []
    for (let id = 0; id < curatedCount(); id++) {
      const adapted = adaptLevelForRole(getLevel(id, [], 'fr', 'pm'), role)
      stepSets.push(adapted.steps.map((s) => s.id))
      expect(adapted.title).toContain(`Lot ${id + 1}`)
      expect(adapted.steps.length).toBeGreaterThanOrEqual(2)
    }
    for (let i = 0; i < stepSets.length; i++) {
      for (let j = i + 1; j < stepSets.length; j++) {
        expect(stepSets[i]).not.toEqual(stepSets[j]!)
      }
    }
  })

  it('varies Mutualis entity casting by level and home company', () => {
    const a = resolveExerciseCasting('retail', { levelId: 0, phase: 'ingestion', locale: 'fr' })
    const b = resolveExerciseCasting('energy', { levelId: 3, phase: 'ops', locale: 'fr' })
    expect(a.home.name).toBe('Mutualis Retail')
    expect(b.home.name).toBe('Mutualis Energy')
    expect(a.domainProblem.length).toBeGreaterThan(10)
    expect(b.domainProblem).not.toBe(a.domainProblem)
    expect(MUTUALIS_ENTITIES).toHaveLength(8)
  })

  it('adapts briefing with home entity, story problem, and domain beat', () => {
    const raw = getLevel(0, [], 'fr', 'pm')
    const adapted = adaptLevelForRole(raw, {
      projectKind: 'it',
      playerRole: 'scrum-master',
      locale: 'fr',
      homeEntity: 'assurance',
    })
    const story = roleStory('it', 'scrum-master', 'fr')!
    expect(adapted.brief.context).toMatch(/Mutualis Assurance|Mutualis Group/)
    expect(adapted.brief.problem).not.toContain('zéro industrialisation')
    expect(adapted.brief.problem.length).toBeGreaterThan(20)
    expect(adapted.title).toContain(story.codename)
    expect(adapted.intro).toContain('Jira')
  })

  it('uses governance consigne for stewardship roles', () => {
    const raw = getLevel(0, [], 'fr', 'governance')
    const adapted = adaptLevelForRole(raw, {
      projectKind: 'data-ai',
      playerRole: 'data-steward',
      locale: 'fr',
      homeEntity: 'agro',
    })
    expect(adapted.brief.consigne.toLowerCase()).toContain('gouvernance')
    expect(adapted.brief.context).toMatch(/Mutualis Agro|Mutualis Group/)
  })

  it('keeps IT stories on systems scopes and data-ai on analytics/AI', () => {
    const itPo = roleStory('it', 'product-owner', 'fr')!
    expect(itPo.scope.toLowerCase()).toMatch(/caisse|crm|si|api|omnicanal/)
    expect(itPo.scope.toLowerCase()).not.toMatch(/deep learning|feature store/)

    const aiGov = roleStory('data-ai', 'ai-governance-manager', 'fr')!
    expect(aiGov.scope.toLowerCase()).toMatch(/ia|ml|deep learning/)
    expect(aiGov.problem.toLowerCase()).toMatch(/modèle|assistant|promo|biais|stock/)
  })

  it('covers every offered role × project with a story', () => {
    const keys = new Set(allStoryKeys())
    for (const kind of ['it', 'data-ai'] as const) {
      for (const role of rolesForProject(kind)) {
        expect(keys.has(`${kind}::${role.id}`)).toBe(true)
        const s = roleStory(kind, role.id, 'fr')
        expect(s?.codename.length).toBeGreaterThan(3)
        expect(s?.problem.length).toBeGreaterThan(20)
      }
    }
  })

  it('enriches every curated step with PM and governance packs before practice', () => {
    const lvl = getLevel(0, [], 'fr', 'pm')
    expect(lvl.steps.length).toBeGreaterThan(0)
    for (const step of lvl.steps) {
      expect(step.projectMgmt?.question?.length).toBeGreaterThan(10)
      expect(step.governance?.question?.length).toBeGreaterThan(10)
    }
  })
})
