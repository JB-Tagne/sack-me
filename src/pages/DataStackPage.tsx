import { useEffect, useMemo, useRef, useState } from 'react'
import { ToolProgressSidebar } from '../components/ToolProgressSidebar'
import { curatedCount, defaultTrapForTool, getLevel, globalAdventureStepIndex, type AdventureStep } from '../data/dataStack/adventure'
import { phaseLabel } from '../data/dataStack/tools'
import { evaluateStep, type StepEval, type StepSubmission } from '../lib/adventureEngine'
import {
  hasProjectPath,
  loadAdventureProgress,
  resetAdventureProgress,
  resolveResumePhase,
  saveAdventureProgress,
  type AdventureProgress,
  type AdventureStepHalf,
  type AdventureUiPhase,
} from '../lib/adventureStorage'
import {
  applyCareerOutcome,
  careerFailLine,
  careerPassLine,
  fireAlertLevel,
  type FireAlertLevel,
  posteLabel,
  titleForScore,
  type CareerMode,
} from '../lib/careerTrack'
import { buzz, celebrate } from '../lib/hubPlay'
import { personalizeMeetingStep } from '../lib/personalizeMeeting'
import { playerFirstName } from '../lib/playerIdentity'
import { shareOrCopyScore } from '../lib/shareScore'
import { adaptLevelForRole } from '../data/dataStack/adaptLevelForRole'
import {
  castingChip,
  mutualisEntity,
  resolveExerciseCasting,
  type MutualisEntityId,
} from '../data/dataStack/mutualisEntities'
import {
  playableToolsForRole,
  roleDecisionLead,
  roleDecisionTitle,
} from '../data/dataStack/roleContent'
import { roleStory } from '../data/dataStack/roleStories'
import { toolsForRole } from '../data/dataStack/roleToolStacks'
import { preferToolsForRole } from '../lib/preferToolsForRole'
import { recordToolAttempt } from '../lib/toolMastery'
import { PmGameI18nProvider, usePmGameI18n } from '../i18n/PmGameI18n'
import { GAME_LANDING_FLAG } from '../lib/pmGameFlags'
import { PmGameLanding } from '../components/PmGameLanding'
import { PmGameIntro } from '../components/PmGameIntro'
import { PmGameFireAlert } from '../components/PmGameFireAlert'
import { PmGameCareerPick } from '../components/PmGameCareerPick'
import { PmGameMeeting } from '../components/PmGameMeeting'
import { getMeetingForStep, COMEX_MEETINGS, resolveComexMeeting } from '../data/dataStack/meetingBank'
import type { MeetingStep } from '../data/dataStack/pmGovTypes'
import type { PmGameLocale } from '../i18n/pmGameLocale'
import {
  openingHalfForTrack,
  playerRoleLabel,
  projectKindLabel,
  trackForRole,
  trackLabel,
  type PlayerRoleId,
  type ProjectKind,
} from '../data/dataStack/projectPaths'
import { decisionHalfForTrack, startHalfForStep } from '../lib/adventureHalf'
import { toolLabel } from '../lib/toolLabel'
import { AdventureHud } from '../components/adventure/AdventureHud'
import { WelcomePanel } from '../components/adventure/WelcomePanel'
import { BriefingPanel } from '../components/adventure/BriefingPanel'
import { DecisionQcmPanel } from '../components/adventure/DecisionQcmPanel'
import { TechPlayPanel } from '../components/adventure/TechPlayPanel'
import { FeedbackPanel } from '../components/adventure/FeedbackPanel'
import { LevelCompletePanel } from '../components/adventure/LevelCompletePanel'

type Phase = AdventureUiPhase

export function DataStackPage() {
  return (
    <PmGameI18nProvider>
      <DataStackPageInner />
    </PmGameI18nProvider>
  )
}

type LandingStep = 'title' | 'intro'

function DataStackPageInner() {
  const { locale, setLocale, t } = usePmGameI18n()
  const initial = useMemo(() => loadAdventureProgress(), [])
  const [progress, setProgress] = useState<AdventureProgress>(initial)
  const [phase, setPhase] = useState<Phase>(() => resolveResumePhase(initial))
  /** Landing: animated title -> intro -> game. */
  const [landingStep, setLandingStep] = useState<LandingStep | null>('title')
  const [animKey, setAnimKey] = useState(0)
  const [text, setText] = useState('')
  const [govChoice, setGovChoice] = useState<number | undefined>(undefined)
  const [pmChoice, setPmChoice] = useState<number | undefined>(undefined)
  const [fileName, setFileName] = useState<string | undefined>()
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>()
  const [evalResult, setEvalResult] = useState<StepEval | null>(null)
  const [encourage, setEncourage] = useState('')
  const [fireAlert, setFireAlert] = useState<FireAlertLevel>(null)
  /** Meeting currently in progress (COPROJ / COPIL / Scrum / COMEX fire). */
  const [activeMeeting, setActiveMeeting] = useState<MeetingStep | null>(null)
  /** Index of the active question in the current meeting (0-4). */
  const [meetingQIndex, setMeetingQIndex] = useState(0)
  /** Player answers for each question of the current meeting. */
  const [meetingAnswers, setMeetingAnswers] = useState<number[]>([])
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle')
  const panelHeadingRef = useRef<HTMLHeadingElement>(null)

  const roleTrack = progress.playerRole ? trackForRole(progress.playerRole) : 'pm'
  const openHalf = openingHalfForTrack(roleTrack)
  const stepHalf: AdventureStepHalf = progress.stepHalf ?? openHalf
  const rolePlayable = useMemo(
    () =>
      progress.projectKind && progress.playerRole
        ? playableToolsForRole(progress.projectKind, progress.playerRole)
        : [],
    [progress.projectKind, progress.playerRole],
  )
  const preferTools = useMemo(
    () => preferToolsForRole(progress.toolStats, rolePlayable, 5),
    [progress.toolStats, rolePlayable],
  )

  function levelFor(levelId: number, p: AdventureProgress = progress, loc: PmGameLocale = locale) {
    const track = p.playerRole ? trackForRole(p.playerRole) : 'pm'
    const playable =
      p.projectKind && p.playerRole
        ? playableToolsForRole(p.projectKind, p.playerRole)
        : []
    const prefer = preferToolsForRole(p.toolStats, playable, 5)
    const raw = getLevel(levelId, prefer, loc, track)
    if (p.projectKind && p.playerRole) {
      return adaptLevelForRole(raw, {
        projectKind: p.projectKind,
        playerRole: p.playerRole,
        locale: loc,
        homeEntity: p.homeEntity ?? 'retail',
      })
    }
    return raw
  }

  const level = useMemo(
    () => levelFor(progress.levelId, progress, locale),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      progress.levelId,
      progress.projectKind,
      progress.playerRole,
      progress.homeEntity,
      progress.toolStats,
      preferTools,
      locale,
      roleTrack,
    ],
  )
  const marketStack =
    progress.projectKind && progress.playerRole
      ? toolsForRole(progress.projectKind, progress.playerRole)
      : []
  const step: AdventureStep | undefined = level.steps[progress.stepIndex]
  const trapText = step ? (step.trap ?? defaultTrapForTool(step.tool, locale)) : ''
  const pm = step?.projectMgmt
  const gov = step?.governance
  const totalStepsInLevel = level.steps.length
  const validatedInLevel = level.steps.filter((s) =>
    progress.completedStepIds.includes(s.id),
  ).length
  const levelPct = Math.min(
    100,
    Math.round((validatedInLevel / Math.max(1, totalStepsInLevel)) * 100),
  )

  function persistFrom(updater: (prev: AdventureProgress) => AdventureProgress) {
    setProgress((prev) => {
      const next = updater(prev)
      saveAdventureProgress(next)
      return next
    })
  }

  function goToPhase(next: Phase) {
    setPhase(next)
    setAnimKey((k) => k + 1)
    persistFrom((prev) => ({ ...prev, phase: next }))
  }

  function loadDraftForStep(stepId: string, p: AdventureProgress = progress) {
    const d = p.drafts[stepId]
    setText(d?.text ?? '')
    setPmChoice(typeof d?.pmChoice === 'number' ? d.pmChoice : undefined)
    setGovChoice(typeof d?.govChoice === 'number' ? d.govChoice : undefined)
    setFileName(d?.fileName)
    setFileDataUrl(d?.fileDataUrl)
    setEvalResult(null)
    setEncourage('')
  }

  function saveDraft(
    stepId: string,
    patch: Partial<{
      text: string
      pmChoice?: number
      govChoice?: number
      fileName?: string
      fileDataUrl?: string
    }>,
  ) {
    persistFrom((prev) => ({
      ...prev,
      drafts: {
        ...prev.drafts,
        [stepId]: { ...prev.drafts[stepId], ...patch },
      },
    }))
  }

  /** Reset the in-progress step form (text/choices/file/eval/encourage). */
  function clearPlayForm() {
    setText('')
    setPmChoice(undefined)
    setGovChoice(undefined)
    setFileName(undefined)
    setFileDataUrl(undefined)
    setEvalResult(null)
    setEncourage('')
  }

  function enterGameAfterLanding(p: AdventureProgress = loadAdventureProgress()) {
    setLandingStep(null)
    setAnimKey((k) => k + 1)
    if (p.started && (p.completedStepIds.length > 0 || p.career.wins > 0 || p.levelId > 0)) {
      const resumePhase = resolveResumePhase(p)
      const nextProg = { ...p, phase: resumePhase }
      saveAdventureProgress(nextProg)
      setProgress(nextProg)
      setPhase(resumePhase)
      const lvl = levelFor(nextProg.levelId, nextProg, locale)
      const st = lvl.steps[nextProg.stepIndex]
      if (st && resumePhase === 'play') {
        loadDraftForStep(st.id, nextProg)
      }
      return
    }
    const nextPhase = hasProjectPath(p) ? 'welcome' : 'career-pick'
    const synced = { ...p, phase: nextPhase as AdventureUiPhase }
    saveAdventureProgress(synced)
    setProgress(synced)
    setPhase(nextPhase)
  }

  function onChooseLandingLanguage(next: PmGameLocale, displayName: string) {
    setLocale(next)
    const p = loadAdventureProgress()
    const withName: AdventureProgress = { ...p, playerDisplayName: displayName }
    saveAdventureProgress(withName)
    setProgress(withName)
    if (
      withName.started &&
      (withName.completedStepIds.length > 0 ||
        withName.career.wins > 0 ||
        withName.levelId > 0)
    ) {
      enterGameAfterLanding(withName)
      return
    }
    setLandingStep('intro')
    setAnimKey((k) => k + 1)
  }

  function onContinueFromIntro() {
    enterGameAfterLanding()
  }

  function selectProjectKind(kind: ProjectKind) {
    persistFrom((prev) => ({
      ...prev,
      projectKind: kind,
      playerRole: undefined,
      phase: 'career-pick',
    }))
    setPhase('career-pick')
  }

  function selectPlayerRole(role: PlayerRoleId) {
    persistFrom((prev) => ({
      ...prev,
      playerRole: role,
      phase: 'career-pick',
    }))
    setPhase('career-pick')
  }

  function selectHomeEntity(id: MutualisEntityId) {
    persistFrom((prev) => ({
      ...prev,
      homeEntity: id,
      phase: 'career-pick',
    }))
    setPhase('career-pick')
  }

  function confirmCareerPick() {
    if (!hasProjectPath(progress)) return
    goToPhase('welcome')
  }

  function startGame() {
    const p = loadAdventureProgress()
    if (p.started) {
      const resumePhase = resolveResumePhase(p)
      const next = { ...p, phase: resumePhase }
      saveAdventureProgress(next)
      setProgress(next)
      setPhase(resumePhase)
      setAnimKey((k) => k + 1)
      const lvl = levelFor(next.levelId, next, locale)
      const st = lvl.steps[next.stepIndex]
      if (st && resumePhase === 'play') {
        loadDraftForStep(st.id, next)
      }
      return
    }

    const fresh: AdventureProgress = {
      ...p,
      started: true,
      levelId: 0,
      stepIndex: 0,
      phase: 'briefing',
      stepHalf: openHalf,
    }
    saveAdventureProgress(fresh)
    setProgress(fresh)
    setPhase('briefing')
    setAnimKey((k) => k + 1)
  }

  function launchTasks() {
    const first = level.steps[progress.stepIndex]
    const startHalf = decisionHalfForTrack(roleTrack, first)
    persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: startHalf }))
    setPhase('play')
    setAnimKey((k) => k + 1)
    if (first) loadDraftForStep(first.id)
  }

  function restartCampaign() {
    const ok = window.confirm(t('nav.restartConfirm'))
    if (!ok) return
    const next = resetAdventureProgress({
      keepPlayerDisplayName: progress.playerDisplayName,
    })
    setProgress(next)
    setPhase('career-pick')
    setLandingStep('title')
    clearPlayForm()
    setFireAlert(null)
    setActiveMeeting(null)
    setAnimKey((k) => k + 1)
  }

  function onFile(file: File | null) {
    if (!step) return
    if (!file) {
      setFileName(undefined)
      setFileDataUrl(undefined)
      saveDraft(step.id, { fileName: undefined, fileDataUrl: undefined })
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : undefined
      setFileDataUrl(url)
      saveDraft(step.id, { fileName: file.name, fileDataUrl: url })
    }
    reader.readAsDataURL(file)
  }

  function canSubmit(): boolean {
    if (!step) return false
    if (stepHalf === 'pm') return pmChoice !== undefined
    if (stepHalf === 'gov') return govChoice !== undefined
    if (step.expect === 'screenshot') {
      const needFile = step.validate.requireFile !== false
      if (needFile && !fileName) return false
      if (step.validate.minLength && text.trim().length < step.validate.minLength) return false
      return true
    }
    return text.trim().length > 0
  }

  function onValidate() {
    if (!step) return
    const mode: CareerMode = stepHalf === 'pm' ? 'pm' : stepHalf === 'gov' ? 'gov' : 'tech'
    const sub: StepSubmission = { text, pmChoice, govChoice, fileName, fileDataUrl }
    const result = evaluateStep(step, sub, mode, locale)
    setEvalResult(result)
    setPhase('feedback')
    setAnimKey((k) => k + 1)

    const xpGainBase = result.passed
      ? mode === 'pm'
        ? 6
        : mode === 'gov'
          ? 8
          : 10
      : 3

    let outcomeCareer = progress.career
    persistFrom((prev) => {
      const nextCareer = applyCareerOutcome(prev.career, result.passed, mode)
      outcomeCareer = nextCareer
      const completed = new Set(prev.completedStepIds)
      // A task only closes on the technical deliverable (PM or governance track).
      if (result.passed && mode === 'tech') completed.add(step.id)
      const toolStats =
        mode === 'tech'
          ? recordToolAttempt(prev.toolStats, step.tool, result.passed)
          : prev.toolStats
      return {
        ...prev,
        phase: 'feedback',
        stepHalf: prev.stepHalf,
        completedStepIds: [...completed],
        toolStats,
        career: nextCareer,
        xp: prev.xp + xpGainBase + (result.passed ? Math.floor(prev.levelId / 2) : 0),
        drafts: {
          ...prev.drafts,
          [step.id]: { text, pmChoice, govChoice, fileName, fileDataUrl },
        },
      }
    })
    setEncourage(
      result.passed
        ? careerPassLine(outcomeCareer, mode, locale)
        : careerFailLine(outcomeCareer, mode, locale),
    )
    if (result.passed) {
      celebrate('soft')
    } else {
      buzz()
      const alert = fireAlertLevel(progress.career.fireRisk, outcomeCareer.fireRisk)
      if (alert) setFireAlert(alert)
    }
  }

  function globalStepIndex(p: AdventureProgress = progress): number {
    return globalAdventureStepIndex(p.levelId, p.stepIndex)
  }

  /** Launch a meeting and block the UI until all 5 questions are done. */
  function triggerMeeting(meeting: MeetingStep) {
    const first = playerFirstName(progress.playerDisplayName)
    setActiveMeeting(personalizeMeetingStep(meeting, first))
    setMeetingQIndex(0)
    setMeetingAnswers([])
  }

  /**
   * Player answer to the active meeting question.
   * For COMEX fire meetings, applies the fireRiskDelta when the answer is correct.
   */
  function onMeetingAnswer(chosenIndex: number) {
    if (!activeMeeting) return
    const q = activeMeeting.questions[meetingQIndex]
    if (!q) return

    const newAnswers = [...meetingAnswers, chosenIndex]
    setMeetingAnswers(newAnswers)

    // Apply fireRiskDelta for COMEX fire meetings on a correct answer
    if (q.fireRiskDelta !== undefined && chosenIndex === q.correctIndex) {
      persistFrom((prev) => ({
        ...prev,
        career: {
          ...prev.career,
          fireRisk: Math.max(0, prev.career.fireRisk + q.fireRiskDelta!),
        },
      }))
    }

    if (meetingQIndex < 4) {
      setMeetingQIndex(meetingQIndex + 1)
    }
  }

  /** Close the meeting and resume normal play after the last question. */
  function onMeetingClose() {
    if (!activeMeeting) return
    const kind = activeMeeting.kind

    // COMEX fire meetings: the simple fire alert is acknowledged once the meeting ends
    if (
      kind === 'comex-danger' ||
      kind === 'comex-warning' ||
      kind === 'comex-notice' ||
      kind === 'comex-fired'
    ) {
      setActiveMeeting(null)
      setMeetingQIndex(0)
      setMeetingAnswers([])
      // If fireRisk dropped back below the threshold after correct answers,
      // drop the alert; otherwise keep it but dismiss the modal
      const updatedRisk = progress.career.fireRisk
      if (kind === 'comex-fired' && updatedRisk >= 100) {
        // Confirmed firing: reset
        const next = resetAdventureProgress({
          keepPlayerDisplayName: progress.playerDisplayName,
        })
        setProgress(next)
        setPhase('career-pick')
        setLandingStep('title')
        setFireAlert(null)
        clearPlayForm()
        setAnimKey((k) => k + 1)
      } else {
        setFireAlert(null)
      }
      return
    }

    // Normal meetings: move forward to the PM/GOV/TECH half
    setActiveMeeting(null)
    setMeetingQIndex(0)
    setMeetingAnswers([])
    const normalHalf: AdventureStepHalf = decisionHalfForTrack(roleTrack, step)
    persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: normalHalf }))
    setPhase('play')
    setAnimKey((k) => k + 1)
  }

  function advanceAfterPass() {
    if (!step || !level) return
    const nextIndex = progress.stepIndex + 1
    if (nextIndex < level.steps.length) {
      const nextStep = level.steps[nextIndex]!
      // Compute the global index to detect whether a meeting should trigger
      const nextGlobal = globalStepIndex({ ...progress, stepIndex: nextIndex })
      const periodicMeeting = getMeetingForStep(nextGlobal, locale)

      const nextHalf = startHalfForStep(nextStep, roleTrack, locale, nextGlobal)
      persistFrom((prev) => ({
        ...prev,
        stepIndex: nextIndex,
        phase: 'play',
        stepHalf: nextHalf,
      }))
      loadDraftForStep(nextStep.id, { ...progress, stepIndex: nextIndex })
      setPhase('play')
      setAnimKey((k) => k + 1)
      setEvalResult(null)

      // Trigger the meeting immediately if the step has one
      if (periodicMeeting) {
        triggerMeeting(periodicMeeting)
      }
      return
    }

    const nextLevelId = level.id + 1
    persistFrom((prev) => ({
      ...prev,
      completedLevelIds: [...new Set([...prev.completedLevelIds, level.id])],
      levelId: nextLevelId,
      stepIndex: 0,
      phase: 'level-complete',
      stepHalf: openHalf,
    }))
    setPhase('level-complete')
    setAnimKey((k) => k + 1)
    setEvalResult(null)
    celebrate('strong')
  }

  function browseForward() {
    if (!level) return

    if (stepHalf === 'meeting') {
      // Skip meeting: go straight to the normal half
      const normalHalf: AdventureStepHalf = decisionHalfForTrack(roleTrack, step)
      persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: normalHalf }))
      setPhase('play')
      setAnimKey((k) => k + 1)
      setEvalResult(null)
      return
    }

    if (stepHalf === 'pm' || stepHalf === 'gov') {
      persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: 'tech' }))
      setPhase('play')
      setAnimKey((k) => k + 1)
      setEvalResult(null)
      return
    }

    const nextIndex = progress.stepIndex + 1
    if (nextIndex < level.steps.length) {
      const nextStep = level.steps[nextIndex]!
      const nextHalf = startHalfForStep(nextStep, roleTrack, locale)
      persistFrom((prev) => ({
        ...prev,
        stepIndex: nextIndex,
        phase: 'play',
        stepHalf: nextHalf,
      }))
      loadDraftForStep(nextStep.id, { ...progress, stepIndex: nextIndex })
      setPhase('play')
      setAnimKey((k) => k + 1)
      setEvalResult(null)
      return
    }

    const nextLevelId = level.id + 1
    persistFrom((prev) => ({
      ...prev,
      levelId: nextLevelId,
      stepIndex: 0,
      phase: 'briefing',
      stepHalf: openHalf,
    }))
    setPhase('briefing')
    setAnimKey((k) => k + 1)
    clearPlayForm()
  }

  function onContinue() {
    if (!step || !level) return
    const passed = evalResult?.passed ?? false

    if (!passed) {
      goToPhase('play')
      setEvalResult(null)
      return
    }

    // Decision (PM or governance) -> technical deliverable
    if (stepHalf === 'pm' || stepHalf === 'gov') {
      persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: 'tech' }))
      setPhase('play')
      setAnimKey((k) => k + 1)
      setEvalResult(null)
      setEncourage('')
      return
    }

    // Tech ends the task on both tracks
    if (stepHalf === 'tech') {
      persistFrom((prev) => ({
        ...prev,
        completedStepIds: [...new Set([...prev.completedStepIds, step.id])],
      }))
      advanceAfterPass()
    }
  }

  function acknowledgeFireAlert() {
    if (!fireAlert) return
    // All COMEX alerts go through an interactive meeting
    const meetingKind = `comex-${fireAlert}` as keyof typeof COMEX_MEETINGS
    const meeting = resolveComexMeeting(meetingKind, locale)
    if (meeting) {
      // Keep fireAlert active — it will be resolved in onMeetingClose
      triggerMeeting(meeting)
    } else {
      // Fallback: simple acknowledgment
      setFireAlert(null)
    }
  }

  function enterNextLevel() {
    goToPhase('briefing')
    clearPlayForm()
  }

  function goBack() {
    if (phase === 'career-pick') return

    if (phase === 'welcome') {
      goToPhase('career-pick')
      return
    }

    if (phase === 'feedback') {
      goToPhase('play')
      setEvalResult(null)
      return
    }

    if (phase === 'level-complete') {
      const prevLevelId = Math.max(0, progress.levelId - 1)
      const prevLevel = levelFor(prevLevelId)
      const lastIdx = Math.max(0, prevLevel.steps.length - 1)
      persistFrom((prev) => ({
        ...prev,
        levelId: prevLevelId,
        stepIndex: lastIdx,
        phase: 'play',
        stepHalf: 'tech',
      }))
      setPhase('play')
      setAnimKey((k) => k + 1)
      const st = prevLevel.steps[lastIdx]
      if (st) {
        loadDraftForStep(st.id, { ...progress, levelId: prevLevelId, stepIndex: lastIdx })
      }
      return
    }

    if (phase === 'briefing') {
      if (progress.levelId <= 0) {
        goToPhase('welcome')
        return
      }
      const prevLevelId = progress.levelId - 1
      const prevLevel = levelFor(prevLevelId)
      const lastIdx = Math.max(0, prevLevel.steps.length - 1)
      persistFrom((prev) => ({
        ...prev,
        levelId: prevLevelId,
        stepIndex: lastIdx,
        phase: 'play',
        stepHalf: 'tech',
      }))
      setPhase('play')
      setAnimKey((k) => k + 1)
      const st = prevLevel.steps[lastIdx]
      if (st) loadDraftForStep(st.id, { ...progress, levelId: prevLevelId, stepIndex: lastIdx })
      return
    }

    if (phase === 'play') {
      if (stepHalf === 'tech') {
        const backHalf = startHalfForStep(step, roleTrack, locale)
        persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: backHalf }))
        setAnimKey((k) => k + 1)
        setEvalResult(null)
        return
      }
      // Decision half (pm or gov)
      if (progress.stepIndex > 0) {
        const nextIdx = progress.stepIndex - 1
        persistFrom((prev) => ({
          ...prev,
          stepIndex: nextIdx,
          phase: 'play',
          stepHalf: 'tech',
        }))
        const st = level.steps[nextIdx]
        setAnimKey((k) => k + 1)
        if (st) loadDraftForStep(st.id, { ...progress, stepIndex: nextIdx })
      } else {
        goToPhase('briefing')
        setEvalResult(null)
      }
    }
  }

  function goForward() {
    if (phase === 'career-pick') {
      confirmCareerPick()
      return
    }

    if (phase === 'welcome') {
      startGame()
      return
    }

    if (phase === 'briefing') {
      launchTasks()
      return
    }

    if (phase === 'feedback') {
      onContinue()
      return
    }

    if (phase === 'level-complete') {
      enterNextLevel()
      return
    }

    if (phase === 'play') {
      browseForward()
    }
  }

  const canGoBack = phase !== 'career-pick'
  const canGoForward = phase === 'career-pick' ? hasProjectPath(progress) : true

  // Return to landing via the "Sack Me!" nav button (custom event or sessionStorage flag)
  useEffect(() => {
    function goLanding() {
      sessionStorage.removeItem(GAME_LANDING_FLAG)
      setLandingStep('title')
      setAnimKey((k) => k + 1)
    }
    // Flag set before navigation (case: arriving from another page)
    if (sessionStorage.getItem(GAME_LANDING_FLAG)) {
      goLanding()
    }
    // Custom event (case: already on the page)
    window.addEventListener('sackme-go-landing', goLanding)
    return () => window.removeEventListener('sackme-go-landing', goLanding)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Trigger the meeting when entering play phase with stepHalf === 'meeting'
  useEffect(() => {
    if (phase === 'play' && stepHalf === 'meeting' && !activeMeeting) {
      const gIdx = globalStepIndex(progress)
      const meeting = getMeetingForStep(gIdx, locale)
      if (meeting) {
        triggerMeeting(meeting)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, stepHalf, progress.stepIndex, progress.levelId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const id = window.setTimeout(() => {
      panelHeadingRef.current?.focus()
    }, 50)
    return () => window.clearTimeout(id)
  }, [phase, progress.stepIndex, progress.levelId, progress.stepHalf, animKey])

  useEffect(() => {
    if (phase === 'play' && step) {
      const d = progress.drafts[step.id]
      if (d && !text && pmChoice === undefined && govChoice === undefined && !fileName) {
        setText(d.text ?? '')
        setPmChoice(typeof d.pmChoice === 'number' ? d.pmChoice : undefined)
        setGovChoice(typeof d.govChoice === 'number' ? d.govChoice : undefined)
        setFileName(d.fileName)
        setFileDataUrl(d.fileDataUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id, phase])

  const phaseLbl = phaseLabel(level.phase, locale)
  const toolsLine = level.tools.map(toolLabel).filter(Boolean).join(' · ')
  const brief = level.brief
  const careerTitle = titleForScore(progress.career.careerScore, locale)
  const pathRoleLabel =
    progress.projectKind && progress.playerRole
      ? playerRoleLabel(progress.projectKind, progress.playerRole, locale)
      : null
  const campaignStory =
    progress.projectKind && progress.playerRole
      ? roleStory(progress.projectKind, progress.playerRole, locale)
      : null
  const homeEntityId = progress.homeEntity ?? 'retail'
  const homeCompany = mutualisEntity(homeEntityId)
  const lotCast = resolveExerciseCasting(homeEntityId, {
    levelId: progress.levelId,
    phase: level.phase,
    locale,
  })
  const stepCast = step
    ? resolveExerciseCasting(homeEntityId, {
        levelId: progress.levelId,
        phase: step.phase ?? level.phase,
        stepId: step.id,
        locale,
      })
    : lotCast
  const hudRoleLabel = posteLabel(progress.career.careerScore, locale, pathRoleLabel)
  const playerName = progress.playerDisplayName?.trim() ?? ''
  const firstName = playerFirstName(playerName)
  const fireRisk = progress.career.fireRisk
  const fireTone = fireRisk >= 75 ? 'critical' : fireRisk >= 50 ? 'warn' : 'ok'
  const hudLevelLabel =
    progress.levelId >= curatedCount()
      ? `M${progress.levelId}`
      : String(progress.levelId)
  const projectKindSuffix = progress.projectKind
    ? ` · ${projectKindLabel(progress.projectKind, locale)}`
    : ''
  const resumeSuffix = progress.updatedAt
    ? ` · ${t('header.resume')} ${new Date(progress.updatedAt).toLocaleString(
        locale === 'en' ? 'en-GB' : 'fr-FR',
      )}`
    : ''
  const welcomeResumeLabel =
    progress.started &&
    (progress.completedStepIds.length > 0 ||
      progress.career.wins > 0 ||
      progress.levelId > 0)
      ? `${t('welcome.resume')} (${hudRoleLabel} · ${t('welcome.risk')} ${fireRisk} %)`
      : null

  if (landingStep) {
    return (
      <div className="adventure adventure-landing-screen">
        {landingStep === 'title' ? (
          <PmGameLanding
            initialDisplayName={playerName}
            onChoose={onChooseLandingLanguage}
          />
        ) : (
          <PmGameIntro firstName={firstName} onContinue={onContinueFromIntro} />
        )}
      </div>
    )
  }

  return (
    <>
    <div className="adventure">
      <AdventureHud
        firstName={firstName}
        playerName={playerName}
        roleLabel={hudRoleLabel}
        roleBlurb={careerTitle.blurb}
        fireRisk={fireRisk}
        fireTone={fireTone}
        careerScore={progress.career.careerScore}
        levelLabel={hudLevelLabel}
        projectKindSuffix={projectKindSuffix}
        resumeSuffix={resumeSuffix}
      />

      <div className="adventure-progress-wrap">
        <div className="adventure-progress-bar">
          <span style={{ width: `${levelPct}%` }} />
        </div>
        <p className="adventure-progress-label">
          {phaseLbl}
          {toolsLine ? ` · ${toolsLine}` : ''}
          {phase === 'play' || phase === 'feedback'
            ? ` · ${
                stepHalf === 'pm'
                  ? t('half.pm')
                  : stepHalf === 'gov'
                    ? t('half.gov')
                    : stepHalf === 'meeting'
                      ? t('half.meeting')
                      : t('half.tech')
              }`
            : ''}
          {progress.levelId >= curatedCount() ? ` · ${t('progress.endless')}` : ''}
        </p>
      </div>

      <div className="adventure-shell">
        <div className="adventure-main">
          {phase === 'career-pick' && (
            <PmGameCareerPick
              projectKind={progress.projectKind}
              playerRole={progress.playerRole}
              homeEntity={progress.homeEntity}
              onSelectProject={selectProjectKind}
              onSelectRole={selectPlayerRole}
              onSelectHomeEntity={selectHomeEntity}
              onContinue={confirmCareerPick}
            />
          )}

          {phase === 'welcome' && (
            <WelcomePanel
              animKey={animKey}
              headingRef={panelHeadingRef}
              firstName={firstName}
              roleTrack={roleTrack}
              pathRoleLabel={pathRoleLabel}
              trackLabelText={trackLabel(roleTrack, locale)}
              homeCompany={homeCompany}
              campaignStory={campaignStory}
              castHint={t('careerPick.castHint')}
              resumeLabel={welcomeResumeLabel}
              onStart={startGame}
            />
          )}

          {phase === 'briefing' && (
            <BriefingPanel
              animKey={animKey}
              headingRef={panelHeadingRef}
              level={level}
              phaseLabelText={phaseLbl}
              toolsLine={toolsLine}
              lotCast={lotCast}
              marketStackNames={marketStack.map((mt) => mt.name)}
              onLaunch={launchTasks}
            />
          )}

          {phase === 'play' && step && roleTrack === 'pm' && stepHalf === 'pm' && pm && (
            <DecisionQcmPanel
              mode="pm"
              animKey={animKey}
              stepId={step.id}
              projectName={brief.projectName}
              stepIndex={progress.stepIndex}
              totalSteps={totalStepsInLevel}
              castLabel={castingChip(stepCast, locale)}
              headingRef={panelHeadingRef}
              title={
                (progress.playerRole
                  ? roleDecisionTitle(progress.playerRole, locale)
                  : t('pm.fallbackTitle')) +
                ' — ' +
                step.title
              }
              lead={
                progress.playerRole
                  ? roleDecisionLead(progress.playerRole, locale)
                  : t('pm.fallbackLead')
              }
              link={pm.link}
              question={pm.question}
              options={pm.options}
              scenarioTwist={pm.scenarioTwist}
              choice={pmChoice}
              canSubmit={canSubmit()}
              onChoice={(i) => {
                setPmChoice(i)
                saveDraft(step.id, { pmChoice: i })
              }}
              onValidate={onValidate}
            />
          )}

          {phase === 'play' && step && stepHalf === 'tech' && (
            <TechPlayPanel
              animKey={animKey}
              step={step}
              projectName={brief.projectName}
              stepIndex={progress.stepIndex}
              totalSteps={totalStepsInLevel}
              castLabel={castingChip(stepCast, locale)}
              trapText={trapText}
              headingRef={panelHeadingRef}
              text={text}
              fileName={fileName}
              fileDataUrl={fileDataUrl}
              canSubmit={canSubmit()}
              onTextChange={(value) => {
                setText(value)
                saveDraft(step.id, { text: value })
              }}
              onFileChange={onFile}
              onValidate={onValidate}
            />
          )}

          {phase === 'play' && step && roleTrack === 'governance' && stepHalf === 'gov' && gov && (
            <DecisionQcmPanel
              mode="gov"
              animKey={animKey}
              stepId={step.id}
              projectName={brief.projectName}
              stepIndex={progress.stepIndex}
              totalSteps={totalStepsInLevel}
              castLabel={castingChip(stepCast, locale)}
              headingRef={panelHeadingRef}
              title={`${t('gov.titlePrefix')} ${step.title}`}
              lead={t('gov.leadFirst')}
              link={gov.link}
              question={gov.question}
              options={gov.options}
              choice={govChoice}
              canSubmit={canSubmit()}
              onChoice={(i) => {
                setGovChoice(i)
                saveDraft(step.id, { govChoice: i })
              }}
              onValidate={onValidate}
            />
          )}

          {phase === 'feedback' && step && evalResult && (
            <FeedbackPanel
              animKey={animKey}
              headingRef={panelHeadingRef}
              stepHalf={stepHalf}
              evalResult={evalResult}
              encourage={encourage}
              onContinue={onContinue}
            />
          )}

          {phase === 'level-complete' &&
            (() => {
              const nextLevel = levelFor(progress.levelId)
              return (
                <LevelCompletePanel
                  animKey={animKey}
                  headingRef={panelHeadingRef}
                  completedLevelId={progress.levelId - 1}
                  nextIntro={nextLevel.intro}
                  nextProjectName={nextLevel.brief.projectName}
                  showCertificate={
                    progress.levelId === curatedCount() && !!pathRoleLabel && !!campaignStory
                  }
                  firstName={firstName}
                  roleLabel={pathRoleLabel ?? ''}
                  company={homeCompany.name}
                  codename={campaignStory?.codename ?? ''}
                  score={progress.career.careerScore}
                  title={careerTitle.label}
                  shareStatus={shareStatus}
                  onShare={() => {
                    void shareOrCopyScore({
                      score: progress.career.careerScore,
                      title: careerTitle.label,
                      roleLabel: pathRoleLabel,
                      company: homeCompany.name,
                      locale,
                      playerName: firstName || playerName,
                    }).then((r) => setShareStatus(r))
                  }}
                  onContinue={enterNextLevel}
                />
              )
            })()}

          <footer className="adventure-foot">
            <button
              type="button"
              className="btn secondary"
              disabled={!canGoBack}
              onClick={goBack}
            >
              {t('nav.back')}
            </button>
            <button type="button" className="btn secondary" onClick={restartCampaign}>
              {t('nav.restart')}
            </button>
            <button
              type="button"
              className="btn secondary"
              disabled={!canGoForward}
              onClick={goForward}
              title={t('nav.nextTitle')}
            >
              {t('nav.next')}
            </button>
          </footer>
        </div>

        {(phase === 'play' || phase === 'feedback' || phase === 'briefing') && (
          <ToolProgressSidebar
            toolStats={progress.toolStats}
            completedStepIds={progress.completedStepIds}
            focusTools={preferTools}
            rolePlayableTools={rolePlayable}
            roleMarketToolNames={marketStack.map((mt) => mt.name)}
          />
        )}
      </div>
    </div>

    {fireAlert && !activeMeeting && (
      <PmGameFireAlert
        level={fireAlert}
        fireRisk={progress.career.fireRisk}
        firstName={firstName}
        onAcknowledge={acknowledgeFireAlert}
      />
    )}

    {activeMeeting && (
      <PmGameMeeting
        meeting={activeMeeting}
        questionIndex={meetingQIndex}
        answers={meetingAnswers}
        fireRisk={progress.career.fireRisk}
        onAnswer={onMeetingAnswer}
        onClose={onMeetingClose}
      />
    )}
    </>
  )
}
