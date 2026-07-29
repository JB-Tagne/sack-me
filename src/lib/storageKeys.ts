/** Clés localStorage My Pro Hub (+ migration depuis john-pro-hub). */

export function readMigratedLocalStorage(key: string, legacyKey: string): string | null {
  try {
    const cur = localStorage.getItem(key)
    if (cur != null) return cur
    const legacy = localStorage.getItem(legacyKey)
    if (legacy == null) return null
    localStorage.setItem(key, legacy)
    return legacy
  } catch {
    return null
  }
}
