import { useEffect, useState } from 'react'
import { HUB_CELEBRATE_EVENT } from '../lib/hubPlay'

interface Burst {
  id: number
  level: 'soft' | 'strong'
}

/** Confettis CSS légers — déclenchés via celebrate() / hub-celebrate. */
export function ConfettiBurst() {
  const [bursts, setBursts] = useState<Burst[]>([])

  useEffect(() => {
    function onCelebrate(e: Event) {
      const detail = (e as CustomEvent<{ level?: 'soft' | 'strong' }>).detail
      const level = detail?.level === 'strong' ? 'strong' : 'soft'
      const id = Date.now()
      setBursts((b) => [...b, { id, level }])
      window.setTimeout(() => {
        setBursts((b) => b.filter((x) => x.id !== id))
      }, level === 'strong' ? 2200 : 1400)
    }
    window.addEventListener(HUB_CELEBRATE_EVENT, onCelebrate)
    return () => window.removeEventListener(HUB_CELEBRATE_EVENT, onCelebrate)
  }, [])

  if (bursts.length === 0) return null

  return (
    <div className="confetti-layer" aria-hidden>
      {bursts.map((b) => (
        <div key={b.id} className={`confetti-burst confetti-${b.level}`}>
          {Array.from({ length: b.level === 'strong' ? 28 : 14 }, (_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={
                {
                  '--i': i,
                  '--x': `${(i % 7) * 14 - 42}vw`,
                  '--rot': `${i * 47}deg`,
                  '--delay': `${(i % 8) * 0.04}s`,
                  '--hue': i % 3 === 0 ? 'var(--accent)' : i % 3 === 1 ? 'var(--warm)' : 'var(--ok)',
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}
