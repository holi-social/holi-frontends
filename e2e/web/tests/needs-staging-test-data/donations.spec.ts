import { Browser, BrowserContext, Locator, Page, expect } from '@playwright/test'

import { delayMs } from '@holi/e2e-mobile/helpers/time'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  clickFirstElement,
  donationsRequestTimeout,
  locateElementByTestId,
  proceedAsGuest,
  withSSR,
} from '../helpers'
import { test } from '../testmaster'

test.describe('@Donations', () => {
  test('user journey', async ({ browser, context, page }) => {
    test.skip(
      process.env.BASE_URL === 'http://localhost:3000',
      'These features have no local test data and can only be tested on staging.'
    )
    // prepare
    await proceedAsGuest(page)

    await testAbleToVisitDonationsApp(page)

    await testProjectListAndPagination(page)
    await withSSR(browser, page.url(), testDisplaysProjectList)

    // click first element in list
    await clickElementByTestId(page, 'donations-list-item')
    await testDisplaysProjectDetails(context, page)
    await withSSR(browser, page.url(), testDisplaysProjectDetailsCommon)

    // Filtering is disabled, because we can no longer filter by location on the Betterplace API.
    // https://holi.atlassian.net/browse/HOLI-9717
    // Can be re-enabled when we use the donations from our own DB. Please remember to also re-enable the e2e test web and mobile!

    /* Modal does not show up without a scroll occuring on screen; This is for the scroll mechanism */
    //  await scrollToMakeHeaderVisible(page)

    //    await testFilterDonationsByLocationAndResetFilter(browser, page)
    //    await testDisplaysDetailsOfFilterResults(page)
  })
})

const countElementsByTestId = async (page: Page, testId: string) => (await locateElementByTestId(page, testId)).count()

const testAbleToVisitDonationsApp = async (page: Page) => {
  // click first element in ScrollView
  await page.locator(byTestId('donations-reco-slider-card')).first().click({ timeout: donationsRequestTimeout })

  // expect detail view
  await page.waitForSelector(byTestId('donations-detailview-container'), { timeout: donationsRequestTimeout })

  await page.goto('/')

  // click on "see more" / navigate to donations app
  await clickElementByTestId(page, 'donations-reco-slider-load-more-button')
}

const testDisplaysProjectList = async (page: Page) => {
  await page.waitForSelector(byTestId('donations-list-container'))
}

const testProjectListAndPagination = async (page: Page) => {
  await testDisplaysProjectList(page)
  await checkAccessibility(page, false)

  const countListItems = async () => countElementsByTestId(page, 'donations-list-item')

  // the donations list can take a couple of seconds, wait for it. 5s is not always enough.
  await expect.poll(countListItems, { timeout: donationsRequestTimeout }).toBeGreaterThan(0)
  const listItemCountBefore = await countListItems()
  // using force here because the page doesn't scroll the button. Not ideal but more important we can page the results. IRL it does scroll.
  await page.getByRole('button', { name: 'See more' }).click({ force: true })
  await expect.poll(countListItems, { timeout: donationsRequestTimeout }).toBeGreaterThanOrEqual(listItemCountBefore)
}

const testDisplaysProjectDetailsCommon = async (page: Page) => {
  await page.waitForSelector(byTestId('donations-detailview-container'), { timeout: donationsRequestTimeout })

  await page.waitForSelector(byTestId('donations-project-title'))
  await page.waitForSelector(byTestId('donations-project-description'))
  await page.waitForSelector(byTestId('donations-project-progress'))

  await testDisplaysCorrectNewsCountOnProjectDetails(page)
}

const testDisplaysProjectDetails = async (context: BrowserContext, page: Page) => {
  await testDisplaysProjectDetailsCommon(page)

  await checkAccessibility(page, false)

  const projectUrlPrefix = '/donations/'
  const projectUrl = page.url()
  const projectId = projectUrl.substring(projectUrl.indexOf(projectUrlPrefix) + projectUrlPrefix.length)
  expect(projectUrl).toContain(projectUrlPrefix)

  // check if clicking on donate button actually opens a tab with the correct URL
  await page.waitForSelector(byTestId('donations-project-detail-donate-btn'))
  // follows https://playwright.dev/docs/pages#handling-new-pages
  const [donationPage] = await Promise.all([
    context.waitForEvent('page'),
    clickElementByTestId(page, 'donations-project-detail-donate-btn'), // opens a new tab
  ])
  const donationUrl = donationPage.url()
  expect(donationUrl).toMatch(/https:\/\/(www|secure).betterplace.org\/.*\/donate\/platform\/projects\/.*/)
  const donationUrlParts = donationUrl.split('/')
  expect(donationUrlParts[donationUrlParts.length - 1].split('?')[0]).toBe(projectId)
  await donationPage.close() // close newly opened tab
  await delayMs(1000)

  // check if clicking on initiative button actually opens a tab with a reasonable URL
  await page.waitForSelector(byTestId('donations-project-initiative-btn'))
  const [initiativePage] = await Promise.all([
    context.waitForEvent('page'),
    clickElementByTestId(page, 'donations-project-initiative-btn'), // opens a new tab
  ])
  const initiativeUrl = initiativePage.url()
  expect(initiativeUrl).toMatch(/https:\/\/(www|secure).betterplace.org\/.*\/organisations\/.*/)
  await initiativePage.close() // close newly opened tab
}

const testDisplaysCorrectNewsCountOnProjectDetails = async (page: Page) => {
  const hasNews = await page.$('data-testid=donations-news-count')
  if (!hasNews) {
    return
  }
  const countSpotlightNews = async () => countElementsByTestId(page, 'donation-news-spotlight')
  const countOtherNews = async () => page.locator('data-testid=donations-news-other-item').count()

  const newsCount = await extractNewsCount(await locateElementByTestId(page, 'donations-news-count'))
  // spotlight is shown when any news exist
  const expectedSpotlightCount = !newsCount ? 0 : 1
  // up to 4 other news are shown after the spotlight
  const expectedOtherCount = !newsCount ? 0 : Math.min(newsCount - 1, 4)

  expect(newsCount).toBeDefined()
  await expect.poll(countSpotlightNews, { timeout: donationsRequestTimeout }).toBe(expectedSpotlightCount)
  await expect.poll(countOtherNews, { timeout: donationsRequestTimeout }).toBe(expectedOtherCount)
}

const testDisplaysFilterResults = async (page: Page) => {
  // the donations list can take a couple of seconds, wait for it. 5s is not always enough.
  await expect(page.getByTestId('donations-list-search-heading')).toBeVisible({ timeout: donationsRequestTimeout })
}

const testFilterDonationsByLocationAndResetFilter = async (browser: Browser, page: Page) => {
  // filter for "Germany"
  await page.waitForSelector(byTestId('donations-list-item'), { timeout: donationsRequestTimeout })
  await filterForLocation(page, 'Germany', { assertAccessibility: true, useSuggestion: true })
  await page.waitForSelector(byTestId('donations-list-item'))

  // assert results
  await testDisplaysFilterResults(page)
  withSSR(browser, page.url(), testDisplaysFilterResults)

  await page.waitForSelector(byTestId('donations-list-search-reset'))
  let summary = await locateElementByTestId(page, 'donations-list-search-summary')
  const resultCountGermany = await extractResultCount(summary)
  expect(resultCountGermany).toBeGreaterThan(0)

  await checkAccessibility(page, false)

  // reset filter in list
  await clickElementByTestId(page, 'donations-list-search-reset')

  // assert reset, might take longer due to reload of donations projects
  await expect(page.getByTestId('donations-list-unfiltered')).toBeVisible({ timeout: donationsRequestTimeout })

  // filter for "Hamburg"
  await filterForLocation(page, 'Hamburg', { useSuggestion: true })
  await page.waitForSelector(byTestId('donations-list-item'))

  // assert and compare results
  await page.waitForSelector(byTestId('donations-list-search-reset'))
  summary = await locateElementByTestId(page, 'donations-list-search-summary')
  const resultCountHamburg = await extractResultCount(summary)
  expect(resultCountHamburg).toBeGreaterThan(0)
  expect(resultCountHamburg).toBeLessThanOrEqual(resultCountGermany)

  // reset filter in modal
  await resetFilterInModal(page)
  //FIXME: This button is not avaible in the given screen
  // assert reset
  await expect(page.getByTestId('donations-list-unfiltered')).toBeVisible({ timeout: donationsRequestTimeout })
}

const testDisplaysDetailsOfFilterResults = async (page: Page) => {
  // filter for "Hamburg"
  await filterForLocation(page, 'Hamburg')
  await page.waitForSelector(byTestId('donations-search-modal'), { state: 'detached' })
  await page.waitForSelector(byTestId('donations-list-item'), { timeout: donationsRequestTimeout })

  // expect filtered list
  await page.waitForSelector(byTestId('donations-list-search-reset'))

  // click first element in list
  await clickElementByTestId(page, 'donations-list-item')

  // expect detail view
  await page.waitForSelector(byTestId('donations-detailview-container'), { timeout: donationsRequestTimeout })

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('donations-list-container'))

  // expect filtered list
  await page.waitForSelector(byTestId('donations-list-search-reset'))
}

const filterForLocation = async (
  page: Page,
  location: string,
  { assertAccessibility = false, useSuggestion = false } = {}
) => {
  // open search modal
  await clickElementByTestId(page, 'donations-search-button')
  // wait for modal to open
  await page.locator('[role="dialog"]').waitFor()

  if (assertAccessibility) {
    await checkAccessibility(page, false)
  }

  // enter location
  const locationInput = await locateElementByTestId(page, 'donations-search-location-input')
  await locationInput.fill(location)

  // expect suggestions
  if (useSuggestion) {
    await clickFirstElement(page.locator('[role="menuitem"]'))
  } else {
    // at least wait for the suggestions to pop up, fixes race condition
    // FIXME: if we don't, it's flaky. We weren't able to find the issue in the app yet.
    await page.locator('[role="menuitem"]').first().waitFor()
  }

  // close search modal
  await clickElementByTestId(page, 'donations-search-modal-content-close-btn')

  // wait for results
  await page.waitForSelector(byTestId('donations-list-container'))
}

const extractResultCount = async (element: Locator): Promise<number> => {
  const textContent = await element.textContent()
  const numberMatch = textContent?.match(/\d+/)
  if (numberMatch && numberMatch.length) {
    return parseInt(numberMatch[0], 10)
  }
  return 0
}

const extractNewsCount = async (element: Locator): Promise<number | undefined> => {
  const textContent = await element.textContent()
  const numberNews = textContent?.match(/\(([^)]+)\)/)
  if (numberNews && numberNews.length) {
    return parseInt(numberNews[1], 10)
  }
  return undefined
}

const resetFilterInModal = async (page: Page) => {
  // open search modal
  await clickElementByTestId(page, 'donations-search-button')

  //BUG: Reset filter needs to be pressed twice sometimes to clear field:
  //reset filter
  await clickElementByTestId(page, 'donations-search-form-reset')

  // close search modal
  await clickElementByTestId(page, 'donations-search-modal-content-close-btn')

  // wait for results
  await page.waitForSelector(byTestId('donations-list-container'))
}
