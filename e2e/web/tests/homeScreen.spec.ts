import { BrowserContext, Page, expect, test } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  defaultAuthSteps,
  locateElementByTestId,
  waitForAnimationEnd,
  waitForElementByTestId,
} from './helpers'

test.setTimeout(120000)
const insightLoadMoreTimeout = { timeout: 30000 }

test.describe('@HomeScreen', () => {
  test('user journey', async ({ context, page }) => {
    // prepare
    await page.goto('/')
    await clickElementByTestId(page, 'btn-to-continue-as-guest')

    await testInsightsSection(page)

    await testAllowPaginationForInsightList(page)

    await testInsightsEditors(page)

    await testAppUpdatesVisible(page, 'donations')

    await testAppUpdatesVisible(page, 'goodnews')

    await testAppUpdatesVisible(page, 'volunteering')

    await testUserSuggestions(page, context)
  })
})

const testAllowPaginationForInsightList = async (page: Page) => {
  await waitForElementByTestId(page, 'btn-insights-list-load-more')

  const countListItems = async () => {
    const listItems = await locateElementByTestId(page, 'feed-insight-image-link')
    return await listItems.count()
  }

  const listItemCountBefore = await countListItems()
  await clickElementByTestId(page, 'btn-insights-list-load-more')
  await expect.poll(countListItems, insightLoadMoreTimeout).toBeGreaterThan(listItemCountBefore)
}

const testAppUpdatesVisible = async (page: Page, app: string) => {
  await waitForElementByTestId(page, `${app}-updates-heading`)
  await waitForElementByTestId(page, `${app}-updates-container`)
  await waitForElementByTestId(page, `${app}-updates-item`)
}

const testInsightsSection = async (page: Page) => {
  // has feed insight headline
  await waitForElementByTestId(page, 'home-feed-insights-heading')

  // has feed insight items and clicking them leads to insight detail page
  await clickElementByTestId(page, 'feed-insight-image-link')
  await page.waitForURL('**/insights/**')
  await page.goto('/')
}
const testInsightsEditors = async (page: Page) => {
  // opens editors list upon clicking in avatar pile and shows insight editor cards
  await clickElementByTestId(page, 'avatar-pile-open-modal-button')
  await waitForAnimationEnd(page.locator(byTestId('insight-editors-modal-animatedview')))
  await waitForElementByTestId(page, 'insight-editors-modal')
  await waitForElementByTestId(page, 'user-card')
  await clickElementByTestId(page, 'insight-editors-close-btn')
  await waitForAnimationEnd(page.locator(byTestId('insight-editors-modal-animatedview')))
}
const testUserSuggestions = async (page: Page, context: BrowserContext) => {
  await waitForElementByTestId(page, 'home-feed-insights-heading')
  // shows no user suggestions if logged out
  await expect(page.locator(byTestId('user-suggestions'))).toHaveCount(0)

  // shows 10 user suggestions if logged in
  await defaultAuthSteps({ page, context })
  await page.locator(byTestId('btn-to-home-view')).click()
  await page.waitForSelector(byTestId('user-suggestions'))
  await expect(page.locator(byTestId('user-card-suggestion'))).toHaveCount(10)
  //await expect(page.locator(byTestId('user-card-suggestion'))).toHaveCount(0)
}
