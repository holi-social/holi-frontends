import { expect, test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/apps/volunteering')
})

const volunteeringTimeout = { timeout: 30_000 }

test.describe('@Volunteering', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'app-tile-volunteering')

    await waitForElementByTestId(page, 'volunteering-list-container')
    expect(page.url()).toContain('/apps/volunteering')
  })

  test('should display multiple engagements', async ({ page }) => {
    await waitForElementByTestId(page, 'volunteering-list-container')
    const listItems = await locateElementByTestId(page, 'btn-to-volunteering-engagement')
    const itemCount = await listItems.count()
    expect(itemCount).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should allow pagination', async ({ page }) => {
    await waitForElementByTestId(page, 'volunteering-list-container')
    const countListItems = async () => {
      const listItems = await locateElementByTestId(page, 'btn-to-volunteering-engagement')
      return await listItems.count()
    }
    await expect.poll(countListItems).toBeGreaterThan(0)

    const listItemCountBefore = await countListItems()
    await clickElementByTestId(page, 'btn-volunteering-list-load-more')
    await expect.poll(countListItems, volunteeringTimeout).toBeGreaterThan(listItemCountBefore)
  })

  test('should display engagement details', async ({ page, context }) => {
    await waitForElementByTestId(page, 'volunteering-list-container')
    // click first element in list
    await clickElementByTestId(page, 'btn-to-volunteering-engagement')

    await waitForElementByTestId(page, 'volunteering-detailview-container')

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

  test('should open the volunteering filter menu and filter opportunities by location', async ({ page }) => {
    await waitForElementByTestId(page, 'volunteering-list-container')

    await clickElementByTestId(page, 'btn-to-volunteering-filter')

    // open location dropdown
    await clickElementByTestId(page, 'volunteering-filter-location-input')

    // click on first location in the list
    await clickElementByTestId(page, 'volunteering-filter-location-item')

    // open topics dropdown
    await clickElementByTestId(page, 'volunteering-filter-category-input')

    // click on first topic in the list
    await clickElementByTestId(page, 'volunteering-filter-category-item')

    await checkAccessibility(page)

    // click filter confirmation button and check if we are in the correct page with the filter queries
    await clickElementByTestId(page, 'volunteering-filter-modal-close-btn')

    // check if the filtered spaces container is shown
    await waitForElementByTestId(page, 'volunteering-list-filtered')
  })

  test('should display details of filter results', async ({ page }) => {
    await waitForElementByTestId(page, 'volunteering-list-container')

    // apply filer
    await clickElementByTestId(page, 'btn-to-volunteering-filter')

    // open location dropdown
    await clickElementByTestId(page, 'volunteering-filter-location-input')

    // click on first location in the list
    await clickElementByTestId(page, 'volunteering-filter-location-item')

    // click filter confirmation button and check if we are in the correct page with the filter queries
    await clickElementByTestId(page, 'volunteering-filter-modal-close-btn')

    // check if the filtered volunteering container is shown
    await waitForElementByTestId(page, 'volunteering-list-filtered')

    // navigate to detail view
    await clickElementByTestId(page, 'btn-to-volunteering-engagement')

    // expect detail view
    await waitForElementByTestId(page, 'volunteering-detailview-container')

    // navigate back
    await clickElementByTestId(page, 'nav-button-back')

    // expect filtered list
    await waitForElementByTestId(page, 'volunteering-list-filtered')
  })
})
