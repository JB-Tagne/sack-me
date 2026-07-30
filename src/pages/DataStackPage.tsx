import { useEffect, useMemo, useRef, useState } from 'react'
import { CampaignCertificate } from '../components/CampaignCertificate'
import { DeliverablePad } from '../components/DeliverablePad'
import { ToolOnboardingPanel } from '../components/ToolOnboardingPanel'
import { ToolProgressSidebar } from '../components/ToolProgressSidebar'
import { curatedCount, defaultTrapForTool, getLevel, globalAdventureStepIndex, type AdventureStep } from '../data/dataStack/adventure'
import { onboardingForTools } from '../data/dataStack/toolOnboarding'
import { phaseLabel, STACK_TOOLS, type ToolId } from '../data/dataStack/tools'
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
import { shareOrCopyScore } from '../lib/shareScore'
import { adaptLevelForRole } from '../data/dataStack/adaptLevelForRole'
import { datasetHint } from '../data/dataStack/gameDatasets'
import {
  castingChip,
  mutualisEntity,
  MUTUALIS_GROUP_NAME,
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
import { PmGameLangToggle } from '../components/PmGameLangToggle'
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

type Phase = AdventureUiPhase

function toolLabel(id: string | undefined): string {
  if (!id) return ''
  return STACK_TOOLS.find((t) => t.id === id)?.name ?? id
}

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
  /** Accueil : titre animé → intro → jeu. */
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
  /** Réunion en cours (COPROJ / COPIL / Scrum / COMEX fire). */
  const [activeMeeting, setActiveMeeting] = useState<MeetingStep | null>(null)
  /** Index de la question active dans la réunion (0–4). */
  const [meetingQIndex, setMeetingQIndex] = useState(0)
  /** Réponses du joueur pour chaque question de la réunion en cours. */
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

  function onChooseLandingLanguage(next: PmGameLocale) {
    setLocale(next)
    const p = loadAdventureProgress()
    if (p.started && (p.completedStepIds.length > 0 || p.career.wins > 0 || p.levelId > 0)) {
      enterGameAfterLanding(p)
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
    const startHalf =
      roleTrack === 'governance'
        ? first?.governance
          ? 'gov'
          : 'tech'
        : first?.projectMgmt
          ? 'pm'
          : 'tech'
    persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: startHalf }))
    setPhase('play')
    setAnimKey((k) => k + 1)
    if (first) loadDraftForStep(first.id)
  }

  function restartCampaign() {
    const ok = window.confirm(t('nav.restartConfirm'))
    if (!ok) return
    const next = resetAdventureProgress()
    setProgress(next)
    setPhase('career-pick')
    setLandingStep('title')
    setText('')
    setPmChoice(undefined)
    setGovChoice(undefined)
    setFileName(undefined)
    setFileDataUrl(undefined)
    setEvalResult(null)
    setEncourage('')
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
      // Une tâche se clôture sur le livrable technique (piste PM ou gouvernance).
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

  function startHalfForStep(s: AdventureStep | undefined, globalIdx?: number): AdventureStepHalf {
    // Si une réunion périodique est prévue à cet index global, on commence par elle
    if (globalIdx !== undefined && getMeetingForStep(globalIdx, locale)) return 'meeting'
    if (roleTrack === 'governance') {
      return s?.governance ? 'gov' : 'tech'
    }
    return s?.projectMgmt ? 'pm' : 'tech'
  }

  function globalStepIndex(p: AdventureProgress = progress): number {
    return globalAdventureStepIndex(p.levelId, p.stepIndex)
  }

  /** Lance une réunion et bloque l'UI jusqu'à la fin des 5 questions. */
  function triggerMeeting(meeting: MeetingStep) {
    setActiveMeeting(meeting)
    setMeetingQIndex(0)
    setMeetingAnswers([])
  }

  /**
   * Réponse du joueur à la question active de la réunion.
   * Pour les réunions COMEX fire, applique le fireRiskDelta si la réponse est bonne.
   */
  function onMeetingAnswer(chosenIndex: number) {
    if (!activeMeeting) return
    const q = activeMeeting.questions[meetingQIndex]
    if (!q) return

    const newAnswers = [...meetingAnswers, chosenIndex]
    setMeetingAnswers(newAnswers)

    // Appliquer fireRiskDelta si réunion COMEX fire et bonne réponse
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

  /** Ferme la réunion et reprend le jeu normal après la dernière question. */
  function onMeetingClose() {
    if (!activeMeeting) return
    const kind = activeMeeting.kind

    // Réunions COMEX fire : après la réunion, le fireAlert simple est acquitté
    if (
      kind === 'comex-danger' ||
      kind === 'comex-warning' ||
      kind === 'comex-notice' ||
      kind === 'comex-fired'
    ) {
      setActiveMeeting(null)
      setMeetingQIndex(0)
      setMeetingAnswers([])
      // Si le fireRisk est redescendu sous le seuil après les bonnes réponses,
      // on retire l'alerte; sinon on la garde mais on acquitte le modal
      const updatedRisk = progress.career.fireRisk
      if (kind === 'comex-fired' && updatedRisk >= 100) {
        // Licenciement confirmé : reset
        const next = resetAdventureProgress()
        setProgress(next)
        setPhase('career-pick')
        setLandingStep('title')
        setFireAlert(null)
        setEvalResult(null)
        setEncourage('')
        setText('')
        setPmChoice(undefined)
        setGovChoice(undefined)
        setFileName(undefined)
        setFileDataUrl(undefined)
        setAnimKey((k) => k + 1)
      } else {
        setFireAlert(null)
      }
      return
    }

    // Réunions normales : on avance vers la demi-étape PM/GOV/TECH
    setActiveMeeting(null)
    setMeetingQIndex(0)
    setMeetingAnswers([])
    const normalHalf: AdventureStepHalf =
      roleTrack === 'governance'
        ? (step?.governance ? 'gov' : 'tech')
        : (step?.projectMgmt ? 'pm' : 'tech')
    persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: normalHalf }))
    setPhase('play')
    setAnimKey((k) => k + 1)
  }

  function advanceAfterPass() {
    if (!step || !level) return
    const nextIndex = progress.stepIndex + 1
    if (nextIndex < level.steps.length) {
      const nextStep = level.steps[nextIndex]!
      // Calcul de l'index global pour détecter si une réunion doit se déclencher
      const nextGlobal = globalStepIndex({ ...progress, stepIndex: nextIndex })
      const periodicMeeting = getMeetingForStep(nextGlobal, locale)

      const nextHalf = startHalfForStep(nextStep, nextGlobal)
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

      // Déclencher la réunion immédiatement si le step en a une
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
      // Skip meeting : on passe directement au half normal
      const normalHalf: AdventureStepHalf =
        roleTrack === 'governance'
          ? (step?.governance ? 'gov' : 'tech')
          : (step?.projectMgmt ? 'pm' : 'tech')
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
      const nextHalf = startHalfForStep(nextStep)
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
    setText('')
    setPmChoice(undefined)
    setGovChoice(undefined)
    setFileName(undefined)
    setFileDataUrl(undefined)
    setEvalResult(null)
  }

  function onContinue() {
    if (!step || !level) return
    const passed = evalResult?.passed ?? false

    if (!passed) {
      goToPhase('play')
      setEvalResult(null)
      return
    }

    // Décision (PM ou gouvernance) → livrable technique
    if (stepHalf === 'pm' || stepHalf === 'gov') {
      persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: 'tech' }))
      setPhase('play')
      setAnimKey((k) => k + 1)
      setEvalResult(null)
      setEncourage('')
      return
    }

    // Tech = fin de tâche sur les deux pistes
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
    // Toutes les alertes COMEX passent par une réunion interactive
    const meetingKind = `comex-${fireAlert}` as keyof typeof COMEX_MEETINGS
    const meeting = resolveComexMeeting(meetingKind, locale)
    if (meeting) {
      // On garde fireAlert actif — il sera résolu dans onMeetingClose
      triggerMeeting(meeting)
    } else {
      // Fallback : acquittement simple
      setFireAlert(null)
    }
  }

  function enterNextLevel() {
    goToPhase('briefing')
    setText('')
    setPmChoice(undefined)
    setGovChoice(undefined)
    setFileName(undefined)
    setFileDataUrl(undefined)
    setEvalResult(null)
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
        const backHalf = startHalfForStep(step)
        persistFrom((prev) => ({ ...prev, phase: 'play', stepHalf: backHalf }))
        setAnimKey((k) => k + 1)
        setEvalResult(null)
        return
      }
      // Demi-étape de décision (pm ou gov)
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

  // Retour au landing via le bouton nav "Sack Me!" (event custom ou flag sessionStorage)
  useEffect(() => {
    function goLanding() {
      sessionStorage.removeItem(GAME_LANDING_FLAG)
      setLandingStep('title')
      setAnimKey((k) => k + 1)
    }
    // Flag positionné avant navigation (cas : arrive depuis une autre page)
    if (sessionStorage.getItem(GAME_LANDING_FLAG)) {
      goLanding()
    }
    // Event custom (cas : déjà sur la page)
    window.addEventListener('sackme-go-landing', goLanding)
    return () => window.removeEventListener('sackme-go-landing', goLanding)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Déclenche la réunion quand on entre en phase play avec stepHalf === 'meeting'
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
  const briefToolsLine = toolsLine
  const brief = level.brief
  const halfLabel =
    stepHalf === 'pm'
      ? t('half.pm')
      : stepHalf === 'gov'
        ? t('half.gov')
        : stepHalf === 'meeting'
          ? t('half.meeting')
          : t('half.tech')
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
  const fireRisk = progress.career.fireRisk
  const fireTone = fireRisk >= 75 ? 'critical' : fireRisk >= 50 ? 'warn' : 'ok'
  const hudLevelLabel =
    progress.levelId >= curatedCount()
      ? `M${progress.levelId}`
      : String(progress.levelId)

  if (landingStep) {
    return (
      <div className="adventure adventure-landing-screen">
        {landingStep === 'title' ? (
          <PmGameLanding onChoose={onChooseLandingLanguage} />
        ) : (
          <PmGameIntro onContinue={onContinueFromIntro} />
        )}
      </div>
    )
  }

  return (
    <>
    <div className="adventure">
      <header className="adventure-top">
        <div>
          <p className="adventure-eyebrow">{t('eyebrow')}</p>
          <h1>{t('header.title')}</h1>
          <p className="adventure-sub">
            {t('header.sub')}
            {progress.projectKind
              ? ` · ${projectKindLabel(progress.projectKind, locale)}`
              : ''}
            {progress.updatedAt
              ? ` · ${t('header.resume')} ${new Date(progress.updatedAt).toLocaleString(
                  locale === 'en' ? 'en-GB' : 'fr-FR',
                )}`
              : ''}
          </p>
        </div>
        <div className="adventure-top-actions">
          <PmGameLangToggle />
          <div className="adventure-hud">
            <div className="adventure-hud-item" title={careerTitle.blurb}>
              <span>{t('hud.role')}</span>
              <strong className="adventure-hud-title">{hudRoleLabel}</strong>
            </div>
            <div className={`adventure-hud-item adventure-hud-fire is-${fireTone}`}>
              <span>{t('hud.fire')}</span>
              <strong>{fireRisk} %</strong>
            </div>
            <div className="adventure-hud-item">
              <span>{t('hud.career')}</span>
              <strong>{progress.career.careerScore}</strong>
            </div>
            <div className="adventure-hud-item">
              <span>{t('hud.level')}</span>
              <strong>{hudLevelLabel}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="adventure-progress-wrap">
        <div className="adventure-progress-bar">
          <span style={{ width: `${levelPct}%` }} />
        </div>
        <p className="adventure-progress-label">
          {phaseLbl}
          {toolsLine ? ` · ${toolsLine}` : ''}
          {phase === 'play' || phase === 'feedback' ? ` · ${halfLabel}` : ''}
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
            <section key={animKey} className="adventure-panel adventure-enter">
              <div className="adventure-brief-block adventure-welcome">
                <h2 ref={panelHeadingRef} tabIndex={-1}>
                  {t('welcome.title')}
                </h2>
                <p className="adventure-welcome-hook">
                  {campaignStory
                    ? locale === 'en'
                      ? `${campaignStory.codename} — assigned to ${homeCompany.name} (${MUTUALIS_GROUP_NAME}) as ${pathRoleLabel}. ${campaignStory.tagline.replace(/Mutualis Retail/gi, homeCompany.name)}`
                      : `${campaignStory.codename} — affecté(e) à ${homeCompany.name} (${MUTUALIS_GROUP_NAME}) en tant que ${pathRoleLabel}. ${campaignStory.tagline.replace(/Mutualis Retail/gi, homeCompany.name)}`
                    : pathRoleLabel
                      ? locale === 'en'
                        ? `You join as ${pathRoleLabel} at ${homeCompany.name} — ${trackLabel(roleTrack, 'en')} track.`
                        : `Tu intègres le poste de ${pathRoleLabel} chez ${homeCompany.name} — piste ${trackLabel(roleTrack, 'fr')}.`
                      : t('welcome.hook')}
                </p>
                {campaignStory && (
                  <p className="adventure-welcome-scope">
                    <strong>
                      {locale === 'en' ? 'Home company' : 'Entreprise d’affectation'}
                    </strong>
                    {` · ${homeCompany.name} · ${homeCompany.domain[locale]}`}
                    <br />
                    {t('careerPick.castHint')}
                    <br />
                    <strong>
                      {locale === 'en' ? 'Scope' : 'Périmètre'}
                    </strong>
                    {` · ${campaignStory.scope}`}
                  </p>
                )}
                <p>
                  {t(roleTrack === 'governance' ? 'welcome.job.gov' : 'welcome.job.pm')}
                </p>
                <div className="adventure-welcome-stakes">
                  <div>
                    <h3>{t('welcome.goodTitle')}</h3>
                    <p>{t('welcome.goodBody')}</p>
                  </div>
                  <div>
                    <h3>{t('welcome.badTitle')}</h3>
                    <p>{t('welcome.badBody')}</p>
                  </div>
                </div>
                <p>{t(roleTrack === 'governance' ? 'welcome.flow.gov' : 'welcome.flow.pm')}</p>
                <p className="adventure-welcome-cta-line">{t('welcome.ctaLine')}</p>
              </div>
              <div className="adventure-actions">
                <button type="button" className="btn adventure-cta" onClick={startGame}>
                  {progress.started &&
                  (progress.completedStepIds.length > 0 ||
                    progress.career.wins > 0 ||
                    progress.levelId > 0)
                    ? `${t('welcome.resume')} (${hudRoleLabel} · ${t('welcome.risk')} ${fireRisk} %)`
                    : t('welcome.start')}
                </button>
              </div>
            </section>
          )}

          {phase === 'briefing' && (
            <section key={animKey} className="adventure-panel adventure-enter">
              <p className="adventure-level-chip">
                {t('brief.level')} {level.id} · {level.title}
                <span>{phaseLbl}</span>
              </p>

              <article className="adventure-brief">
                <h2 ref={panelHeadingRef} tabIndex={-1}>
                  {brief.projectName}
                </h2>

                <aside className="adventure-cast-chip" aria-label={t('cast.chip')}>
                  <span className="adventure-gov-kicker">{t('cast.chip')}</span>
                  <p>{castingChip(lotCast, locale)}</p>
                </aside>

                <div className="adventure-brief-block">
                  <h3>{t('brief.context')}</h3>
                  <p>{brief.context}</p>
                </div>

                <div className="adventure-brief-block">
                  <h3>{t('brief.problem')}</h3>
                  <p>{brief.problem}</p>
                </div>

                <div className="adventure-brief-block">
                  <h3>{t('brief.objectives')}</h3>
                  <ul>
                    {brief.objectives.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>

                <div className="adventure-brief-block adventure-brief-consigne">
                  <h3>{t('brief.consigne')}</h3>
                  <p>{brief.consigne}</p>
                </div>

                <p className="adventure-brief-meta">
                  {t('brief.tools')} : <strong>{briefToolsLine || '—'}</strong>
                  {' · '}
                  {totalStepsInLevel}{' '}
                  {totalStepsInLevel > 1 ? t('brief.tasks_plural') : t('brief.tasks')}
                </p>

                {marketStack.length > 0 && (
                  <div className="adventure-brief-block">
                    <h3>{t('brief.roleStack')}</h3>
                    <p className="adventure-brief-stack">
                      {marketStack.map((t) => t.name).join(' · ')}
                    </p>
                  </div>
                )}

                {level.tools.length > 0 && (
                  <div className="adventure-brief-block adventure-brief-onboarding">
                    <h3>{t('brief.onboardingTitle')}</h3>
                    <p>{t('brief.onboardingLead')}</p>
                    {onboardingForTools(level.tools as ToolId[], locale).map((g) => (
                      <ToolOnboardingPanel key={g.toolId} guide={g} defaultOpen={false} />
                    ))}
                  </div>
                )}
              </article>

              <div className="adventure-actions">
                <button type="button" className="btn adventure-cta" onClick={launchTasks}>
                  {t('brief.launch')}
                </button>
              </div>
            </section>
          )}

          {phase === 'play' &&
            step &&
            roleTrack === 'pm' &&
            stepHalf === 'pm' &&
            pm && (
            <section key={`${animKey}-pm`} className="adventure-panel adventure-enter">
              <div className="adventure-level-chip">
                {brief.projectName}
                <span>
                  {t('task.chip')} {progress.stepIndex + 1}/{totalStepsInLevel}
                  {' · '}
                  {t('pm.chip')}
                </span>
              </div>
              <p className="adventure-cast-inline">{castingChip(stepCast, locale)}</p>

              <article className="adventure-task">
                <h2 ref={panelHeadingRef} tabIndex={-1}>
                  {progress.playerRole
                    ? roleDecisionTitle(progress.playerRole, locale)
                    : locale === 'en'
                      ? 'Project manager'
                      : 'Chef de projet'}{' '}
                  — {step.title}
                </h2>
                <p className="adventure-say">
                  {progress.playerRole
                    ? roleDecisionLead(progress.playerRole, locale)
                    : locale === 'en'
                      ? 'Before the technical deliverable, decide like a PM: value, capacity, risk, adaptation. Mixed frameworks: project management, Scrum, scaled agile.'
                      : 'Avant le livrable technique, décide comme un PM : valeur, capacité, risque, adaptation. Cadres mélangés : gestion de projet, Scrum, agile à l’échelle.'}
                </p>

                {pm.scenarioTwist && (
                  <aside className="adventure-pm-twist" role="note">
                    <span className="adventure-gov-kicker">{t('pm.twist')}</span>
                    <p>{pm.scenarioTwist}</p>
                  </aside>
                )}

                <aside className="adventure-gov adventure-pm" aria-label={t('pm.chip')}>
                  <p className="adventure-gov-link">
                    <span className="adventure-gov-kicker">{t('pm.link')}</span>
                    <span className="adventure-gov-link-text">{pm.link}</span>
                  </p>
                  <div className="adventure-gov-qcm">
                    <p className="adventure-gov-kicker">{t('pm.qcm')}</p>
                    <p className="adventure-gov-q-text">{pm.question}</p>
                    <div
                      className="adventure-gov-options"
                      role="radiogroup"
                      aria-label={t('pm.optionsAria')}
                    >
                      {pm.options.map((opt, i) => {
                        const id = `pm-${step.id}-${i}`
                        return (
                          <label
                            key={id}
                            className={`adventure-gov-option${pmChoice === i ? ' is-selected' : ''}`}
                            htmlFor={id}
                          >
                            <input
                              id={id}
                              type="radio"
                              name={`pm-${step.id}`}
                              value={i}
                              checked={pmChoice === i}
                              onChange={() => {
                                setPmChoice(i)
                                saveDraft(step.id, { pmChoice: i })
                              }}
                            />
                            <span className="adventure-gov-letter" aria-hidden>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="adventure-gov-option-text">{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </aside>

                <div className="adventure-actions">
                  <button
                    type="button"
                    className="btn adventure-cta"
                    disabled={!canSubmit()}
                    onClick={onValidate}
                  >
                    {t('pm.validate')}
                  </button>
                </div>
              </article>
            </section>
          )}

          {phase === 'play' && step && stepHalf === 'tech' && (
            <section key={`${animKey}-tech`} className="adventure-panel adventure-enter">
              <div className="adventure-level-chip">
                {brief.projectName}
                <span>
                  {t('task.chip')} {progress.stepIndex + 1}/{totalStepsInLevel}
                  {step.tool ? ` · ${toolLabel(step.tool)}` : ''}
                  {' · '}
                  {t('tech.chip')}
                </span>
              </div>
              <p className="adventure-cast-inline">{castingChip(stepCast, locale)}</p>

              <article className="adventure-task">
                <h2 ref={panelHeadingRef} tabIndex={-1}>
                  {step.title}
                </h2>

                <div className="adventure-brief-block adventure-tech-situation">
                  <h3>{t('tech.situation')}</h3>
                  <p className="adventure-say">{step.say}</p>
                </div>

                <div className="adventure-brief-block adventure-tech-practice">
                  <h3>{t('tech.practice')}</h3>

                  {(step.dataset || (step.alsoDownload && step.alsoDownload.length > 0)) && (
                    <div className="adventure-dataset">
                      <p>
                        <strong>{t('tech.dataset')}</strong>
                        {step.dataset
                          ? (() => {
                              const h = datasetHint(step.dataset, locale)
                              return h ? ` — ${h}` : ''
                            })()
                          : ''}
                      </p>
                      <div className="adventure-dataset-actions">
                        {step.dataset && (
                          <a className="btn secondary" href={step.dataset.href} download>
                            {t('tech.download')} {step.dataset.label}
                          </a>
                        )}
                        {step.alsoDownload?.map((ds) => (
                          <a key={ds.href} className="btn secondary" href={ds.href} download>
                            + {ds.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="adventure-do">
                    <strong>{t('tech.do')}</strong>
                    <span>{step.do}</span>
                  </p>

                  {trapText && (
                    <p className="adventure-trap" role="note">
                      <strong>{t('tech.trap')}</strong>
                      <span>{trapText}</span>
                    </p>
                  )}

                  <div className="adventure-how">
                    <strong>{t('tech.how')}</strong>
                    <ol>
                      {step.how.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ol>
                  </div>

                  {step.tool && <ToolOnboardingPanel tool={step.tool} defaultOpen />}

                  {step.dataDoD && step.dataDoD.length > 0 && (
                    <aside className="adventure-dod" aria-label={t('dod.aria')}>
                      <strong>{t('dod.title')}</strong>
                      <ul>
                        {step.dataDoD.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </aside>
                  )}

                  <div className="adventure-answer">
                    <p className="adventure-step-label">{t('tech.deliverable')}</p>
                    <DeliverablePad
                      expect={step.expect}
                      text={text}
                      fileName={fileName}
                      fileDataUrl={fileDataUrl}
                      onTextChange={(value) => {
                        setText(value)
                        saveDraft(step.id, { text: value })
                      }}
                      onFileChange={onFile}
                    />
                  </div>
                </div>

                <div className="adventure-actions">
                  <button
                    type="button"
                    className="btn adventure-cta"
                    disabled={!canSubmit()}
                    onClick={onValidate}
                  >
                    {t('tech.validate')}
                  </button>
                </div>
              </article>
            </section>
          )}

          {phase === 'play' &&
            step &&
            roleTrack === 'governance' &&
            stepHalf === 'gov' &&
            gov && (
            <section key={`${animKey}-gov`} className="adventure-panel adventure-enter">
              <div className="adventure-level-chip">
                {brief.projectName}
                <span>
                  {t('task.chip')} {progress.stepIndex + 1}/{totalStepsInLevel}
                  {' · '}
                  {t('gov.chip')}
                </span>
              </div>
              <p className="adventure-cast-inline">{castingChip(stepCast, locale)}</p>

              <article className="adventure-task">
                <h2 ref={panelHeadingRef} tabIndex={-1}>
                  {t('gov.titlePrefix')} {step.title}
                </h2>
                <p className="adventure-say">
                  {t('gov.leadFirst')}
                </p>

                <aside className="adventure-gov" aria-label={t('gov.chip')}>
                  <p className="adventure-gov-link">
                    <span className="adventure-gov-kicker">{t('gov.link')}</span>
                    <span className="adventure-gov-link-text">{gov.link}</span>
                  </p>
                  <div className="adventure-gov-qcm">
                    <p className="adventure-gov-kicker">{t('gov.qcm')}</p>
                    <p className="adventure-gov-q-text">{gov.question}</p>
                    <div
                      className="adventure-gov-options"
                      role="radiogroup"
                      aria-label={t('gov.optionsAria')}
                    >
                      {gov.options.map((opt, i) => {
                        const id = `gov-${step.id}-${i}`
                        return (
                          <label
                            key={id}
                            className={`adventure-gov-option${govChoice === i ? ' is-selected' : ''}`}
                            htmlFor={id}
                          >
                            <input
                              id={id}
                              type="radio"
                              name={`gov-${step.id}`}
                              value={i}
                              checked={govChoice === i}
                              onChange={() => {
                                setGovChoice(i)
                                saveDraft(step.id, { govChoice: i })
                              }}
                            />
                            <span className="adventure-gov-letter" aria-hidden>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="adventure-gov-option-text">{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </aside>

                <div className="adventure-actions">
                  <button
                    type="button"
                    className="btn adventure-cta"
                    disabled={!canSubmit()}
                    onClick={onValidate}
                  >
                    {t('gov.validate')}
                  </button>
                </div>
              </article>
            </section>
          )}

          {phase === 'feedback' && step && evalResult && (
            <section key={`${animKey}-fb`} className="adventure-panel adventure-enter adventure-feedback">
              <div
                className={`adventure-result ${evalResult.passed ? 'ok' : 'ko'}`}
                role="status"
              >
                <div
                  className={`adventure-fx ${evalResult.passed ? 'fx-ok' : 'fx-ko'}`}
                  aria-hidden
                >
                  {evalResult.passed ? (
                    <span className="adventure-thumb" aria-hidden>
                      OK
                    </span>
                  ) : (
                    <span className="adventure-big-x" aria-hidden>
                      X
                    </span>
                  )}
                </div>
                <h2 ref={panelHeadingRef} tabIndex={-1}>
                  {stepHalf === 'pm'
                    ? evalResult.passed
                      ? t('pm.pass')
                      : t('pm.fail')
                    : stepHalf === 'gov'
                      ? evalResult.passed
                        ? t('gov.pass')
                        : t('gov.fail')
                      : evalResult.passed
                        ? t('tech.pass')
                        : t('tech.fail')}
                </h2>
                <p className="adventure-encourage">{encourage}</p>
                <p>{evalResult.message}</p>
              </div>

              <div
                className={`adventure-brief-block${evalResult.passed ? '' : ' adventure-correction-box'}`}
              >
                <h3>
                  {stepHalf === 'pm'
                    ? t('feedback.correctionPm')
                    : stepHalf === 'gov'
                      ? t('feedback.correctionGov')
                      : evalResult.passed
                        ? t('feedback.correctionHint')
                        : t('feedback.correctionProposal')}
                </h3>
                <pre className="adventure-correction-pre">{evalResult.correction}</pre>
                {stepHalf === 'pm' && evalResult.frameworkRef && (
                  <p className="adventure-dama-ref">
                    {t('ref')} {evalResult.frameworkRef}
                  </p>
                )}
                {stepHalf === 'gov' && evalResult.damaRef && (
                  <p className="adventure-dama-ref">
                    {t('ref')} {evalResult.damaRef}
                  </p>
                )}
              </div>

              <div className="adventure-actions">
                <button type="button" className="btn adventure-cta" onClick={onContinue}>
                  {!evalResult.passed
                    ? t('feedback.retry')
                    : stepHalf === 'tech'
                      ? t('feedback.nextTask')
                      : t('feedback.toTech')}
                </button>
              </div>
            </section>
          )}

          {phase === 'level-complete' && (
            <section key={animKey} className="adventure-panel adventure-enter">
              <div className="adventure-brief-block">
                <h2 ref={panelHeadingRef} tabIndex={-1}>
                  {t('levelComplete.titlePrefix')} {progress.levelId - 1}
                </h2>
                <p>{levelFor(progress.levelId).intro}</p>
                <p>
                  {t('levelComplete.nextBrief')}{' '}
                  <strong>
                    {levelFor(progress.levelId).brief.projectName}
                  </strong>
                </p>
              </div>
              {progress.levelId === curatedCount() && pathRoleLabel && campaignStory && (
                <CampaignCertificate
                  roleLabel={pathRoleLabel}
                  company={homeCompany.name}
                  codename={campaignStory.codename}
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
                    }).then((r) => setShareStatus(r))
                  }}
                />
              )}
              <div className="adventure-actions">
                <button type="button" className="btn adventure-cta" onClick={enterNextLevel}>
                  {t('levelComplete.seeNext')}
                </button>
              </div>
            </section>
          )}

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
            roleMarketToolNames={marketStack.map((t) => t.name)}
          />
        )}
      </div>
    </div>

    {fireAlert && !activeMeeting && (
      <PmGameFireAlert
        level={fireAlert}
        fireRisk={progress.career.fireRisk}
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
