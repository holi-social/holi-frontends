import { Browser, BrowserContext, Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  clickFirstElement,
  isRunningOnStaging,
  locateElementByTestId,
  proceedAsGuest,
  volunteeringRequestTimeout,
  withSSR,
} from '../helpers'
import { test } from '../testmaster'

test.describe('@Volunteering', () => {
  test('user journey', async ({ browser, context, page }) => {
    test.skip(isRunningOnStaging(), 'These features have no local test data and can only be tested on staging.')

    //prepare
    await proceedAsGuest(page)
    await page.goto('/volunteering')

    await testAllowsPagination(page)
    await withSSR(browser, page.url(), testDisplaysList)

    // click first element in list
    await clickElementByTestId(page, 'btn-to-volunteering-engagement')
    await testDisplaysEngagementDetails(context, page)
    await withSSR(browser, page.url(), testDisplaysEngagementDetailsCommon)

    await page.goto('/volunteering')
    await page.waitForSelector(byTestId('volunteering-list-container'))

    await testFilteringByLocation(browser, page)
  })
})

const testDisplaysList = async (page: Page) => {
  await page.waitForSelector(byTestId('volunteering-list-container'))
  await page.waitForSelector(byTestId('btn-to-volunteering-engagement'))
}

const testAllowsPagination = async (page: Page) => {
  await testDisplaysList(page)

  const countListItems = async () => {
    const listItems = await locateElementByTestId(page, 'btn-to-volunteering-engagement')
    return await listItems.count()
  }
  await expect.poll(countListItems).toBeGreaterThan(1)

  const listItemCountBefore = await countListItems()

  // Scroll down to last element to trigger next fetch
  const listItems = await locateElementByTestId(page, 'btn-to-volunteering-engagement')
  await listItems.last().scrollIntoViewIfNeeded()

  await expect.poll(countListItems, { timeout: volunteeringRequestTimeout }).toBeGreaterThan(listItemCountBefore)

  await checkAccessibility(page, false)
}

const testDisplaysEngagementDetailsCommon = async (page: Page) => {
  await page.waitForSelector(byTestId('volunteering-detailview-container'))

  await page.waitForSelector(byTestId('volunteering-engagement-title'))
  await page.waitForSelector(byTestId('volunteering-engagement-description'))
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
  await clickElementByTestId(page, 'btn-to-volunteering-filter-modal')

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
