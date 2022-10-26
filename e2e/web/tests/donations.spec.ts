import { Locator, Page, expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  locateElementByTestId,
  waitForElementByTestId,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/apps/donations')
})

test.describe('@Donations', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'app-tile-donations')

    await waitForElementByTestId(page, 'donations-list-container')
    expect(page.url()).toContain('/apps/donations')
  })

  test('should display multiple projects', async ({ page }) => {
    await waitForElementByTestId(page, 'donations-list-container')
    const listItems = await locateElementByTestId(page, 'donations-list-item')
    const itemCount = await listItems.count()
    expect(itemCount).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should allow pagination', async ({ page }) => {
    await waitForElementByTestId(page, 'donations-list-container')
    const countListItems = async () => {
      const listItems = await locateElementByTestId(page, 'donations-list-item')
      return await listItems.count()
    }
    await expect.poll(countListItems).toBeGreaterThan(0)
    const listItemCountBefore = await countListItems()
    await clickElementByTestId(page, 'btn-donation-list-load-more')
    await expect.poll(countListItems).toBeGreaterThan(listItemCountBefore)
  })

  test('should display project details', async ({ page, context }) => {
    await waitForElementByTestId(page, 'donations-list-container')
    // click first element in list
    await clickElementByTestId(page, 'donations-list-item')

    await waitForElementByTestId(page, 'donations-project-detail-heading')

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
  })

  const filterForLocation = async (page: Page, location: string, { assertAccessibility = false } = {}) => {
    // open search modal
    await clickElementByTestId(page, 'donations-search-button')

    if (assertAccessibility) {
      await checkAccessibility(page)
    }

    // enter location
    const locationInput = await locateElementByTestId(page, 'donations-search-location-input')
    await locationInput.fill(location)

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

  test('should filter donations by location and reset', async ({ page }) => {
    // filter for "Germany"
    await filterForLocation(page, 'Germany', { assertAccessibility: true })

    // assert results
    let heading = await locateElementByTestId(page, 'donations-list-search-heading')
    await expect(heading).toContainText('Germany')
    let summary = await locateElementByTestId(page, 'donations-list-search-summary')
    const resultCountGermany = await extractResultCount(summary)
    expect(resultCountGermany).toBeGreaterThan(0)

    await checkAccessibility(page)

    // reset filter in list
    await clickElementByTestId(page, 'donations-list-search-reset')

    // assert reset
    await expect(page.locator(byTestId('donations-list-unfiltered'))).toHaveCount(1)

    // filter for "Hamburg"
    await filterForLocation(page, 'Hamburg')

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
    await expect(page.locator(byTestId('donations-list-unfiltered'))).toHaveCount(1)
  })

  test('should display details of filter results', async ({ page }) => {
    // filter for "Hamburg"
    await filterForLocation(page, 'Hamburg')

    // expect filtered list
    let heading = await locateElementByTestId(page, 'donations-list-search-heading')
    await expect(heading).toContainText('Hamburg')

    // click first element in list
    await clickElementByTestId(page, 'donations-list-item')

    // expect detail view
    await waitForElementByTestId(page, 'donations-project-detail-heading')

    // navigate back
    await clickElementByTestId(page, 'nav-button-back')

    // expect filtered list
    heading = await locateElementByTestId(page, 'donations-list-search-heading')
    await expect(heading).toContainText('Hamburg')
  })
})
