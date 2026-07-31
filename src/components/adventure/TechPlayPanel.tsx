import type { Ref } from 'react'
import type { AdventureStep } from '../../data/dataStack/adventure'
import { datasetHint } from '../../data/dataStack/gameDatasets'
import { DeliverablePad } from '../DeliverablePad'
import { ToolOnboardingPanel } from '../ToolOnboardingPanel'
import { usePmGameI18n } from '../../i18n/PmGameI18n'
import { toolLabel } from '../../lib/toolLabel'

interface TechPlayPanelProps {
  animKey: number
  step: AdventureStep
  projectName: string
  stepIndex: number
  totalSteps: number
  castLabel: string
  trapText: string
  headingRef: Ref<HTMLHeadingElement>
  text: string
  fileName?: string
  fileDataUrl?: string
  canSubmit: boolean
  onTextChange: (value: string) => void
  onFileChange: (file: File | null) => void
  onValidate: () => void
}

/** Hands-on technical deliverable panel. */
export function TechPlayPanel({
  animKey,
  step,
  projectName,
  stepIndex,
  totalSteps,
  castLabel,
  trapText,
  headingRef,
  text,
  fileName,
  fileDataUrl,
  canSubmit,
  onTextChange,
  onFileChange,
  onValidate,
}: TechPlayPanelProps) {
  const { locale, t } = usePmGameI18n()
  const hint = step.dataset ? datasetHint(step.dataset, locale) : ''

  return (
    <section key={`${animKey}-tech`} className="adventure-panel adventure-enter">
      <div className="adventure-level-chip">
        {projectName}
        <span>
          {t('task.chip')} {stepIndex + 1}/{totalSteps}
          {step.tool ? ` · ${toolLabel(step.tool)}` : ''}
          {' · '}
          {t('tech.chip')}
        </span>
      </div>
      <p className="adventure-cast-inline">{castLabel}</p>

      <article className="adventure-task">
        <h2 ref={headingRef} tabIndex={-1}>
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
                {hint ? ` — ${hint}` : ''}
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

          {trapText ? (
            <p className="adventure-trap" role="note">
              <strong>{t('tech.trap')}</strong>
              <span>{trapText}</span>
            </p>
          ) : null}

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
              onTextChange={onTextChange}
              onFileChange={onFileChange}
            />
          </div>
        </div>

        <div className="adventure-actions">
          <button
            type="button"
            className="btn adventure-cta"
            disabled={!canSubmit}
            onClick={onValidate}
          >
            {t('tech.validate')}
          </button>
        </div>
      </article>
    </section>
  )
}
