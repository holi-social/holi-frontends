import { Browser, BrowserContext, Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  clickFirstElement,
  locateElementByTestId,
  proceedAsGuest,
  scrollToMakeHeaderVisible,
  volunteeringRequestTimeout,
  withSSR,
} from './helpers'
import { test } from './testmaster'

test.setTimeout(120000)

test.describe('@Volunteering', () => {
  test('user journey', async ({ browser, context, page }) => {
    //prepare
    await proceedAsGuest(page)

    await testIsAccessibleFromHomeScreen(page)

    await testAllowsPagination(page)
    await withSSR(browser, page.url(), testDisplaysList)

    // click first element in list
    await clickElementByTestId(page, 'btn-to-volunteering-engagement')
    await testDisplaysEngagementDetails(context, page)
    await withSSR(browser, page.url(), testDisplaysEngagementDetailsCommon)

    /* Modal does not show up without a scroll occuring on screen; This is for the scroll mechanism */
    await scrollToMakeHeaderVisible(page)
    // navigate back
    await clickElementByTestId(page, 'nav-button-back')
    await page.waitForSelector(byTestId('volunteering-list-container'))

    await testFilteringByLocation(browser, page)
    /* Modal does not show up without a scroll occuring on screen; This is for the scroll mechanism */
    await scrollToMakeHeaderVisible(page)
    await testDisplaysFilterResults(browser, page)
  })
})

const testIsAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'btn-to-act')
  await clickElementByTestId(page, 'volunteering-reco-slider-heading-button')

  await page.waitForSelector(byTestId('volunteering-list-container'))
  expect(page.url()).toContain('/volunteering')
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('volunteering-reco-slider-card'))

  // click first element in ScrollView
  await clickElementByTestId(page, 'volunteering-reco-slider-card')

  // navigate to article in volunteering app
  await page.waitForSelector(byTestId('volunteering-detailview-container'))
  expect(page.url()).toContain('/volunteering/')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('volunteering-reco-slider-card'))

  // click on "see more" / navigate to volunteering app
  await clickElementByTestId(page, 'volunteering-reco-slider-load-more-button')
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

const testDisplaysFilterResults = async (browser: Browser, page: Page) => {
  // navigate to detail view
  await page.waitForSelector(byTestId('btn-to-volunteering-engagement'))
  await clickElementByTestId(page, 'btn-to-volunteering-engagement')

  // expect detail view
  await page.waitForSelector(byTestId('volunteering-detailview-container'))

  /* Modal does not show up without a scroll occuring on screen; This is for the scroll mechanism */
  await scrollToMakeHeaderVisible(page)

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  // expect filtered list
  await testDisplaysFilterResultsCommon(page)
  await withSSR(browser, page.url(), testDisplaysFilterResultsCommon)

  // Scroll to make header & filter button visible
  await scrollToMakeHeaderVisible(page)

  // Open filter modal
  await clickElementByTestId(page, 'btn-to-volunteering-filter-modal')

  // open topics dropdown
  await clickElementByTestId(page, 'volunteering-filter-topics-input')

  // click on first topic in the list
  await clickElementByTestId(page, 'volunteering-filter-topics-item')
}
