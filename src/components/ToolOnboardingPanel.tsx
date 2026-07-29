import { onboardingForTool, type ToolOnboarding } from '../data/dataStack/toolOnboarding'
import type { ToolId } from '../data/dataStack/tools'
import { usePmGameI18n } from '../i18n/PmGameI18n'

interface ToolOnboardingPanelProps {
  tool?: ToolId
  /** Affichage compact (briefing multi-outils). */
  guide?: ToolOnboarding
  defaultOpen?: boolean
}

export function ToolOnboardingPanel({
  tool,
  guide: guideProp,
  defaultOpen = true,
}: ToolOnboardingPanelProps) {
  const { locale, t } = usePmGameI18n()
  const guide = guideProp ?? onboardingForTool(tool, locale)
  if (!guide) return null

  return (
    <details className="adventure-onboarding" open={defaultOpen}>
      <summary>
        {t('onboarding.summary')} {guide.platformLabel}
        {!guide.freePath ? ` ${t('onboarding.noFree')}` : ''}
      </summary>
      <div className="adventure-onboarding-body">
        <p className="adventure-onboarding-lead">{t('onboarding.lead')}</p>

        {guide.signupUrl && (
          <p className="adventure-onboarding-link">
            <a href={guide.signupUrl} target="_blank" rel="noreferrer noopener">
              {guide.signupLabel ?? t('onboarding.signup')}
            </a>
          </p>
        )}

        <section>
          <h4>{t('onboarding.account')}</h4>
          <ol>
            {guide.accountSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section>
          <h4>{t('onboarding.first')}</h4>
          <ol>
            {guide.firstUseSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section>
          <h4>{t('onboarding.task')}</h4>
          <ol>
            {guide.taskSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <p className="adventure-onboarding-fallback">
          <strong>{t('onboarding.fallback')}</strong> {guide.withoutAccount}
        </p>
      </div>
    </details>
  )
}
