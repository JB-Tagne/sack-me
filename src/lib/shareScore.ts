/** Share / copy career score text for the player. */

import type { PmGameLocale } from '../i18n/pmGameLocale'

export interface ScoreSharePayload {
  score: number
  title: string
  roleLabel: string | null
  company: string
  locale: PmGameLocale
  liveUrl?: string
  playerName?: string
}

export function formatScoreShareText(p: ScoreSharePayload): string {
  const url = p.liveUrl ?? 'https://jb-tagne.github.io/sack-me/'
  if (p.locale === 'en') {
    return [
      `Sack Me! — Mutualis career`,
      p.playerName ? `Player: ${p.playerName}` : null,
      `Title: ${p.title}`,
      p.roleLabel ? `Role: ${p.roleLabel}` : null,
      `Company: ${p.company}`,
      `Score: ${p.score}`,
      url,
    ]
      .filter(Boolean)
      .join('\n')
  }
  return [
    `Sack Me! — carrière Mutualis`,
    p.playerName ? `Joueur : ${p.playerName}` : null,
    `Titre : ${p.title}`,
    p.roleLabel ? `Rôle : ${p.roleLabel}` : null,
    `Entreprise : ${p.company}`,
    `Score : ${p.score}`,
    url,
  ]
    .filter(Boolean)
    .join('\n')
}

export async function shareOrCopyScore(p: ScoreSharePayload): Promise<'shared' | 'copied' | 'failed'> {
  const text = formatScoreShareText(p)
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title: 'Sack Me!', text })
      return 'shared'
    }
  } catch {
    /* fall through to clipboard */
  }
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return 'copied'
    }
  } catch {
    return 'failed'
  }
  return 'failed'
}
