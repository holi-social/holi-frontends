import { BrowserContext, Locator, Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElement,
  clickElementByTestId,
  donationsRequestTimeout,
  locateElementByTestId,
  proceedAsGuest,
  waitForElementByTestId,
} from './helpers'
import { test } from './testmaster'

test.setTimeout(120000)

test.describe('@Donations', () => {
  test('user journey', async ({ browserName, context, page }) => {
    test.skip(browserName === 'firefox', 'Waiting for fix to HOLI-3640')
    // prepare
    await proceedAsGuest(page)

    await testAbleToVisitDonationsApp(page)

    await testProjectListAndPagination(page)

    await testDisplayProjectDetails(context, page)

    await testDisplayCorrectNewsCountOnProjectDetails(page)

    await testFilterDonationsByLocationAndResetFilter(page)

    await testDisplayDetailsOfFilterResults(page)
  })
})

const testAbleToVisitDonationsApp = async (page: Page) => {
  // click first element in ScrollView
  await page.locator(byTestId('donations-updates-item')).first().click({ timeout: donationsRequestTimeout })

  // expect detail view
  await page.waitForSelector(byTestId('donations-detailview-container'), { timeout: donationsRequestTimeout })

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await waitForElementByTestId(page, 'donations-updates-item')

  // click on "see more" / navigate to donations app
  await clickElementByTestId(page, 'donations-updates-load-more-button')
  await waitForElementByTestId(page, 'donations-list-container')
}

const testProjectListAndPagination = async (page: Page) => {
  //await waitForElementByTestId(page, 'donations-list-container')
  const countListItems = async () => {
    const listItems = await locateElementByTestId(page, 'donations-list-item')
    return await listItems.count()
  }
  // the donations list can take a couple of seconds, wait for it. 5s is not always enough.
  await expect.poll(countListItems, { timeout: donationsRequestTimeout }).toBeGreaterThan(0)
  const listItemCountBefore = await countListItems()
  await clickElementByTestId(page, 'btn-donation-list-load-more')
  await expect.poll(countListItems, { timeout: donationsRequestTimeout }).toBeGreaterThan(listItemCountBefore)
}

const testDisplayProjectDetails = async (context: BrowserContext, page: Page) => {
  //await waitForElementByTestId(page, 'donations-list-container')
  // click first element in list
  await clickElementByTestId(page, 'donations-list-item')

  await page.waitForSelector(byTestId('donations-detailview-container'), { timeout: donationsRequestTimeout })

  await checkAccessibility(page)

  const projectUrlPrefix = '/apps/donations/project/'
  const projectUrl = page.url()
  const projectId = projectUrl.substring(projectUrl.indexOf(projectUrlPrefix) + projectUrlPrefix.length)
  expect(projectUrl).toContain(projectUrlPrefix)

  // check if clicking on donate button actually opens a tab with the correct URL
  await waitForElementByTestId(page, 'donations-project-detail-donate-btn')
  // follows https://playwright.dev/docs/pages#handling-new-pages
  const [donationPage] = await Promise.all([
    context.waitForEvent('page'),
    clickElementByTestId(page, 'donations-project-detail-donate-btn'), // opens a new tab
  ])
  const donationUrl = donationPage.url()
  expect(donationUrl).toMatch(/https:\/\/www.betterplace.org\/.*\/donate\/platform\/projects\/.*/)
  const donationUrlParts = donationUrl.split('/')
  expect(donationUrlParts[donationUrlParts.length - 1]).toBe(projectId)
  await donationPage.close() // close newly opened tab

  // check if clicking on initiative button actually opens a tab with a reasonable URL
  await waitForElementByTestId(page, 'donations-project-initiative-btn')
  const [initiativePage] = await Promise.all([
    context.waitForEvent('page'),
    clickElementByTestId(page, 'donations-project-initiative-btn'), // opens a new tab
  ])
  const initiativeUrl = initiativePage.url()
  expect(initiativeUrl).toMatch(/https:\/\/www.betterplace.org\/.*\/organisations\/.*/)
  await initiativePage.close() // close newly opened tab

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await waitForElementByTestId(page, 'donations-list-container')
}

const testDisplayCorrectNewsCountOnProjectDetails = async (page: Page) => {
  const countSpotlightNews = async () => await (await locateElementByTestId(page, 'donation-news-spotlight')).count()
  const countOtherNews = async () => await (await page.locator('data-testid=donations-news-other-item')).count()

  // open first donation opportunity
  await clickElementByTestId(page, 'donations-list-item')
  await page.waitForSelector(byTestId('donations-detailview-container'), { timeout: donationsRequestTimeout })

  const hasNews = await page.$('data-testid=donations-news-count')
  if (hasNews) {
    const newsCount = await extractNewsCount(await locateElementByTestId(page, 'donations-news-count'))
    // spotlight is shown when any news exist
    const expectedSpotlightCount = newsCount === 0 ? 0 : 1
    // up to 4 other news are shown after the spotlight
    const expectedOtherCount = !newsCount || newsCount === 0 ? 0 : newsCount >= 5 ? 4 : newsCount - 1

    expect(newsCount).toBeDefined()
    await expect.poll(countSpotlightNews, { timeout: donationsRequestTimeout }).toBe(expectedSpotlightCount)
    await expect.poll(countOtherNews, { timeout: donationsRequestTimeout }).toBe(expectedOtherCount)
  }

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await waitForElementByTestId(page, 'donations-list-container')
}

const testFilterDonationsByLocationAndResetFilter = async (page: Page) => {
  // filter for "Germany"
  await waitForElementByTestId(page, 'donations-list-item')
  await filterForLocation(page, 'Germany', { assertAccessibility: true, useSuggestion: true })
  await waitForElementByTestId(page, 'donations-list-item')

  // assert results
  // the donations list can take a couple of seconds, wait for it. 5s is not always enough.
  await expect(page.getByTestId('donations-list-search-heading')).toBeVisible({ timeout: donationsRequestTimeout })
  let heading = await locateElementByTestId(page, 'donations-list-search-heading')
  await expect(heading).toContainText('Germany')
  let summary = await locateElementByTestId(page, 'donations-list-search-summary')
  const resultCountGermany = await extractResultCount(summary)
  expect(resultCountGermany).toBeGreaterThan(0)

  await checkAccessibility(page)

  // reset filter in list
  await clickElementByTestId(page, 'donations-list-search-reset')

  // assert reset, might take longer due to reload of donations projects
  await expect(page.getByTestId('donations-list-unfiltered')).toBeVisible({ timeout: donationsRequestTimeout })

  // filter for "Hamburg"
  await filterForLocation(page, 'Hamburg', { useSuggestion: true })
  await waitForElementByTestId(page, 'donations-list-item')

  // assert and compare results
  heading = await locateElementByTestId(page, 'donations-list-search-heading')
  await expect(heading).toContainText('Hamburg')
  summary = await locateElementByTestId(page, 'donations-list-search-summary')
  const resultCountHamburg = await extractResultCount(summary)
  expect(resultCountHamburg).toBeGreaterThan(0)
  expect(resultCountHamburg).toBeLessThan(resultCountGermany)

  // reset filter in modal
  await resetFilterInModal(page)

  // assert reset
  await page.waitForSelector(byTestId('donations-list-unfiltered'), { timeout: donationsRequestTimeout })
}

const testDisplayDetailsOfFilterResults = async (page: Page) => {
  // filter for "Hamburg"
  await filterForLocation(page, 'Hamburg')
  await page.waitForSelector(byTestId('donations-search-modal'), { state: 'detached' })
  await page.waitForSelector(byTestId('donations-list-item'), { timeout: donationsRequestTimeout })

  // expect filtered list
  let heading = await locateElementByTestId(page, 'donations-list-search-heading')
  await expect(heading).toContainText('Hamburg')

  // click first element in list
  await clickElementByTestId(page, 'donations-list-item')

  // expect detail view
  await page.waitForSelector(byTestId('donations-detailview-container'), { timeout: donationsRequestTimeout })

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await waitForElementByTestId(page, 'donations-list-container')

  // expect filtered list
  heading = await locateElementByTestId(page, 'donations-list-search-heading')
  await expect(heading).toContainText('Hamburg')
}

const filterForLocation = async (
  page: Page,
  location: string,
  { assertAccessibility = false, useSuggestion = false } = {}
) => {
  // open search modal
  await clickElementByTestId(page, 'donations-search-button')

  if (assertAccessibility) {
    await checkAccessibility(page)
  }

  // enter location
  const locationInput = await locateElementByTestId(page, 'donations-search-location-input')
  await locationInput.fill(location)

  // expect suggestions
  if (useSuggestion) {
    await clickElement(page.locator('[role="menuitem"]'))
  } else {
    // at least wait for the suggestions to pop up, fixes race condition
    // FIXME: if we don't, it's flaky. We weren't able to find the issue in the app yet.
    await page.locator('[role="menuitem"]').first().waitFor()
  }

  // close search modal
  await clickElementByTestId(page, 'donations-search-modal-close-btn')

  // wait for results
  await waitForElementByTestId(page, 'donations-list-container')
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

  // reset filter
  await clickElementByTestId(page, 'donations-search-form-reset')

  // close search modal
  await clickElementByTestId(page, 'donations-search-modal-close-btn')

  // wait for results
  await waitForElementByTestId(page, 'donations-list-container')
}
