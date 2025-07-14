import { byTestId, checkAccessibility, clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

const volunteeringOrTaskHitSelector = [byTestId('search-hit-volunteering'), byTestId('search-hit-task')].join(',')

test.describe('@Search', () => {
  test('user journey', async ({ page }) => {
    await page.goto('/search')

    // Volunteering is selected by default
    await page.waitForSelector(byTestId('holi-tabs-button-volunteering-active'))

    // Search examples are displayed by default
    await page.waitForSelector(byTestId('search-examples'))

    // Check accessibility
    await checkAccessibility(page)

    // Test search by query
    const emailInput = await locateElementByTestId(page, 'search-input')
    await emailInput.fill('t') // very short query to ensure there are always results
    await clickElementByTestId(page, 'btn-submit-search')

    await page.waitForSelector(volunteeringOrTaskHitSelector)

    // Check accessibility
    await checkAccessibility(page)

    // Test facet filters
    await clickElementByTestId(page, 'holi-tabs-button-profile-inactive')
    await page.waitForSelector(byTestId('holi-tabs-button-profile-active'))
    await page.waitForSelector(byTestId('search-hit-profile'))

    await clickElementByTestId(page, 'holi-tabs-button-space-inactive')
    await page.waitForSelector(byTestId('holi-tabs-button-space-active'))
    await page.waitForSelector(byTestId('search-hit-space'))

    await clickElementByTestId(page, 'holi-tabs-button-volunteering-inactive')
    await page.waitForSelector(byTestId('holi-tabs-button-volunteering-active'))
    await page.waitForSelector(volunteeringOrTaskHitSelector)
  })
})
