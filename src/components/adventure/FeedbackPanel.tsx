import type { Ref } from 'react'
import type { StepEval } from '../../lib/adventureEngine'
import type { AdventureStepHalf } from '../../lib/adventureStorage'
import { usePmGameI18n } from '../../i18n/PmGameI18n'

interface FeedbackPanelProps {
  animKey: number
  headingRef: Ref<HTMLHeadingElement>
  stepHalf: AdventureStepHalf
  evalResult: StepEval
  encourage: string
  onContinue: () => void
}

function resultTitle(
  stepHalf: AdventureStepHalf,
  passed: boolean,
  t: (key: string) => string,
): string {
  if (stepHalf === 'pm') return passed ? t('pm.pass') : t('pm.fail')
  if (stepHalf === 'gov') return passed ? t('gov.pass') : t('gov.fail')
  return passed ? t('tech.pass') : t('tech.fail')
}

function correctionHeading(
  stepHalf: AdventureStepHalf,
  passed: boolean,
  t: (key: string) => string,
): string {
  if (stepHalf === 'pm') return t('feedback.correctionPm')
  if (stepHalf === 'gov') return t('feedback.correctionGov')
  return passed ? t('feedback.correctionHint') : t('feedback.correctionProposal')
}

/** Pass / fail feedback after a decision or tech submit. */
export function FeedbackPanel({
  animKey,
  headingRef,
  stepHalf,
  evalResult,
  encourage,
  onContinue,
}: FeedbackPanelProps) {
  const { t } = usePmGameI18n()
  const cta = !evalResult.passed
    ? t('feedback.retry')
    : stepHalf === 'tech'
      ? t('feedback.nextTask')
      : t('feedback.toTech')

  return (
    <section
      key={`${animKey}-fb`}
      className="adventure-panel adventure-enter adventure-feedback"
    >
      <div className={`adventure-result ${evalResult.passed ? 'ok' : 'ko'}`} role="status">
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
        <h2 ref={headingRef} tabIndex={-1}>
          {resultTitle(stepHalf, evalResult.passed, t)}
        </h2>
        <p className="adventure-encourage">{encourage}</p>
        <p>{evalResult.message}</p>
      </div>

      <div
        className={`adventure-brief-block${evalResult.passed ? '' : ' adventure-correction-box'}`}
      >
        <h3>{correctionHeading(stepHalf, evalResult.passed, t)}</h3>
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
          {cta}
        </button>
      </div>
    </section>
  )
}
