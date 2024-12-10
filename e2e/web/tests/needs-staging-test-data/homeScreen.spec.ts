import { type Browser, type BrowserContext, type Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, isRunningLocally, loginAsE2EUser, proceedAsGuest, withSSR } from '../helpers'
import { test } from '../testmaster'

test.describe('@HomeScreen', () => {
  test('user journey', async ({ browser, page }) => {
    await withSSR(browser, '/', testDisplaysHomeScreenContent)

    await proceedAsGuest(page)

    await testPostScreen(browser, page)

    // These features have no local test data and can only be tested on staging
    if (!isRunningLocally()) return

    await page.goto('/')
  })
})

const testDisplaysHomeScreenContent = async (page: Page) => {
  // Heading is initially hidden, so it can animate in
  await page.waitForSelector(byTestId('home-feed-listing'), { state: 'attached' })
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
