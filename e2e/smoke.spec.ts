import { expect, test } from '@playwright/test'

test.describe('Sack Me! smoke', () => {
  test('FR path reaches career pick', async ({ page }) => {
    await page.goto('./')
    await expect(page.getByRole('heading', { name: 'Sack Me!' })).toBeVisible()
    await page.getByRole('button', { name: 'Français' }).click()
    await page.getByRole('button', { name: 'Continuer' }).click()
    await expect(
      page.getByRole('heading', { name: /Choisis ton entreprise/i }),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('EN path reaches career pick', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: 'English' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(
      page.getByRole('heading', { name: /Choose your company/i }),
    ).toBeVisible({ timeout: 15_000 })
  })
})
