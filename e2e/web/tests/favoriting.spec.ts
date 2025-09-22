import { expect } from '@playwright/test'

import { byTestId } from './helpers'
import { test } from './testmaster'

const volunteeringOrTaskCardSelector = [byTestId('volunteering-reco-card'), byTestId('task-reco-card')].join(',')

test.describe('@Favoriting', () => {
  test('should ask to register the good deed, for guests', async ({ page }) => {
    await page.goto('/volunteering')
    await page.click(byTestId('task-reco-card'))

    await page.getByRole('button', { name: 'I’ll do it later' }).click()

    await expect(page.getByRole('heading', { name: 'Step one’s done!' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Join holi.social' })).toBeVisible()
  })

  test('registered users', async ({ authenticatedSession: { page } }) => {
    const opportunityTitle = await test.step('Should allow a user to favorite a volunteering opportunity', async () => {
      await page.goto('/volunteering')
      await page.click(volunteeringOrTaskCardSelector)

      await page.getByRole('button', { name: 'I’ll do it later' }).click()

      await expect(page.getByRole('button', { name: 'Saved for later' })).toBeVisible()
      return await page.getByTestId('detailview-title').first().textContent()
    })

    await test.step('Shoud be able to view the favorited opportunity', async () => {
      // click confirmation toast to navigate to favorites list
      await page.getByLabel('Go to favorites').click()
      await page.getByText('Favorites')

      const card = page.locator(volunteeringOrTaskCardSelector).first()

      await expect(card).toBeVisible({ timeout: 10000 })
      await expect(card).toContainText(opportunityTitle!)
    })
  })
})
