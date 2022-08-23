import { test } from '@playwright/test'
import { injectAxe } from 'axe-playwright'

import { checkAccessibility, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
})

test.describe('@Accessibility', () => {
  test('should work', async ({ page }) => {
    await waitForElementByTestId(page, 'home-feed-topics-heading')
    await checkAccessibility(page)

    const profileButton = await locateElementByTestId(page, 'btn-to-profile-view')
    await profileButton.click()
    await waitForElementByTestId(page, 'user-profile-logged-out-heading')
    await checkAccessibility(page)

    const homeButton = await locateElementByTestId(page, 'nav-button-home')
    await homeButton.click()
    await waitForElementByTestId(page, 'home-feed-topics-heading') // this weeks topics
    await checkAccessibility(page)

    const volunteeringAppButton = await locateElementByTestId(page, 'app-tile-volunteering')
    await volunteeringAppButton.click()
    await waitForElementByTestId(page, 'apps-volunteering-heading')
    await checkAccessibility(page)
  })
})
