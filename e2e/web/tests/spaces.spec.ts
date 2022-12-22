import { expect, test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/spaces')
  await expect.poll(() => page.url()).toContain('/spaces')
})

test.describe('@Spaces', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'btn-to-spaces')

    await waitForElementByTestId(page, 'spaces-container')
    expect(page.url()).toContain('/spaces')
  })

  test('should display multiple topics with spaces', async ({ page }) => {
    const countTopics = async () => await (await locateElementByTestId(page, 'spaces-topic-container')).count()
    const countSpaces = async () => await (await locateElementByTestId(page, 'btn-to-space')).count()

    await waitForElementByTestId(page, 'spaces-container')

    await expect.poll(countTopics, { timeout: 10000 }).toBeGreaterThan(1)
    await expect.poll(countSpaces, { timeout: 10000 }).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should click on "see more" button for a topic and go to filtered spaces page and display spaces with that topicId', async ({
    page,
  }) => {
    // check if we are in the correct page with the filter queries
    await Promise.all([
      clickElementByTestId(page, 'spaces-topic-container-see-more'),
      page.waitForNavigation({ url: '**/spaces/**' }),
    ])

    const spaceFilterUrlPrefix = '/spaces/filter'
    expect(page.url()).toContain(spaceFilterUrlPrefix)

    // check if there is at least one space card (button to space)
    await waitForElementByTestId(page, 'btn-to-space')

    await checkAccessibility(page)
  })

  test('should open the spaces filter menu and filter spaces with multiple filters', async ({ page }) => {
    await clickElementByTestId(page, 'btn-filter-spaces')

    const locationInput = await locateElementByTestId(page, 'spaces-filter-location-input')
    await locationInput.fill('Berlin')

    // open topics dropdown
    await clickElementByTestId(page, 'spaces-filter-interests-input')

    // click on first topic in the list
    await clickElementByTestId(page, 'spaces-filter-interests-item')

    // open skills dropdown
    await clickElementByTestId(page, 'spaces-filter-skills-input')

    // click on first skill in the list
    await clickElementByTestId(page, 'spaces-filter-skills-item')

    await checkAccessibility(page)

    // click filter confirmation button and check if we are in the correct page with the filter queries
    await Promise.all([
      await clickElementByTestId(page, 'holi-modal-content-close-btn'),
      page.waitForNavigation({ url: '**/spaces/**' }),
    ])

    // check if the filtered spaces container is shown
    await waitForElementByTestId(page, 'filtered-spaces-container')
  })

  test('should display space details', async ({ page }) => {
    await waitForElementByTestId(page, 'spaces-container')
    // click first element on page
    await clickElementByTestId(page, 'btn-to-space')

    await waitForElementByTestId(page, 'space-details-container')

    await waitForElementByTestId(page, 'space-header')

    await waitForElementByTestId(page, 'space-avatar')

    await waitForElementByTestId(page, 'space-title')

    await waitForElementByTestId(page, 'space-description')

    // check if collaborators are displayed
    await clickElementByTestId(page, 'space-members')

    // check if on click the user profile is displayed
    await waitForElementByTestId(page, 'spaces-collaborators-item')

    await clickElementByTestId(page, 'nav-button-down')

    await checkAccessibility(page)

    const spaceUrlPrefix = '/spaces/'
    expect(page.url()).toContain(spaceUrlPrefix)
  })
})
