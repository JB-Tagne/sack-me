import { describe, expect, it } from 'vitest'
import {
  assertRoleStacks,
  ROLE_TOOL_STACKS,
  toolsForRole,
} from './roleToolStacks'
import { rolesForProject } from './projectPaths'

describe('roleToolStacks', () => {
  it('defines exactly 10 tools for every project×role', () => {
    expect(() => assertRoleStacks()).not.toThrow()
    for (const kind of ['it', 'data-ai'] as const) {
      for (const role of rolesForProject(kind)) {
        const stack = toolsForRole(kind, role.id)
        expect(stack, `${kind}/${role.id}`).toHaveLength(10)
      }
    }
  })

  it('uses DataGalaxy (not Collibra) on governance roles', () => {
    for (const key of [
      'data-ai__data-manager',
      'data-ai__data-steward',
      'data-ai__data-governance-manager',
      'data-ai__ai-governance-manager',
    ] as const) {
      const names = ROLE_TOOL_STACKS[key].map((t) => t.name.toLowerCase())
      expect(names.some((n) => n.includes('datagalaxy'))).toBe(true)
      expect(names.some((n) => n.includes('collibra'))).toBe(false)
    }
  })
})
