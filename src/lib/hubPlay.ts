/** Micro-interactions — célébrations légères. */

export const HUB_CELEBRATE_EVENT = 'hub-celebrate'

export function buzz(): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = 140
    gain.gain.value = 0.0001
    osc.connect(gain)
    gain.connect(ctx.destination)
    const now = ctx.currentTime
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
    osc.start(now)
    osc.stop(now + 0.3)
    window.setTimeout(() => void ctx.close(), 400)
  } catch {
    // audio non disponible
  }
}

export function celebrate(level: 'soft' | 'strong' = 'soft'): void {
  window.dispatchEvent(
    new CustomEvent(HUB_CELEBRATE_EVENT, { detail: { level } }),
  )
}
