import { type Browser, type BrowserContext, type Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, isRunningLocally, loginAsE2EUser, proceedAsGuest, withSSR } from '../helpers'
import { test } from '../testmaster'

test.describe('@HomeScreen', () => {
  test('user journey', async ({ browser, context, page }) => {
    await withSSR(browser, '/', testDisplaysHomeScreenContent)

    await proceedAsGuest(page)

    await testInsightsSection(browser, page)

    await testInsightsEditors(page)

    await testShowInsightsScreen(page)

    await testPostScreen(browser, page)

    // These features have no local test data and can only be tested on staging
    if (isRunningLocally()) return

    await page.goto('/')

    await testUserSuggestions(page, context)
  })
})

const testDisplaysHomeScreenContent = async (page: Page) => {
  // Heading is initially hidden, so it can animate in
  await page.waitForSelector(byTestId('home-feed-listing'), { state: 'attached' })
  await page.waitForSelector(byTestId('posts-list-results'))
  await page.waitForSelector(byTestId('btn-navigate-to-insights'))
}

const testDisplaysInsightDetails = async (page: Page) => {
  await page.waitForSelector(byTestId('insight-headline'))
  await page.waitForSelector(byTestId('insight-description'))
}

const testShowInsightsScreen = async (page: Page) => {
  await page.waitForSelector(byTestId('btn-navigate-to-insights'))

  // navigate to insights
  await clickElementByTestId(page, 'btn-navigate-to-insights')

  // go home
  await page.locator(byTestId('nav-button-back')).click()
}

const testInsightsSection = async (browser: Browser, page: Page) => {
  // has feed insight headline
  await page.waitForSelector(byTestId('home-feed-listing'))

  // has feed insight items and clicking them leads to insight detail page
  await clickElementByTestId(page, 'feed-insight-image-link')
  await page.waitForURL('**/insights/**')

  await testDisplaysInsightDetails(page)
  await withSSR(browser, page.url(), testDisplaysInsightDetails)

  // navigate back
  await page.locator(byTestId('btn-to-home-view')).click()
  await page.waitForSelector(byTestId('home-feed-listing'))
}
const testInsightsEditors = async (page: Page) => {
  // opens editors list upon clicking in avatar pile and shows insight editor cards
  await clickElementByTestId(page, 'avatar-pile-open-modal-button')
  await page.waitForSelector(byTestId('insight-editors-modal'))
  await page.waitForSelector(byTestId('user-card'))
  await clickElementByTestId(page, 'insight-editors-close-btn')
}
const testUserSuggestions = async (page: Page, context: BrowserContext) => {
  await page.waitForSelector(byTestId('home-feed-listing'))
  // shows no user suggestions if logged out
  await expect(page.locator(byTestId('user-suggestions'))).toHaveCount(0)

  // shows 10 user suggestions if logged in
  await loginAsE2EUser(context, page)
  await page.waitForSelector(byTestId('user-suggestions'))
  await expect(page.locator(byTestId('user-card-suggestion'))).toHaveCount(10)
}

const testDisplaysPostDetails = async (page: Page) => {
  await page.waitForSelector(byTestId('post-detail-page'))
  await page.waitForSelector(byTestId('post-content-container'))
}

const testPostScreen = async (browser: Browser, page: Page) => {
  // click on first post
  await clickElementByTestId(page, 'post-card-detail-view-btn')

  await testDisplaysPostDetails(page)
  await withSSR(browser, page.url(), testDisplaysPostDetails)
}
