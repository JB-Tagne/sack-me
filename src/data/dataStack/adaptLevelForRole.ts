import type { PmGameLocale } from '../../i18n/pmGameLocale'
import { buildRoleScopedSteps, curatedCount, type AdventureLevel } from './adventure'
import {
  castingChip,
  rebrandMutualisCopy,
  resolveExerciseCasting,
  type MutualisEntity,
  type MutualisEntityId,
} from './mutualisEntities'
import { playableToolsForRole } from './roleContent'
import type { PlayerRoleId, ProjectKind } from './projectPaths'
import { trackForRole } from './projectPaths'
import { roleStoryForPhase, type RoleStory } from './roleStories'
import { toolsForRole } from './roleToolStacks'
import { phaseLabel, type ToolId } from './tools'

export interface AdaptLevelOpts {
  projectKind: ProjectKind
  playerRole: PlayerRoleId
  locale: PmGameLocale
  /** Player home company inside Mutualis Group. */
  homeEntity?: MutualisEntityId
}

function roleDisplayTools(steps: AdventureLevel['steps'], playable: ToolId[]): ToolId[] {
  const fromSteps = [
    ...new Set(steps.map((s) => s.tool).filter((id): id is ToolId => Boolean(id))),
  ]
  if (fromSteps.length > 0) return fromSteps
  return playable.slice(0, 5)
}

function lotLabel(levelId: number, locale: PmGameLocale): string {
  const n = levelId + 1
  return locale === 'en' ? `Batch ${n}` : `Lot ${n}`
}

/** Curated lots 0–5 keep hand-authored steps (and curated PM/gov QCM keys). */
function isCuratedLevel(level: AdventureLevel): boolean {
  return !level.endless && level.id >= 0 && level.id < curatedCount()
}

function alignCuratedStepPhases(level: AdventureLevel): AdventureLevel['steps'] {
  return level.steps.map((step) => ({ ...step, phase: level.phase }))
}

/** Keep curated IDs/QCM; flavor each step with role lens + cross-skill note. */
function flavorCuratedSteps(
  steps: AdventureLevel['steps'],
  opts: {
    story: RoleStory | null
    playerRole: PlayerRoleId
    locale: PmGameLocale
    playable: ToolId[]
  },
): AdventureLevel['steps'] {
  const { story, playerRole, locale, playable } = opts
  const en = locale === 'en'
  const playableSet = new Set(playable)

  return steps.map((step) => {
    const lens = story
      ? en
        ? `Role lens (${playerRole}): ${story.tagline}`
        : `Lunette rôle (${playerRole}) : ${story.tagline}`
      : ''
    const crossSkill =
      step.tool && !playableSet.has(step.tool)
        ? en
          ? 'Cross-skill: this tool is outside your daily stack — still required to deliver at Mutualis.'
          : 'Compétence transverse : cet outil n’est pas ta stack quotidienne — requis pour livrer chez Mutualis.'
        : ''
    const say = [lens, step.say, crossSkill].filter(Boolean).join('\n\n')
    const titleExtra =
      step.tool && !playableSet.has(step.tool)
        ? en
          ? ' · cross-skill'
          : ' · transverse'
        : ''
    return {
      ...step,
      title: `${step.title}${titleExtra}`,
      say,
    }
  })
}

function stepsForRoleLevel(
  level: AdventureLevel,
  playable: ToolId[],
  projectKind: ProjectKind,
  locale: PmGameLocale,
  story: RoleStory | null,
  playerRole: PlayerRoleId,
): AdventureLevel['steps'] {
  if (isCuratedLevel(level)) {
    return flavorCuratedSteps(alignCuratedStepPhases(level), {
      story,
      playerRole,
      locale,
      playable,
    })
  }
  if (playable.length === 0) return level.steps
  const roleSteps = buildRoleScopedSteps(
    level.id,
    level.phase,
    playable,
    projectKind,
    locale,
  )
  return roleSteps.length > 0 ? roleSteps : level.steps
}

function briefProblem(
  story: RoleStory | null,
  castProblem: string,
  levelProblem: string,
  lead: MutualisEntity,
): string {
  if (story) {
    const narrative = rebrandMutualisCopy(story.problem, lead)
    if (narrative === castProblem) return narrative
    return `${narrative}\n\n${castProblem}`
  }
  const base = rebrandMutualisCopy(levelProblem, lead)
  if (base === castProblem || !castProblem) return base
  return `${base}\n\n${castProblem}`
}

/** Adapts intro / brief / tools to role × project × subsidiary story. */
export function adaptLevelForRole(
  level: AdventureLevel,
  opts: AdaptLevelOpts,
): AdventureLevel {
  const { projectKind, playerRole, locale, homeEntity = 'retail' } = opts
  const en = locale === 'en'
  const track = trackForRole(playerRole)
  const story = roleStoryForPhase(projectKind, playerRole, level.phase, locale)
  const cast = resolveExerciseCasting(homeEntity, {
    levelId: level.id,
    phase: level.phase,
    locale,
  })
  const playable = playableToolsForRole(projectKind, playerRole)
  const marketStack = toolsForRole(projectKind, playerRole)
  const stackLine = marketStack.map((t) => t.name).join(' · ')
  const lot = lotLabel(level.id, locale)
  const phaseLbl = phaseLabel(level.phase, locale)

  const steps = stepsForRoleLevel(
    level,
    playable,
    projectKind,
    locale,
    story,
    playerRole,
  )
  const onboardTools = roleDisplayTools(steps, playable)
  const stepObjectives = steps.map((s) => s.title)
  const problemLine = briefProblem(story, cast.domainProblem, level.brief.problem, cast.lead)

  const consigne =
    track === 'governance'
      ? en
        ? 'Before each hands-on: governance decision question → then situational practice on your role stack + data DoD.'
        : 'Avant chaque manipulation : question de gouvernance → puis mise en situation et pratique sur ta stack de rôle + DoD data.'
      : en
        ? 'Before each hands-on: project-management decision question → then situational practice on your role stack + data DoD.'
        : 'Avant chaque manipulation : question de gestion de projet → puis mise en situation et pratique sur ta stack de rôle + DoD data.'

  const basePatch = {
    steps,
    tools: onboardTools,
  }

  if (!story) {
    return {
      ...level,
      ...basePatch,
      title: `${level.title} · ${lot}`,
      intro: en
        ? `${lot} · ${phaseLbl}. Stack: ${stackLine}.`
        : `${lot} · ${phaseLbl}. Stack : ${stackLine}.`,
      brief: {
        ...level.brief,
        consigne,
        context: `${cast.setting}\n\n${rebrandMutualisCopy(level.brief.context, cast.lead)}`,
        problem: problemLine,
        projectName: `${rebrandMutualisCopy(level.brief.projectName, cast.lead)} · ${lot}`,
        objectives:
          stepObjectives.length > 0
            ? stepObjectives.slice(0, 5)
            : level.brief.objectives,
      },
    }
  }

  const objectives = [...stepObjectives, ...story.objectives]
    .map((o) => rebrandMutualisCopy(o, cast.lead))
    .slice(0, 5)

  const projectName = `${rebrandMutualisCopy(story.projectName, cast.lead)} · ${lot} · ${cast.lead.name}`

  return {
    ...level,
    ...basePatch,
    title: `${story.codename} · ${lot} · ${phaseLbl}`,
    intro: en
      ? `${castingChip(cast, locale)}. ${rebrandMutualisCopy(story.tagline, cast.lead)} Scope: ${story.scope}. ${lot} — tools in this batch follow ${phaseLbl}. Stack: ${stackLine}.`
      : `${castingChip(cast, locale)}. ${rebrandMutualisCopy(story.tagline, cast.lead)} Périmètre : ${story.scope}. ${lot} — outils de ce lot en phase ${phaseLbl}. Stack : ${stackLine}.`,
    brief: {
      projectName,
      context: `${cast.setting}\n\n${rebrandMutualisCopy(story.stakes, cast.lead)}\n\n${rebrandMutualisCopy(story.context, cast.lead)}`,
      problem: problemLine,
      objectives,
      consigne,
    },
  }
}
