import { describe, expect, it } from 'vitest'
import {
  isPlayerRoleId,
  isProjectKind,
  openingHalfForTrack,
  roleFitsProject,
  rolesForProject,
  trackForRole,
} from './projectPaths'

describe('projectPaths', () => {
  it('exposes IT and Data/AI role sets', () => {
    expect(rolesForProject('it').map((r) => r.id)).toEqual([
      'business-analyst',
      'chef-de-projet',
      'product-owner',
      'scrum-master',
      'technico-fonctionnel',
    ])
    expect(rolesForProject('data-ai').map((r) => r.id)).toEqual([
      'business-analyst',
      'chef-de-projet',
      'product-owner',
      'scrum-master',
      'technico-fonctionnel',
      'data-manager',
      'data-steward',
      'data-governance-manager',
      'ai-governance-manager',
    ])
  })

  it('rejects roles that do not fit the project kind', () => {
    expect(roleFitsProject('it', 'data-steward')).toBe(false)
    expect(roleFitsProject('data-ai', 'business-analyst')).toBe(true)
    expect(roleFitsProject('it', 'technico-fonctionnel')).toBe(true)
    expect(isProjectKind('it')).toBe(true)
    expect(isPlayerRoleId('ai-governance-manager')).toBe(true)
  })

  it('maps roles to PM or governance tracks', () => {
    expect(trackForRole('chef-de-projet')).toBe('pm')
    expect(trackForRole('scrum-master')).toBe('pm')
    expect(trackForRole('data-steward')).toBe('governance')
    expect(trackForRole('data-governance-manager')).toBe('governance')
    expect(trackForRole('ai-governance-manager')).toBe('governance')
    expect(openingHalfForTrack('pm')).toBe('pm')
    expect(openingHalfForTrack('governance')).toBe('gov')
  })
})
