import type { Ref } from 'react'
import type { MutualisEntity } from '../../data/dataStack/mutualisEntities'
import { usePmGameI18n } from '../../i18n/PmGameI18n'
import { welcomeJoinHook, welcomeStoryHook } from '../../lib/welcomeHook'

interface RoleStoryView {
  codename: string
  tagline: string
  scope: string
}

interface WelcomePanelProps {
  animKey: number
  headingRef: Ref<HTMLHeadingElement>
  firstName: string
  roleTrack: 'pm' | 'governance'
  pathRoleLabel: string | null
  trackLabelText: string
  homeCompany: MutualisEntity
  campaignStory: RoleStoryView | null
  castHint: string
  resumeLabel: string | null
  onStart: () => void
}

/** Post–career-pick welcome / stakes panel. */
export function WelcomePanel({
  animKey,
  headingRef,
  firstName,
  roleTrack,
  pathRoleLabel,
  trackLabelText,
  homeCompany,
  campaignStory,
  castHint,
  resumeLabel,
  onStart,
}: WelcomePanelProps) {
  const { locale, t } = usePmGameI18n()

  const hook = campaignStory
    ? welcomeStoryHook({
        locale,
        firstName,
        codename: campaignStory.codename,
        tagline: campaignStory.tagline,
        companyName: homeCompany.name,
        roleLabel: pathRoleLabel ?? '',
      })
    : pathRoleLabel
      ? welcomeJoinHook({
          locale,
          firstName,
          roleLabel: pathRoleLabel,
          companyName: homeCompany.name,
          trackLabel: trackLabelText,
        })
      : t('welcome.hook', { firstName })

  return (
    <section key={animKey} className="adventure-panel adventure-enter">
      <div className="adventure-brief-block adventure-welcome">
        <h2 ref={headingRef} tabIndex={-1}>
          {t('welcome.title', { firstName })}
        </h2>
        <p className="adventure-welcome-hook">{hook}</p>
        {campaignStory && (
          <p className="adventure-welcome-scope">
            <strong>{t('welcome.homeCompany')}</strong>
            {` · ${homeCompany.name} · ${homeCompany.domain[locale]}`}
            <br />
            {castHint}
            <br />
            <strong>{t('welcome.scope')}</strong>
            {` · ${campaignStory.scope}`}
          </p>
        )}
        <p>{t(roleTrack === 'governance' ? 'welcome.job.gov' : 'welcome.job.pm')}</p>
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
        <p className="adventure-welcome-cta-line">{t('welcome.ctaLine', { firstName })}</p>
      </div>
      <div className="adventure-actions">
        <button type="button" className="btn adventure-cta" onClick={onStart}>
          {resumeLabel ?? t('welcome.start')}
        </button>
      </div>
    </section>
  )
}
