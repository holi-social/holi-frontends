import { BrowserContext, Page, expect } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  donationsRequestTimeout,
  goodnewsRequestTimeout,
  loginAsE2EUser,
  proceedAsGuest,
  volunteeringRequestTimeout,
} from './helpers'
import { test } from './testmaster'

test.setTimeout(120000)

test.describe('@HomeScreen', () => {
  test('user journey', async ({ context, page, browserName }) => {
    // prepare
    await proceedAsGuest(page)

    await testInsightsSection(page)

    await testShowInsightsScreen(page)

    await testInsightsEditors(page)

    await testAppUpdatesVisible(page, 'donations', donationsRequestTimeout)

    await testAppUpdatesVisible(page, 'goodnews', goodnewsRequestTimeout)

    await testAppUpdatesVisible(page, 'volunteering', volunteeringRequestTimeout)

    // FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug `Error: page.goto: Navigation to "http://localhost:3000/profile/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0" is interrupted by another navigation to "http://localhost:3000/profile"`
    if (browserName === 'webkit') return
    await testUserSuggestions(page, context)
  })
})

const testShowInsightsScreen = async (page: Page) => {
  await page.waitForSelector(byTestId('btn-navigate-to-insights'))

  // navigate to insights
  await clickElementByTestId(page, 'btn-navigate-to-insights')

  // go home
  await page.locator(byTestId('nav-button-back')).click()
}

const testAppUpdatesVisible = async (page: Page, app: string, timeout: number) => {
  await page.waitForSelector(byTestId(`${app}-updates-heading`), { timeout: timeout })
  await page.waitForSelector(byTestId(`${app}-updates-container`), { timeout: timeout })
  await page.waitForSelector(byTestId(`${app}-updates-item`), { timeout: timeout })
}

const testInsightsSection = async (page: Page) => {
  // has feed insight headline
  await page.waitForSelector(byTestId('home-feed-insights-heading'))

  // has feed insight items and clicking them leads to insight detail page
  await clickElementByTestId(page, 'feed-insight-image-link')
  await page.waitForURL('**/insights/**')
  await page.goto('/')
}
const testInsightsEditors = async (page: Page) => {
  // opens editors list upon clicking in avatar pile and shows insight editor cards
  await clickElementByTestId(page, 'avatar-pile-open-modal-button')
  await page.waitForSelector(byTestId('insight-editors-modal'))
  await page.waitForSelector(byTestId('user-card'))
  await clickElementByTestId(page, 'insight-editors-close-btn')
}
const testUserSuggestions = async (page: Page, context: BrowserContext) => {
  await page.waitForSelector(byTestId('home-feed-insights-heading'))
  // shows no user suggestions if logged out
  await expect(page.locator(byTestId('user-suggestions'))).toHaveCount(0)

  // shows 10 user suggestions if logged in
  await loginAsE2EUser(context, page)
  await page.locator(byTestId('btn-to-home-view')).click()
  await page.waitForSelector(byTestId('user-suggestions'))
  await expect(page.locator(byTestId('user-card-suggestion'))).toHaveCount(10)
}
