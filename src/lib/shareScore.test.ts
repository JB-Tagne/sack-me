import { describe, expect, it } from 'vitest'
import { formatScoreShareText } from './shareScore'

describe('shareScore', () => {
  it('formats FR and EN share text', () => {
    const fr = formatScoreShareText({
      score: 42,
      title: 'Junior',
      roleLabel: 'Scrum Master',
      company: 'Mutualis Retail',
      locale: 'fr',
    })
    expect(fr).toContain('Score : 42')
    expect(fr).toContain('Scrum Master')

    const en = formatScoreShareText({
      score: 42,
      title: 'Junior',
      roleLabel: 'Scrum Master',
      company: 'Mutualis Retail',
      locale: 'en',
    })
    expect(en).toContain('Score: 42')
    expect(en).toContain('jb-tagne.github.io/sack-me')
  })
})
