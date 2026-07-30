import type { MeetingQuestion, MeetingStep } from '../data/dataStack/pmGovTypes'
import { addressPlayerLine, withPlayerName } from './playerIdentity'

/** Inject the player's first name into meeting narrative and QCM copy. */
export function personalizeMeetingStep(meeting: MeetingStep, firstName: string): MeetingStep {
  if (!firstName.trim()) return meeting
  const p = (s: string) => withPlayerName(s, firstName)
  const questions = meeting.questions.map(
    (q): MeetingQuestion => ({
      ...q,
      npcLine: p(q.npcLine),
      question: addressPlayerLine(p(q.question), firstName),
      options: q.options.map((opt) => p(opt)) as MeetingQuestion['options'],
      correction: p(q.correction),
    }),
  )
  return {
    ...meeting,
    title: p(meeting.title),
    opening: addressPlayerLine(p(meeting.opening), firstName),
    closing: addressPlayerLine(p(meeting.closing), firstName),
    questions: questions as MeetingStep['questions'],
  }
}
