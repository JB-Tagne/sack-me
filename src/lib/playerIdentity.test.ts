import { describe, expect, it } from 'vitest'
import {
  addressPlayerLine,
  normalizeDisplayName,
  parsePlayerDisplayName,
  playerFirstName,
  withPlayerName,
} from './playerIdentity'

describe('parsePlayerDisplayName', () => {
  it('accepts First Last', () => {
    expect(parsePlayerDisplayName('jean dupont')).toEqual({
      displayName: 'Jean Dupont',
      firstName: 'Jean',
    })
  })

  it('accepts accents and compound last names', () => {
    expect(parsePlayerDisplayName('Marie-Claire de La Fontaine')).toEqual({
      displayName: 'Marie-Claire De La Fontaine',
      firstName: 'Marie-Claire',
    })
  })

  it('rejects single token and email', () => {
    expect(parsePlayerDisplayName('Alex')).toBeNull()
    expect(parsePlayerDisplayName('alex@mutualis.com')).toBeNull()
    expect(parsePlayerDisplayName('')).toBeNull()
  })
})

describe('player helpers', () => {
  it('normalizes spacing', () => {
    expect(normalizeDisplayName('  lea   martin ')).toBe('Lea Martin')
  })

  it('extracts first name from stored display name', () => {
    expect(playerFirstName('Sophie Bernard')).toBe('Sophie')
    expect(playerFirstName(undefined)).toBe('')
  })

  it('substitutes placeholders', () => {
    expect(withPlayerName('Salut {firstName} / {prenom}', 'Hugo')).toBe('Salut Hugo / Hugo')
  })

  it('addresses questions and openings', () => {
    expect(addressPlayerLine('Comment tu gères ça ?', 'Léa')).toBe('Léa, comment tu gères ça ?')
    expect(addressPlayerLine("L'équipe se réunit.", 'Léa')).toBe("Léa — L'équipe se réunit.")
  })
})
