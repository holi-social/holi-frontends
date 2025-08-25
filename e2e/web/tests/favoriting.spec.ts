import { expect } from '@playwright/test'

import { byTestId, clickElementByTestId } from './helpers'
import { test } from './testmaster'

const volunteeringOrTaskCardSelector = [byTestId('volunteering-reco-card'), byTestId('task-reco-card')].join(',')

test.describe('@Favoriting', () => {
  test('shows login modal for guests', async ({ page: guest }) => {
    await guest.goto('/volunteering')
    await guest.click(volunteeringOrTaskCardSelector)

    await clickElementByTestId(guest, 'save-for-later-button')

    await expect(guest.getByTestId('login-guard-modal-confirmation-dialog')).toBeVisible()
  })

  test('works for registered users', async ({ sessions }) => {
    const { page: user } = await sessions.signUp()

    let title_of_favorited_vo

    await test.step('user can favorite a vo in the good deeds view', async () => {
      await user.goto('/volunteering')

      await user.click(volunteeringOrTaskCardSelector)

      title_of_favorited_vo = await user.getByTestId('detailview-title').first().textContent()
      await clickElementByTestId(user, 'save-for-later-button')

      await expect(user.getByTestId('unsave-for-later-button')).toBeVisible()
    })

    await test.step('user can see the favorite in the profile favorite list', async () => {
      // click confirmation toast to navigate to favorites list
      await user.getByLabel('Go to favorites').click()

      await expect(user.getByText('Favorites')).toBeVisible()

      const card = user.locator(volunteeringOrTaskCardSelector).first()

      await expect(card).toBeVisible({ timeout: 10000 })
      await expect(card).toContainText(title_of_favorited_vo!)
    })
  })
})
