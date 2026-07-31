import type { AdventureStep } from '../data/dataStack/adventure'
import { getMeetingForStep } from '../data/dataStack/meetingBank'
import type { PmGameLocale } from '../i18n/pmGameLocale'
import type { AdventureStepHalf } from './adventureStorage'

export type RoleTrack = 'pm' | 'governance'

/** Opening half for a step when no periodic meeting applies. */
export function decisionHalfForTrack(
  roleTrack: RoleTrack,
  step: AdventureStep | undefined,
): AdventureStepHalf {
  if (roleTrack === 'governance') {
    return step?.governance ? 'gov' : 'tech'
  }
  return step?.projectMgmt ? 'pm' : 'tech'
}

/**
 * Half to open for a step. Optional global index triggers a periodic meeting first.
 */
export function startHalfForStep(
  step: AdventureStep | undefined,
  roleTrack: RoleTrack,
  locale: PmGameLocale,
  globalIdx?: number,
): AdventureStepHalf {
  if (globalIdx !== undefined && getMeetingForStep(globalIdx, locale)) return 'meeting'
  return decisionHalfForTrack(roleTrack, step)
}
