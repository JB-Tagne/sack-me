/**
 * PmGameMeeting — réunion simulée (COPROJ, COPIL, Scrum, COMEX fire).
 * S'affiche en overlay plein écran. 5 QCM une à une avec échange narratif.
 */
import { useState } from 'react'
import type { MeetingStep, MeetingKind } from '../data/dataStack/pmGovTypes'
import { usePmGameI18n } from '../i18n/PmGameI18n'

interface PmGameMeetingProps {
  meeting: MeetingStep
  questionIndex: number
  answers: number[]
  fireRisk: number
  onAnswer: (chosenIndex: number) => void
  onClose: () => void
}

const KIND_ICONS: Record<MeetingKind, string> = {
  coproj: '👥',
  copil: '🎯',
  'sprint-planning': '📋',
  daily: '☀️',
  'sprint-review': '🔍',
  'sprint-retro': '🔄',
  'comex-danger': '⚠️',
  'comex-warning': '🚨',
  'comex-notice': '📄',
  'comex-fired': '🚪',
}

function isComexFire(kind: MeetingKind): boolean {
  return (
    kind === 'comex-danger' ||
    kind === 'comex-warning' ||
    kind === 'comex-notice' ||
    kind === 'comex-fired'
  )
}

export function PmGameMeeting({
  meeting,
  questionIndex,
  answers,
  fireRisk,
  onAnswer,
  onClose,
}: PmGameMeetingProps) {
  const { t } = usePmGameI18n()
  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined)
  const [showCorrection, setShowCorrection] = useState(false)

  const isFireMeeting = isComexFire(meeting.kind)
  const currentQ = meeting.questions[questionIndex]
  const isDone = answers.length >= 5
  const chipKey = `meeting.chip.${meeting.kind}`

  // Résumé de fin : score et impact fireRisk pour les réunions COMEX fire
  const correctCount = answers.filter(
    (ans, i) => meeting.questions[i] && ans === meeting.questions[i]!.correctIndex,
  ).length

  const totalFireDelta = isFireMeeting
    ? answers.reduce((sum, ans, i) => {
        const q = meeting.questions[i]
        if (!q) return sum
        if (ans === q.correctIndex && q.fireRiskDelta !== undefined) {
          return sum + q.fireRiskDelta
        }
        return sum
      }, 0)
    : 0

  function handleValidate() {
    if (selectedOption === undefined) return
    onAnswer(selectedOption)
    setShowCorrection(true)
  }

  function handleNext() {
    setSelectedOption(undefined)
    setShowCorrection(false)
  }

  const prevAnswer = showCorrection ? selectedOption : undefined
  const prevQ = showCorrection ? currentQ : undefined

  return (
    <div
      className={`meeting-overlay meeting-${meeting.kind}${isFireMeeting ? ' meeting-fire' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="meeting-title"
    >
      <div className="meeting-panel adventure-enter">
        {/* Header */}
        <div className="meeting-header">
          <span className="meeting-icon" aria-hidden>{KIND_ICONS[meeting.kind]}</span>
          <span className="meeting-chip">{t(chipKey)}</span>
          {isFireMeeting && (
            <span className="meeting-fire-risk" aria-label={t('hud.fire')}>
              {fireRisk}%
            </span>
          )}
        </div>

        <h2 id="meeting-title" className="meeting-title">{meeting.title}</h2>

        {/* Contenu : ouverture, questions, ou clôture */}
        {!isDone && currentQ && !showCorrection && (
          <>
            {/* Ouverture narrative (uniquement avant la 1ère question) */}
            {questionIndex === 0 && (
              <p className="meeting-opening">{meeting.opening}</p>
            )}

            {/* Indicateur de progression */}
            <div className="meeting-progress" aria-label={`${t('meeting.progress')} ${questionIndex + 1} ${t('meeting.of')} 5`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`meeting-dot${i < answers.length ? ' done' : i === questionIndex ? ' active' : ''}`}
                  aria-hidden
                />
              ))}
              <span className="meeting-progress-label">
                {t('meeting.progress')} {questionIndex + 1} {t('meeting.of')} 5
              </span>
            </div>

            {/* Prise de parole PNJ */}
            <div className="meeting-npc-bubble" aria-live="polite">
              <span className="meeting-npc-icon" aria-hidden>💬</span>
              <p className="meeting-npc-line">{currentQ.npcLine}</p>
            </div>

            {/* Question */}
            <p className="meeting-question">{currentQ.question}</p>

            {/* Options */}
            <fieldset className="meeting-options">
              <legend className="sr-only">{t('meeting.choose')}</legend>
              {currentQ.options.map((opt, i) => (
                <label
                  key={i}
                  className={`meeting-option${selectedOption === i ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`meeting-q-${questionIndex}`}
                    value={i}
                    checked={selectedOption === i}
                    onChange={() => setSelectedOption(i)}
                  />
                  <span className="meeting-option-letter" aria-hidden>
                    {['A', 'B', 'C'][i]}
                  </span>
                  <span className="meeting-option-text">{opt}</span>
                </label>
              ))}
            </fieldset>

            <button
              type="button"
              className="btn meeting-cta adventure-cta"
              onClick={handleValidate}
              disabled={selectedOption === undefined}
            >
              {t('meeting.validate')}
            </button>
          </>
        )}

        {/* Correction après une réponse */}
        {showCorrection && prevQ && prevAnswer !== undefined && !isDone && (
          <div className="meeting-correction adventure-enter">
            <div
              className={`meeting-result-badge ${prevAnswer === prevQ.correctIndex ? 'ok' : 'ko'}`}
            >
              {prevAnswer === prevQ.correctIndex ? '✓' : '✗'}{' '}
              {prevAnswer === prevQ.correctIndex
                ? t('meeting.result.good')
                : t('meeting.result.bad')}
            </div>

            <h3 className="meeting-correction-title">{t('meeting.correction')}</h3>
            <p className="meeting-correction-text">{prevQ.correction}</p>

            {isFireMeeting && prevAnswer === prevQ.correctIndex && prevQ.fireRiskDelta !== undefined && (
              <p className="meeting-fire-impact ok">
                {t('meeting.fire.delta')}
                {t('meeting.fire.reduced')} {Math.abs(prevQ.fireRiskDelta)} pts
              </p>
            )}

            <button
              type="button"
              className="btn meeting-cta adventure-cta"
              onClick={handleNext}
              autoFocus
            >
              {t('meeting.next')}
            </button>
          </div>
        )}

        {/* Écran de clôture après les 5 questions */}
        {isDone && (
          <div className="meeting-closing adventure-enter">
            <div className="meeting-score">
              <span className="meeting-score-num">{correctCount}</span>
              <span className="meeting-score-label">/ 5</span>
            </div>

            {isFireMeeting && (
              <p className={`meeting-fire-summary ${totalFireDelta < 0 ? 'ok' : 'neutral'}`}>
                {totalFireDelta < 0
                  ? `🟢 Risque réduit de ${Math.abs(totalFireDelta)} pts`
                  : totalFireDelta > 0
                    ? `🔴 Risque augmenté de ${totalFireDelta} pts`
                    : '⚪ Risque inchangé'}
              </p>
            )}

            <p className="meeting-closing-text">{meeting.closing}</p>

            <button
              type="button"
              className="btn meeting-cta adventure-cta"
              onClick={onClose}
              autoFocus
            >
              {t('meeting.close')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
