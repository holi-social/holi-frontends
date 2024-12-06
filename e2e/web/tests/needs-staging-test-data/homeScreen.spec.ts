import { type Browser, type BrowserContext, type Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, isRunningLocally, loginAsE2EUser, proceedAsGuest, withSSR } from '../helpers'
import { test } from '../testmaster'

test.describe('@HomeScreen', () => {
  test('user journey', async ({ browser, context, page }) => {
    await withSSR(browser, '/', testDisplaysHomeScreenContent)

    await proceedAsGuest(page)

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
