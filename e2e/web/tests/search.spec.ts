import { byTestId, checkAccessibility, clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

test.describe('@Search', () => {
  test('user journey', async ({ page }) => {
    await page.goto('/search')

    const oldSearch = await locateElementByTestId(page, 'search-content')
    const oldSearchVisible = await oldSearch.isVisible()
    if (oldSearchVisible) {
      // Abort as test only handles new search variant
      return
    }

    // Volunteering is selected by default
    await page.waitForSelector(byTestId('holi-tabs-button-volunteering-active'))

    // Search examples are displayed by default
    await page.waitForSelector(byTestId('search-examples'))

    // Check accessibility
    await checkAccessibility(page)

    // Test search by query
    const emailInput = await locateElementByTestId(page, 'search-input')
    await emailInput.fill('t') // very short query to ensure there are always results
    await page.waitForSelector(byTestId('search-hit-volunteering'))

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
    await page.waitForSelector(byTestId('search-hit-volunteering'))
  })
})
