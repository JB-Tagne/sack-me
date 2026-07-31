import { MUTUALIS_GROUP_NAME } from '../data/dataStack/mutualisEntities'
import type { PmGameLocale } from '../i18n/pmGameLocale'

interface WelcomeStoryHookArgs {
  locale: PmGameLocale
  firstName: string
  codename: string
  tagline: string
  companyName: string
  roleLabel: string
}

interface WelcomeJoinHookArgs {
  locale: PmGameLocale
  firstName: string
  roleLabel: string
  companyName: string
  trackLabel: string
}

/** Build the welcome hook when a Mutualis role story is active. */
export function welcomeStoryHook({
  locale,
  firstName,
  codename,
  tagline,
  companyName,
  roleLabel,
}: WelcomeStoryHookArgs): string {
  const prefix = firstName ? `${firstName} — ` : ''
  const line = tagline.replace(/Mutualis Retail/gi, companyName)
  if (locale === 'en') {
    return `${prefix}${codename} — assigned to ${companyName} (${MUTUALIS_GROUP_NAME}) as ${roleLabel}. ${line}`
  }
  return `${prefix}${codename} — affecté(e) à ${companyName} (${MUTUALIS_GROUP_NAME}) en tant que ${roleLabel}. ${line}`
}

/** Build the welcome hook when only role + company are known. */
export function welcomeJoinHook({
  locale,
  firstName,
  roleLabel,
  companyName,
  trackLabel,
}: WelcomeJoinHookArgs): string {
  const prefix = firstName ? `${firstName}, ` : ''
  if (locale === 'en') {
    return `${prefix}you join as ${roleLabel} at ${companyName} — ${trackLabel} track.`
  }
  return `${prefix}tu intègres le poste de ${roleLabel} chez ${companyName} — piste ${trackLabel}.`
}
