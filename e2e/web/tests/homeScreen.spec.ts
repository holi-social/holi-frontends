import { expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  defaultAuthSteps,
  locateElementByTestId,
  waitForElementByTestId,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const insightLoadMoreTimeout = { timeout: 30_000 }

test.describe('@HomeScreen', () => {
  test('has feed insight headline', async ({ page }) => {
    await waitForElementByTestId(page, 'home-feed-insights-heading')
  })

  test('has feed insight items and clicking them leads to overview page.', async ({ page }) => {
    await Promise.all([
      page.waitForNavigation({ url: '**/insights/**' }),
      clickElementByTestId(page, 'feed-insight-image-link'),
    ])
    expect(page.url()).toContain('/insights/')
  })

  test('allow pagination for insight list', async ({ page }) => {
    await waitForElementByTestId(page, 'btn-insights-list-load-more')

    const countListItems = async () => {
      const listItems = await locateElementByTestId(page, 'feed-insight-image-link')
      return await listItems.count()
    }

    const listItemCountBefore = await countListItems()
    await clickElementByTestId(page, 'btn-insights-list-load-more')
    await expect.poll(countListItems, insightLoadMoreTimeout).toBeGreaterThan(listItemCountBefore)
  })

  test('has feed insight editors avatar pile.', async ({ page }) => {
    // make sure the feed contains the corresponding avatar pile for its editors
    await page.waitForSelector(byTestId('avatar-pile-open-modal-button'))
  })

  test('opens editors list upon clicking in avatar pile and shows insight editor cards.', async ({ page }) => {
    await page.waitForSelector(byTestId('avatar-pile-open-modal-button'))
    await page.locator(byTestId('avatar-pile-open-modal-button')).first().click()
    await page.locator(byTestId('user-cards-modal-content'))
    await page.locator(byTestId('user-card'))
  })

  test('shows no user suggestions if logged out.', async ({ page }) => {
    await expect(await page.locator(byTestId('user-suggestions'))).toHaveCount(0)
  })

  test('shows 10 user suggestions if logged in.', async ({ page, context }) => {
    await defaultAuthSteps({ page, context })
    await page.locator(byTestId('btn-to-home-view')).click()
    await page.waitForSelector(byTestId('user-suggestions'))
    expect(await page.locator(byTestId('user-card-suggestion'))).toHaveCount(10)
  })

  test('should display donation updates', async ({ page }) => {
    // navigate to home and check if donation updates are displayed
    await waitForElementByTestId(page, 'donations-updates-heading')
    await waitForElementByTestId(page, 'donations-updates-container')
    await waitForElementByTestId(page, 'donations-updates-item')
    await checkAccessibility(page)

    // click first element in ScrollView
    await clickElementByTestId(page, 'donations-updates-item')

    // expect detail view
    await waitForElementByTestId(page, 'donations-project-detail-heading')

    // navigate back
    await clickElementByTestId(page, 'nav-button-back')

    // click on "see more" / navigate to donations app
    await clickElementByTestId(page, 'donations-updates-load-more-button')
    await waitForElementByTestId(page, 'donations-list-container')
  })

  test('should display good news updates', async ({ page }) => {
    // navigate to home and check if good news updates are displayed
    await waitForElementByTestId(page, 'goodnews-updates-heading')
    await waitForElementByTestId(page, 'goodnews-updates-container')
    await waitForElementByTestId(page, 'goodnews-updates-item')
    await checkAccessibility(page)

    // click first element in ScrollView
    await clickElementByTestId(page, 'goodnews-updates-item')

    // navigate to article in good news app
    await waitForElementByTestId(page, 'goodnews-article-component')
    expect(page.url()).toContain('/apps/goodnews?articleId=')

    // navigate back
    await clickElementByTestId(page, 'nav-button-back')

    // click on "see more" / navigate to good news app
    await clickElementByTestId(page, 'goodnews-updates-load-more-button')
    await waitForElementByTestId(page, 'goodnews-article-component')
  })
})
