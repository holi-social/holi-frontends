import { expect, test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/apps/volunteering')
})

const goodnewsTimeout = { timeout: 30_000 }

test.describe('@Volunteering', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'app-tile-volunteering')

    await waitForElementByTestId(page, 'volunteering-app-home')
    expect(page.url()).toContain('/apps/volunteering')
  })

  test('should display multiple engagements', async ({ page }) => {
    await waitForElementByTestId(page, 'volunteering-app-home')
    const listItems = await locateElementByTestId(page, 'btn-to-volunteering-engagement')
    const itemCount = await listItems.count()
    expect(itemCount).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should allow pagination', async ({ page }) => {
    await waitForElementByTestId(page, 'volunteering-app-home')
    const countListItems = async () => {
      const listItems = await locateElementByTestId(page, 'btn-to-volunteering-engagement')
      return await listItems.count()
    }
    await expect.poll(countListItems).toBeGreaterThan(0)

    const listItemCountBefore = await countListItems()
    await clickElementByTestId(page, 'btn-volunteering-list-load-more')
    await expect.poll(countListItems, goodnewsTimeout).toBeGreaterThan(listItemCountBefore)
  })

  test('should display engagement details', async ({ page, context }) => {
    await waitForElementByTestId(page, 'volunteering-app-home')
    // click first element in list
    await clickElementByTestId(page, 'btn-to-volunteering-engagement')

    await waitForElementByTestId(page, 'volunteering-engagement-detail-container')

    await checkAccessibility(page)

    expect(page.url()).toContain('/apps/volunteering/engagement/')

    // check if clicking on "get in touch" button actually opens a tab with the correct URL
    // follows https://playwright.dev/docs/pages#handling-new-pages
    const [engagementPage] = await Promise.all([
      context.waitForEvent('page'),
      clickElementByTestId(page, 'volunteering-engagement-get-in-touch-btn'), // opens a new tab
    ])
    const engagementUrl = engagementPage.url()
    expect(engagementUrl).toContain('https://www.aktion-mensch.de/')
    await engagementPage.close() // close newly opened tab
  })
})
