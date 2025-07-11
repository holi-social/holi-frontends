import { type Browser, type BrowserContext, type Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  clickFirstElement,
  locateElementByTestId,
  volunteeringRequestTimeout,
  withSSR,
} from './helpers'
import { test } from './testmaster'

const volunteeringOrTaskCardSelector = [byTestId('volunteering-reco-card'), byTestId('task-reco-card')].join(',')

test.describe('@Volunteering', () => {
  test('user journey', async ({ browser, context, page }) => {
    //prepare
    await page.goto('/volunteering')

    await testAllowsPagination(page)
    await withSSR(browser, page.url(), testDisplaysList)

    // click first element in list
    await clickElementByTestId(page, 'volunteering-reco-card')
    await testDisplaysEngagementDetails(context, page)
    await withSSR(browser, page.url(), testDisplaysEngagementDetailsCommon)

    await page.goto('/volunteering')
    await page.waitForSelector(byTestId('volunteering-list-container'))

    await testFilteringByLocation(browser, page)
  })
})

const testDisplaysList = async (page: Page) => {
  await page.waitForSelector(byTestId('volunteering-list-container'))
  await page.waitForSelector(volunteeringOrTaskCardSelector)
}

const testAllowsPagination = async (page: Page) => {
  await testDisplaysList(page)

  const countListItems = async () => {
    const listItems = page.locator(volunteeringOrTaskCardSelector)

    return await listItems.count()
  }
  await expect.poll(countListItems).toBeGreaterThan(1)

  const listItemCountBefore = await countListItems()

  // Scroll down to last element to trigger next fetch
  const listItems = page.locator(volunteeringOrTaskCardSelector)
  await listItems.last().scrollIntoViewIfNeeded()

  await expect.poll(countListItems, { timeout: volunteeringRequestTimeout }).toBeGreaterThan(listItemCountBefore)

  await checkAccessibility(page, false)
}

const testDisplaysEngagementDetailsCommon = async (page: Page) => {
  await page.waitForSelector(byTestId('volunteering-detailview-container'))

  await page.waitForSelector(byTestId('detailview-title'))
}

const testDisplaysEngagementDetails = async (context: BrowserContext, page: Page) => {
  await testDisplaysEngagementDetailsCommon(page)

  await checkAccessibility(page, false)

  expect(page.url()).toContain('/volunteering/')

  // check if clicking on "get in touch" button actually opens a tab with the correct URL
  // follows https://playwright.dev/docs/pages#handling-new-pages
  const [engagementPage] = await Promise.all([
    context.waitForEvent('page'),
    clickElementByTestId(page, 'volunteering-engagement-get-in-touch-btn'), // opens a new tab
  ])
  await engagementPage.close() // close newly opened tab
}

const testDisplaysFilterResultsCommon = async (page: Page) => {
  await page.waitForSelector(byTestId('volunteering-list-filtered'))
}

const testFilteringByLocation = async (browser: Browser, page: Page) => {
  await clickElementByTestId(page, 'volunteering-filter-location')

  // enter location
  const locationInput = await locateElementByTestId(page, 'volunteering-filter-location-input')
  await locationInput.fill('Hamburg, Germany')

  await clickFirstElement(page.locator('[role="menuitem"]'))

  await checkAccessibility(page, false)

  // click filter confirmation button and check if we are in the correct page with the filter queries
  await clickElementByTestId(page, 'volunteering-filter-modal-close-btn')

  // check if the filtered volunteering container is shown
  await testDisplaysFilterResultsCommon(page)

  await withSSR(browser, page.url(), testDisplaysFilterResultsCommon)
}
