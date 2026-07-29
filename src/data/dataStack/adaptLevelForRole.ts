import type { PmGameLocale } from '../../i18n/pmGameLocale'
import type { AdventureLevel } from './adventure'
import {
  castingChip,
  rebrandMutualisCopy,
  resolveExerciseCasting,
  type MutualisEntityId,
} from './mutualisEntities'
import { playableToolsForRole } from './roleContent'
import type { PlayerRoleId, ProjectKind } from './projectPaths'
import { trackForRole } from './projectPaths'
import { roleStoryForPhase } from './roleStories'
import { toolsForRole } from './roleToolStacks'
import { phaseLabel, type ToolId } from './tools'

export interface AdaptLevelOpts {
  projectKind: ProjectKind
  playerRole: PlayerRoleId
  locale: PmGameLocale
  /** Entreprise d’affectation du joueur dans Mutualis Group. */
  homeEntity?: MutualisEntityId
}

/** Adapte intro / brief / outils d’onboarding à l’histoire rôle × projet × filiale. */
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

  const fromSteps = [
    ...new Set(
      level.steps
        .map((s) => s.tool)
        .filter((id): id is ToolId => Boolean(id)),
    ),
  ]
  const intersection = level.tools.filter((t) => playable.includes(t))
  const onboardTools: ToolId[] =
    fromSteps.length > 0
      ? fromSteps
      : intersection.length > 0
        ? intersection
        : playable.length > 0
          ? playable.slice(0, Math.min(4, playable.length))
          : level.tools

  const consigne =
    track === 'governance'
      ? en
        ? 'Before each hands-on: governance decision question → then situational practice on your role stack + data DoD.'
        : 'Avant chaque manipulation : question de gouvernance → puis mise en situation et pratique sur ta stack de rôle + DoD data.'
      : en
        ? 'Before each hands-on: project-management decision question → then situational practice on your role stack + data DoD.'
        : 'Avant chaque manipulation : question de gestion de projet → puis mise en situation et pratique sur ta stack de rôle + DoD data.'

  if (!story) {
    return {
      ...level,
      tools: onboardTools,
      brief: {
        ...level.brief,
        consigne,
        context: `${cast.setting}\n\n${rebrandMutualisCopy(level.brief.context, cast.lead)}`,
        problem: cast.domainProblem,
        projectName: rebrandMutualisCopy(level.brief.projectName, cast.lead),
      },
    }
  }

  const labeledPhase = phaseLabel(level.phase, locale)
  const phaseLabelBit = en ? `Phase focus: ${labeledPhase}.` : `Focus phase : ${labeledPhase}.`
  const objectives = [...story.objectives, ...level.brief.objectives]
    .map((o) => rebrandMutualisCopy(o, cast.lead))
    .slice(0, 5)

  const projectName = `${rebrandMutualisCopy(story.projectName, cast.lead)} · ${cast.lead.name}`

  return {
    ...level,
    title: `${story.codename} · ${cast.lead.name}`,
    intro: en
      ? `${castingChip(cast, locale)}. ${rebrandMutualisCopy(story.tagline, cast.lead)} Scope: ${story.scope}. Stack: ${stackLine}. ${phaseLabelBit}`
      : `${castingChip(cast, locale)}. ${rebrandMutualisCopy(story.tagline, cast.lead)} Périmètre : ${story.scope}. Stack : ${stackLine}. ${phaseLabelBit}`,
    brief: {
      projectName,
      context: `${cast.setting}\n\n${rebrandMutualisCopy(story.stakes, cast.lead)}\n\n${rebrandMutualisCopy(story.context, cast.lead)}`,
      problem: cast.domainProblem,
      objectives,
      consigne,
    },
    tools: onboardTools,
  }
}
