import { Page, expect } from '@playwright/test'

import { clickElementByTestId, clickElementByTestIdAndWaitForToast } from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@Insights', () => {
  test('Favorites work', async ({ userHandler }) => {
    await userHandler.asRandomUser(async (user) => {
      // given an open insight
      await clickElementByTestId(user, 'btn-to-home-view')
      await goToFirstInsight(user)
      const insightHeadline = await user.getByTestId('insight-headline').innerText()

      // when favoriting the insight in the drawer menu
      await clickElementByTestId(user, 'btn-insight-more-options')
      await expect(user.getByTestId('more-options-modal-animatedview')).toBeVisible()

      // then a toast is displayed
      await clickElementByTestIdAndWaitForToast(user, 'btn-bookmark-insight', 'toast-SUCCESS')

      // and the drawer menu entry changes to remove favorite
      await clickElementByTestId(user, 'btn-insight-more-options')
      await expect(user.getByTestId('btn-remove-insight-bookmark')).toBeVisible()

      // and the list of favorites contains the insight
      await clickElementByTestId(user, 'btn-see-all-favorites')
      await expect(user.getByTestId('favorites-list')).toBeVisible()
      await expect(user.getByTestId('favorites-card')).toBeVisible()
      await expect(user.getByTestId('favorites-card')).toContainText(insightHeadline)

      // when un-favoriting
      await clickElementByTestId(user, 'btn-favorites-more-options')
      await expect(user.getByTestId('more-options-modal-animatedview')).toBeVisible()
      await clickElementByTestIdAndWaitForToast(user, 'btn-remove-favorite-bookmark', 'toast-SUCCESS')

      // then the card isn't shown anymore and the empty placeholder illustration shown
      await expect(user.getByTestId('favorites-card')).not.toBeVisible()
      await expect(user.getByTestId('favorites-empty')).toBeVisible()

      // and the favorite is favoritable again in the insight drawer
      await clickElementByTestId(user, 'nav-button-back')
      await expect(user.getByTestId('insight-headline')).toBeVisible()
      await clickElementByTestId(user, 'btn-insight-more-options')
      await expect(user.getByTestId('more-options-modal-animatedview')).toBeVisible()
      await expect(user.getByTestId('btn-bookmark-insight')).toBeVisible()
    })
  })
})

const goToFirstInsight = async (page: Page) => {
  await clickElementByTestId(page, 'feed-insight-image-link')
  await expect(page.getByTestId('insight-headline')).toBeVisible()
}
