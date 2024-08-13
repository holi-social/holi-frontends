import { Browser, BrowserContext, Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  clickFirstElement,
  locateElementByTestId,
  proceedAsGuest,
  volunteeringRequestTimeout,
  withSSR,
} from './helpers'
import { test } from './testmaster'

test.setTimeout(120000)

test.describe('@Volunteering', () => {
  test('user journey', async ({ browser, browserName, context, page }) => {
    //prepare
    await proceedAsGuest(page)

    await testIsAccessibleFromHomeScreen(page)

    await testAllowsPagination(page)
    await withSSR(browser, page.url(), testDisplaysList)

    // click first element in list
    await clickElementByTestId(page, 'btn-to-volunteering-engagement')
    await testDisplaysEngagementDetails(context, page)
    await withSSR(browser, page.url(), testDisplaysEngagementDetailsCommon)
    // navigate back
    await clickElementByTestId(page, 'nav-button-back')
    await page.waitForSelector(byTestId('volunteering-list-container'))

    await testFilteringByLocation(page)
    await testDisplaysFilterResults(browser, page)
  })
})

const testIsAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'home-apps-button')
  await clickElementByTestId(page, 'app-tile-volunteering')

  await page.waitForSelector(byTestId('volunteering-list-container'))
  expect(page.url()).toContain('/volunteering')
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('volunteering-updates-item'))

  // click first element in ScrollView
  await clickElementByTestId(page, 'volunteering-updates-item')

  // navigate to article in volunteering app
  await page.waitForSelector(byTestId('volunteering-detailview-container'))
  expect(page.url()).toContain('/volunteering/')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('volunteering-updates-item'))

  // click on "see more" / navigate to volunteering app
  await clickElementByTestId(page, 'volunteering-updates-load-more-button')
}

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
  await clickElementByTestId(page, 'btn-volunteering-list-load-more')
  await expect.poll(countListItems, { timeout: volunteeringRequestTimeout }).toBeGreaterThan(listItemCountBefore)

  await checkAccessibility(page, false)
}

const testDisplaysEngagementDetailsCommon = async (page: Page) => {
  await page.waitForSelector(byTestId('volunteering-detailview-container'))

  await page.waitForSelector(byTestId('volunteering-engagement-title'))
  await page.waitForSelector(byTestId('volunteering-engagement-description'))
  await page.waitForSelector(byTestId('volunteering-engagement-categories'))
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

const testFilteringByLocation = async (page: Page) => {
  await clickElementByTestId(page, 'btn-to-volunteering-filter-modal')

  // enter location
  const locationInput = await locateElementByTestId(page, 'volunteering-filter-location-input')
  await locationInput.fill('Hamburg')

  await clickFirstElement(page.locator('[role="menuitem"]'))

  await checkAccessibility(page, false)

  // click filter confirmation button and check if we are in the correct page with the filter queries
  await clickElementByTestId(page, 'volunteering-filter-modal-close-btn')

  // check if the filtered volunteering container is shown
  await testDisplaysFilterResultsCommon(page)
}

const testDisplaysFilterResults = async (browser: Browser, page: Page) => {
  // navigate to detail view
  await clickElementByTestId(page, 'btn-to-volunteering-engagement')

  // expect detail view
  await page.waitForSelector(byTestId('volunteering-detailview-container'))

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  // expect filtered list
  await testDisplaysFilterResultsCommon(page)
  // FIXME shows an empty page currently
  // await withSSR(browser, page.url(), testDisplaysFilterResultsCommon)

  await clickElementByTestId(page, 'btn-to-volunteering-filter-modal')

  // open topics dropdown
  await clickElementByTestId(page, 'volunteering-filter-category-input')

  // click on first topic in the list
  await clickElementByTestId(page, 'volunteering-filter-category-item')
}
