import { test } from '@playwright/test'

import { checkAccessibility, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  /*
  await page.route('/api/graphql', async (route, request) => {
    const headers = await request.allHeaders()
    console.log('allHeaders', request.url(), headers)
    const newHeaders = {
      ...headers,
      Authorization: 'Basic ZDN2czBubHk6WWFnbmkh',
    }
    console.log('newHeaders', newHeaders)
    route.continue({
      headers: newHeaders,
    })
  })
  */
})

test.describe('@Accessibility', () => {
  test('should work', async ({ page }) => {
    await waitForElementByTestId(page, 'home-feed-insights-heading')
    await checkAccessibility(page)

    const profileButton = await locateElementByTestId(page, 'btn-to-profile-view')
    await profileButton.click()
    await waitForElementByTestId(page, 'user-profile-logged-out-heading')
    await checkAccessibility(page)

    const homeButton = await locateElementByTestId(page, 'btn-to-home-view')
    await homeButton.click()
    await waitForElementByTestId(page, 'home-feed-insights-heading') // this weeks insights
    await checkAccessibility(page)
  })
})
