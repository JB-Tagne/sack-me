import { describe, expect, it } from 'vitest'
import { STACK_TOOLS } from './tools'
import { onboardingForTool, onboardingForTools } from './toolOnboarding'

describe('toolOnboarding', () => {
  it('covers every stack tool with account + first-use + task guidance', () => {
    for (const tool of STACK_TOOLS) {
      for (const locale of ['fr', 'en'] as const) {
        const g = onboardingForTool(tool.id, locale)
        expect(g, `${tool.id}-${locale}`).toBeTruthy()
        expect(g!.accountSteps.length).toBeGreaterThan(0)
        expect(g!.firstUseSteps.length).toBeGreaterThan(0)
        expect(g!.taskSteps.length).toBeGreaterThan(0)
        expect(g!.withoutAccount.length).toBeGreaterThan(20)
        expect(g!.platformLabel.length).toBeGreaterThan(3)
      }
    }
  })

  it('dedupes multi-tool briefing lists', () => {
    const list = onboardingForTools(['sql', 'sql', 'python'], 'en')
    expect(list.map((g) => g.toolId)).toEqual(['sql', 'python'])
  })
})
