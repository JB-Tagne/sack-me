import type { Ref } from 'react'
import { usePmGameI18n } from '../../i18n/PmGameI18n'

export type DecisionMode = 'pm' | 'gov'

interface DecisionQcmPanelProps {
  mode: DecisionMode
  animKey: number
  stepId: string
  projectName: string
  stepIndex: number
  totalSteps: number
  castLabel: string
  headingRef: Ref<HTMLHeadingElement>
  title: string
  lead: string
  link: string
  question: string
  options: string[]
  scenarioTwist?: string
  choice: number | undefined
  canSubmit: boolean
  onChoice: (index: number) => void
  onValidate: () => void
}

/** Shared PM / governance decision QCM panel. */
export function DecisionQcmPanel({
  mode,
  animKey,
  stepId,
  projectName,
  stepIndex,
  totalSteps,
  castLabel,
  headingRef,
  title,
  lead,
  link,
  question,
  options,
  scenarioTwist,
  choice,
  canSubmit,
  onChoice,
  onValidate,
}: DecisionQcmPanelProps) {
  const { t } = usePmGameI18n()
  const chip = t(`${mode}.chip`)
  const asideClass =
    mode === 'pm' ? 'adventure-gov adventure-pm' : 'adventure-gov'

  return (
    <section key={`${animKey}-${mode}`} className="adventure-panel adventure-enter">
      <div className="adventure-level-chip">
        {projectName}
        <span>
          {t('task.chip')} {stepIndex + 1}/{totalSteps}
          {' · '}
          {chip}
        </span>
      </div>
      <p className="adventure-cast-inline">{castLabel}</p>

      <article className="adventure-task">
        <h2 ref={headingRef} tabIndex={-1}>
          {title}
        </h2>
        <p className="adventure-say">{lead}</p>

        {mode === 'pm' && scenarioTwist ? (
          <aside className="adventure-pm-twist" role="note">
            <span className="adventure-gov-kicker">{t('pm.twist')}</span>
            <p>{scenarioTwist}</p>
          </aside>
        ) : null}

        <aside className={asideClass} aria-label={chip}>
          <p className="adventure-gov-link">
            <span className="adventure-gov-kicker">{t(`${mode}.link`)}</span>
            <span className="adventure-gov-link-text">{link}</span>
          </p>
          <div className="adventure-gov-qcm">
            <p className="adventure-gov-kicker">{t(`${mode}.qcm`)}</p>
            <p className="adventure-gov-q-text">{question}</p>
            <div
              className="adventure-gov-options"
              role="radiogroup"
              aria-label={t(`${mode}.optionsAria`)}
            >
              {options.map((opt, i) => {
                const id = `${mode}-${stepId}-${i}`
                return (
                  <label
                    key={id}
                    className={`adventure-gov-option${choice === i ? ' is-selected' : ''}`}
                    htmlFor={id}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`${mode}-${stepId}`}
                      value={i}
                      checked={choice === i}
                      onChange={() => onChoice(i)}
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
            disabled={!canSubmit}
            onClick={onValidate}
          >
            {t(`${mode}.validate`)}
          </button>
        </div>
      </article>
    </section>
  )
}
