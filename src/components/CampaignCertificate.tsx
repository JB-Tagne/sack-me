import { usePmGameI18n } from '../i18n/PmGameI18n'

interface CampaignCertificateProps {
  firstName?: string
  roleLabel: string
  company: string
  codename: string
  score: number
  title: string
  onShare: () => void
  shareStatus: 'idle' | 'shared' | 'copied' | 'failed'
}

/** Shown when the player finishes curated batches 0–5. */
export function CampaignCertificate({
  firstName = '',
  roleLabel,
  company,
  codename,
  score,
  title,
  onShare,
  shareStatus,
}: CampaignCertificateProps) {
  const { t } = usePmGameI18n()
  return (
    <aside className="adventure-certificate" aria-label={t('cert.title')}>
      <p className="adventure-certificate-eyebrow">{t('cert.eyebrow')}</p>
      <h3 className="adventure-certificate-title">{t('cert.title')}</h3>
      <p className="adventure-certificate-body">
        {t('cert.body', {
          firstName,
          role: roleLabel,
          company,
          codename,
        })}
      </p>
      <p className="adventure-certificate-score">
        {t('cert.score')}: <strong>{score}</strong> · {title}
      </p>
      <button type="button" className="btn secondary" onClick={onShare}>
        {t('cert.share')}
      </button>
      {shareStatus === 'copied' && <p className="adventure-certificate-status">{t('cert.copied')}</p>}
      {shareStatus === 'shared' && <p className="adventure-certificate-status">{t('cert.shared')}</p>}
      {shareStatus === 'failed' && <p className="adventure-certificate-status">{t('cert.failed')}</p>}
    </aside>
  )
}
