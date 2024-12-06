import { type Page, expect } from '@playwright/test'

import { clickElementByTestId, clickElementByTestIdAndWaitForToast } from './helpers'
import { test } from './testmaster'

// These tests are currently disabled until we have a final plan for insights in the home feed
test.describe('@Insights', () => {
  test.skip('Favorites work', async ({ authenticatedSession: { page } }) => {
    await goToFirstInsight(page)
    const insightHeadline = await page.getByTestId('insight-headline').innerText()

    // when favoriting the insight in the drawer menu
    await clickElementByTestId(page, 'btn-insight-more-options')
    await expect(page.getByTestId('more-options-modal-animatedview')).toBeVisible()

    // then a toast is displayed
    await clickElementByTestIdAndWaitForToast(page, 'btn-favorite-insight', 'toast-SUCCESS')

    // and the drawer menu entry changes to remove favorite
    await clickElementByTestId(page, 'btn-insight-more-options')
    await expect(page.getByTestId('btn-remove-insight-favorite')).toBeVisible()

    // and the list of favorites contains the insight
    await clickElementByTestId(page, 'btn-see-all-favorites')
    await expect(page.getByTestId('favorites-list')).toBeVisible()
    await expect(page.getByTestId('favorites-card')).toBeVisible()
    await expect(page.getByTestId('favorites-card')).toContainText(insightHeadline)

    // when un-favoriting
    await clickElementByTestId(page, 'btn-favorites-more-options')
    await expect(page.getByTestId('more-options-modal-animatedview')).toBeVisible()
    await clickElementByTestIdAndWaitForToast(page, 'btn-remove-favorite', 'toast-SUCCESS')

    // then the card isn't shown anymore and the empty placeholder illustration shown
    await expect(page.getByTestId('favorites-card')).not.toBeVisible()
    await expect(page.getByTestId('favorites-empty')).toBeVisible()

    // and the favorite is favoritable again in the insight drawer
    await clickElementByTestId(page, 'nav-button-back')
    await expect(page.getByTestId('insight-headline')).toBeVisible()
    await clickElementByTestId(page, 'btn-insight-more-options')
    await expect(page.getByTestId('more-options-modal-animatedview')).toBeVisible()
    await expect(page.getByTestId('btn-favorite-insight')).toBeVisible()
  })
})

const goToFirstInsight = async (page: Page) => {
  await clickElementByTestId(page, 'feed-insight-image-link')
  await expect(page.getByTestId('insight-headline')).toBeVisible()
}
