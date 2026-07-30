import type { ToolStatsMap } from './toolMastery'
import { EMPTY_CAREER, normalizeCareer, type CareerState } from './careerTrack'
import { readMigratedLocalStorage } from './storageKeys'
import {
  isPlayerRoleId,
  isProjectKind,
  roleFitsProject,
  type PlayerRoleId,
  type ProjectKind,
} from '../data/dataStack/projectPaths'
import {
  isMutualisEntityId,
  type MutualisEntityId,
} from '../data/dataStack/mutualisEntities'
import type { ToolId } from '../data/dataStack/tools'

const KEY = 'my-pro-hub-data-stack-adventure'
const LEGACY_KEY = 'john-pro-hub-data-stack-adventure'

/** Collibra → DataGalaxy (renommage stack gouvernance). */
function migrateToolStats(stats: ToolStatsMap): ToolStatsMap {
  const legacy = (stats as Record<string, ToolStatsMap[ToolId]>)['collibra']
  if (!legacy) return stats
  const next = { ...stats }
  delete (next as Record<string, unknown>)['collibra']
  const cur = next.datagalaxy
  next.datagalaxy = cur
    ? {
        attempts: cur.attempts + legacy.attempts,
        passes: cur.passes + legacy.passes,
        fails: cur.fails + legacy.fails,
      }
    : legacy
  return next
}

export type AdventureUiPhase =
  | 'career-pick'
  | 'welcome'
  | 'briefing'
  | 'play'
  | 'feedback'
  | 'level-complete'

/** Demi-étape : PM → technique → gouvernance → réunion. */
export type AdventureStepHalf = 'pm' | 'tech' | 'gov' | 'meeting'

export interface StepDraft {
  text?: string
  /** Index QCM gestion de projet choisi (0 | 1 | 2). */
  pmChoice?: number
  /** Index QCM gouvernance choisi (0 | 1 | 2). */
  govChoice?: number
  choice?: string
  fileName?: string
  /** data URL éventuelle (captures) — peut être volumineuse. */
  fileDataUrl?: string
  /** Réponses de réunion [q0..q4] (index choisi ou -1 = pas encore répondu). */
  meetingAnswers?: number[]
}

export interface AdventureProgress {
  /** Niveau courant (0 = débutant, puis 1…∞). */
  levelId: number
  /** Index d’étape dans le niveau. */
  stepIndex: number
  /** Étapes réussites (ids) — validées PM + tech + gouvernance. */
  completedStepIds: string[]
  /** Niveaux terminés. */
  completedLevelIds: number[]
  /** Brouillons par step id — reprise exacte. */
  drafts: Record<string, StepDraft>
  /** Stats de réussite par outil (pour radar + biais endless). */
  toolStats: ToolStatsMap
  xp: number
  /** Carrière : évolution vs risque de licenciement. */
  career: CareerState
  /** Type de projet choisi (IT vs Data/IA). */
  projectKind?: ProjectKind
  /** Rôle joueur choisi pour ce projet. */
  playerRole?: PlayerRoleId
  /** Entreprise d’affectation dans Mutualis Group. */
  homeEntity?: MutualisEntityId
  /**
   * Player display name as "First Last" (no email).
   * First name is used in UI and NPC dialogue.
   */
  playerDisplayName?: string
  started: boolean
  /** Phase UI persistée pour reprise fidèle. */
  phase: AdventureUiPhase
  /** Technique / PM / gouvernance. */
  stepHalf: AdventureStepHalf
  updatedAt?: string
}

const empty: AdventureProgress = {
  levelId: 0,
  stepIndex: 0,
  completedStepIds: [],
  completedLevelIds: [],
  drafts: {},
  toolStats: {},
  xp: 0,
  career: { ...EMPTY_CAREER },
  started: false,
  phase: 'career-pick',
  stepHalf: 'pm',
}

export function isAdventureUiPhase(v: unknown): v is AdventureUiPhase {
  return (
    v === 'career-pick' ||
    v === 'welcome' ||
    v === 'briefing' ||
    v === 'play' ||
    v === 'feedback' ||
    v === 'level-complete'
  )
}

function normalizePathChoice(parsed: Partial<AdventureProgress>): {
  projectKind?: ProjectKind
  playerRole?: PlayerRoleId
  homeEntity?: MutualisEntityId
} {
  const projectKind = isProjectKind(parsed.projectKind) ? parsed.projectKind : undefined
  const playerRole =
    projectKind &&
    isPlayerRoleId(parsed.playerRole) &&
    roleFitsProject(projectKind, parsed.playerRole)
      ? parsed.playerRole
      : undefined
  const homeEntity = isMutualisEntityId(parsed.homeEntity) ? parsed.homeEntity : undefined
  return { projectKind, playerRole, homeEntity }
}

export function hasProjectPath(p: AdventureProgress): boolean {
  return Boolean(p.projectKind && p.playerRole && p.homeEntity)
}

export function isAdventureStepHalf(v: unknown): v is AdventureStepHalf {
  return v === 'pm' || v === 'tech' || v === 'gov' || v === 'meeting'
}

/** Phase à restaurer au chargement (feedback → play car le résultat d’éval n’est pas stocké). */
export function resolveResumePhase(p: AdventureProgress): AdventureUiPhase {
  if (!p.started) {
    return hasProjectPath(p) ? 'welcome' : 'career-pick'
  }
  if (p.phase === 'feedback') return 'play'
  if (p.phase === 'career-pick') {
    return hasProjectPath(p) ? 'welcome' : 'career-pick'
  }
  if (p.phase === 'briefing' || p.phase === 'play' || p.phase === 'level-complete') {
    return p.phase
  }
  if (p.stepIndex > 0 || p.completedStepIds.length > 0) return 'play'
  return 'briefing'
}

export function loadAdventureProgress(): AdventureProgress {
  try {
    const raw = readMigratedLocalStorage(KEY, LEGACY_KEY)
    if (!raw) return { ...empty, drafts: {}, toolStats: {}, career: { ...EMPTY_CAREER } }
    const parsed = JSON.parse(raw) as Partial<AdventureProgress>
    const path = normalizePathChoice(parsed)
    return {
      ...empty,
      ...parsed,
      completedStepIds: [...(parsed.completedStepIds ?? [])],
      completedLevelIds: [...(parsed.completedLevelIds ?? [])],
      drafts: { ...(parsed.drafts ?? {}) },
      toolStats: migrateToolStats({ ...(parsed.toolStats ?? {}) }),
      career: normalizeCareer(parsed.career),
      projectKind: path.projectKind,
      playerRole: path.playerRole,
      homeEntity: path.homeEntity,
      phase: isAdventureUiPhase(parsed.phase) ? parsed.phase : empty.phase,
      stepHalf: isAdventureStepHalf(parsed.stepHalf) ? parsed.stepHalf : 'pm',
    }
  } catch {
    return { ...empty, drafts: {}, toolStats: {}, career: { ...EMPTY_CAREER } }
  }
}

export function saveAdventureProgress(p: AdventureProgress): void {
  try {
    const withTs = { ...p, updatedAt: new Date().toISOString() }
    localStorage.setItem(KEY, JSON.stringify(withTs))
  } catch (err) {
    console.error('[saveAdventureProgress]', err)
    try {
      const slimDrafts: Record<string, StepDraft> = {}
      for (const [k, d] of Object.entries(p.drafts)) {
        slimDrafts[k] = {
          text: d.text,
          pmChoice: d.pmChoice,
          govChoice: d.govChoice,
          choice: d.choice,
          fileName: d.fileName,
        }
      }
      localStorage.setItem(
        KEY,
        JSON.stringify({ ...p, drafts: slimDrafts, updatedAt: new Date().toISOString() }),
      )
    } catch (err2) {
      console.error('[saveAdventureProgress slim]', err2)
    }
  }
}

export function resetAdventureProgress(opts?: {
  keepPlayerDisplayName?: string
}): AdventureProgress {
  const kept = opts?.keepPlayerDisplayName?.trim()
  const next = {
    ...empty,
    drafts: {},
    toolStats: {},
    career: { ...EMPTY_CAREER },
    stepHalf: 'pm' as const,
    ...(kept ? { playerDisplayName: kept } : {}),
  }
  saveAdventureProgress(next)
  return next
}
