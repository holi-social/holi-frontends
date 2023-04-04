import { BrowserContext, Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  locateElementByTestId,
  proceedAsGuest,
  volunteeringRequestTimeout,
} from './helpers'
import { test } from './testmaster'

test.setTimeout(120000)

test.describe('@Volunteering', () => {
  test('user journey', async ({ browserName, context, page }) => {
    test.skip(browserName === 'firefox', 'Waiting for fix to HOLI-3640')
    //prepare
    await proceedAsGuest(page)

    await testIsAccessibleFromHomeScreen(page)
    await testAllowsPagination(page)
    await testDisplaysEngagementDetails(context, page)
    await testFilteringByLocation(page)
    await testDisplaysFilterResults(page)
  })
})

const testIsAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'home-apps-button')
  await clickElementByTestId(page, 'app-tile-volunteering')

  await page.waitForSelector(byTestId('volunteering-list-container'))
  expect(page.url()).toContain('/apps/volunteering')
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('volunteering-updates-item'))

  // click first element in ScrollView
  await clickElementByTestId(page, 'volunteering-updates-item')

  // navigate to article in volunteering app
  await page.waitForSelector(byTestId('volunteering-detailview-container'))
  expect(page.url()).toContain('/apps/volunteering/engagement')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('volunteering-updates-item'))

  // click on "see more" / navigate to volunteering app
  await clickElementByTestId(page, 'volunteering-updates-load-more-button')
}

const testAllowsPagination = async (page: Page) => {
  await page.waitForSelector(byTestId('volunteering-list-container'))
  await page.waitForSelector(byTestId('btn-to-volunteering-engagement'))
  const countListItems = async () => {
    const listItems = await locateElementByTestId(page, 'btn-to-volunteering-engagement')
    return await listItems.count()
  }
  await expect.poll(countListItems).toBeGreaterThan(1)

  const listItemCountBefore = await countListItems()
  await clickElementByTestId(page, 'btn-volunteering-list-load-more')
  await expect.poll(countListItems, { timeout: volunteeringRequestTimeout }).toBeGreaterThan(listItemCountBefore)

  await checkAccessibility(page)
}

const testDisplaysEngagementDetails = async (context: BrowserContext, page: Page) => {
  // click first element in list
  await clickElementByTestId(page, 'btn-to-volunteering-engagement')

  await page.waitForSelector(byTestId('volunteering-detailview-container'))

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

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('volunteering-list-container'))
}

const testFilteringByLocation = async (page: Page) => {
  await clickElementByTestId(page, 'btn-to-volunteering-filter')

  // open location dropdown
  await clickElementByTestId(page, 'volunteering-filter-location-input')

  // click on first location in the list
  await clickElementByTestId(page, 'volunteering-filter-location-item')

  await checkAccessibility(page)

  // click filter confirmation button and check if we are in the correct page with the filter queries
  await clickElementByTestId(page, 'volunteering-filter-modal-close-btn')

  // check if the filtered spaces container is shown
  await page.waitForSelector(byTestId('volunteering-list-filtered'))
}

const testDisplaysFilterResults = async (page: Page) => {
  // navigate to detail view
  await clickElementByTestId(page, 'btn-to-volunteering-engagement')

  // expect detail view
  await page.waitForSelector(byTestId('volunteering-detailview-container'))

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  // expect filtered list
  await page.waitForSelector(byTestId('volunteering-list-filtered'))

  await clickElementByTestId(page, 'btn-to-volunteering-filter')

  // open topics dropdown
  await clickElementByTestId(page, 'volunteering-filter-category-input')

  // click on first topic in the list
  await clickElementByTestId(page, 'volunteering-filter-category-item')
}
