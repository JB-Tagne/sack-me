import type { Ref } from 'react'
import type { AdventureLevel } from '../../data/dataStack/adventure'
import { castingChip, type ExerciseCasting } from '../../data/dataStack/mutualisEntities'
import { onboardingForTools } from '../../data/dataStack/toolOnboarding'
import type { ToolId } from '../../data/dataStack/tools'
import { usePmGameI18n } from '../../i18n/PmGameI18n'
import { ToolOnboardingPanel } from '../ToolOnboardingPanel'

interface BriefingPanelProps {
  animKey: number
  headingRef: Ref<HTMLHeadingElement>
  level: AdventureLevel
  phaseLabelText: string
  toolsLine: string
  lotCast: ExerciseCasting
  marketStackNames: string[]
  onLaunch: () => void
}

/** Lot briefing before tasks. */
export function BriefingPanel({
  animKey,
  headingRef,
  level,
  phaseLabelText,
  toolsLine,
  lotCast,
  marketStackNames,
  onLaunch,
}: BriefingPanelProps) {
  const { locale, t } = usePmGameI18n()
  const brief = level.brief
  const totalSteps = level.steps.length

  return (
    <section key={animKey} className="adventure-panel adventure-enter">
      <p className="adventure-level-chip">
        {t('brief.level')} {level.id} · {level.title}
        <span>{phaseLabelText}</span>
      </p>

      <article className="adventure-brief">
        <h2 ref={headingRef} tabIndex={-1}>
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
          {t('brief.tools')} : <strong>{toolsLine || '—'}</strong>
          {' · '}
          {totalSteps} {totalSteps > 1 ? t('brief.tasks_plural') : t('brief.tasks')}
        </p>

        {marketStackNames.length > 0 && (
          <div className="adventure-brief-block">
            <h3>{t('brief.roleStack')}</h3>
            <p className="adventure-brief-stack">{marketStackNames.join(' · ')}</p>
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
        <button type="button" className="btn adventure-cta" onClick={onLaunch}>
          {t('brief.launch')}
        </button>
      </div>
    </section>
  )
}
