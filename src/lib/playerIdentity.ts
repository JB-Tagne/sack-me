/**
 * Player display name: "First Last" (Prénom Nom). No email.
 * First name is used in UI copy and NPC / meeting dialogue.
 */

export interface PlayerIdentity {
  /** Full display name as entered (normalized spacing). */
  displayName: string
  /** First token — used for addressing the player. */
  firstName: string
}

/** Letters (incl. accents), hyphens, apostrophes; at least First + Last. */
const DISPLAY_NAME_RE =
  /^([\p{L}][\p{L}'’-]*)\s+([\p{L}][\p{L}'’\-]*(?:\s+[\p{L}][\p{L}'’-]*)*)$/u

function titleCaseWord(word: string): string {
  if (!word) return word
  return word.charAt(0).toLocaleUpperCase() + word.slice(1)
}

/** Normalize spacing and lightly title-case each word. */
export function normalizeDisplayName(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(titleCaseWord)
    .join(' ')
}

/**
 * Parse and validate "Prénom Nom" (one or more family-name tokens after first name).
 * Returns null if the format is invalid.
 */
export function parsePlayerDisplayName(raw: string): PlayerIdentity | null {
  const cleaned = normalizeDisplayName(raw)
  if (!cleaned || cleaned.length > 80) return null
  const m = cleaned.match(DISPLAY_NAME_RE)
  if (!m) return null
  return { displayName: cleaned, firstName: m[1]! }
}

export function playerFirstName(displayName: string | undefined | null): string {
  if (!displayName?.trim()) return ''
  const parsed = parsePlayerDisplayName(displayName)
  if (parsed) return parsed.firstName
  return displayName.trim().split(/\s+/)[0] ?? ''
}

/** Replace `{firstName}` / `{prenom}` / `{player}` in content strings. */
export function withPlayerName(text: string, firstName: string): string {
  if (!firstName) return text
  return text
    .replaceAll('{firstName}', firstName)
    .replaceAll('{prenom}', firstName)
    .replaceAll('{player}', firstName)
}

/**
 * Soft-address openings / questions that do not already include the name.
 * Prefixed form: "Alex — …" or "Alex, comment…"
 */
export function addressPlayerLine(text: string, firstName: string): string {
  if (!firstName || !text.trim()) return text
  if (text.includes(firstName)) return text
  const trimmed = text.trim()
  if (/^(Comment|Quelle|Quel|Que |Pourquoi|What|How|Which|Why)\b/i.test(trimmed)) {
    const rest = trimmed.charAt(0).toLocaleLowerCase() + trimmed.slice(1)
    return `${firstName}, ${rest}`
  }
  return `${firstName} — ${trimmed}`
}
