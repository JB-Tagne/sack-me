import type { Ref } from 'react'
import { CampaignCertificate } from '../CampaignCertificate'
import { usePmGameI18n } from '../../i18n/PmGameI18n'

interface LevelCompletePanelProps {
  animKey: number
  headingRef: Ref<HTMLHeadingElement>
  completedLevelId: number
  nextIntro: string
  nextProjectName: string
  showCertificate: boolean
  firstName: string
  roleLabel: string
  company: string
  codename: string
  score: number
  title: string
  shareStatus: 'idle' | 'shared' | 'copied' | 'failed'
  onShare: () => void
  onContinue: () => void
}

/** Batch complete screen (+ optional certificate). */
export function LevelCompletePanel({
  animKey,
  headingRef,
  completedLevelId,
  nextIntro,
  nextProjectName,
  showCertificate,
  firstName,
  roleLabel,
  company,
  codename,
  score,
  title,
  shareStatus,
  onShare,
  onContinue,
}: LevelCompletePanelProps) {
  const { t } = usePmGameI18n()

  return (
    <section key={animKey} className="adventure-panel adventure-enter">
      <div className="adventure-brief-block">
        <h2 ref={headingRef} tabIndex={-1}>
          {t('levelComplete.titlePrefix')} {completedLevelId}
        </h2>
        <p>{nextIntro}</p>
        <p>
          {t('levelComplete.nextBrief')} <strong>{nextProjectName}</strong>
        </p>
      </div>
      {showCertificate && (
        <CampaignCertificate
          firstName={firstName}
          roleLabel={roleLabel}
          company={company}
          codename={codename}
          score={score}
          title={title}
          shareStatus={shareStatus}
          onShare={onShare}
        />
      )}
      <div className="adventure-actions">
        <button type="button" className="btn adventure-cta" onClick={onContinue}>
          {t('levelComplete.seeNext')}
        </button>
      </div>
    </section>
  )
}
