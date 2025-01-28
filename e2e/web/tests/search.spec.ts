import { byTestId, checkAccessibility, clickElementByTestId, denyConsent, locateElementByTestId } from './helpers'
import { test } from './testmaster'

test.describe('@Search', () => {
  test('user journey', async ({ page }) => {
    await page.goto('/search')

    await denyConsent(page)

    const oldSearch = await locateElementByTestId(page, 'search-content')
    const oldSearchVisible = await oldSearch.isVisible()
    if (oldSearchVisible) {
      // Abort as test only handles new search variant
      return
    }

    // Volunteering is selected by default
    await page.waitForSelector(byTestId('search-hit-volunteering'))

    // Test search by query
    const emailInput = await locateElementByTestId(page, 'search-input')
    await emailInput.fill('Test')
    await page.waitForSelector(byTestId('search-hit-volunteering'))

    // Clear query to prepare for facet filtering
    await clickElementByTestId(page, 'search-input-clear')
    await page.waitForSelector(byTestId('search-hit-volunteering'))

    // Check accessibility
    await checkAccessibility(page)

    // Test facet filters
    await clickElementByTestId(page, 'facet-profile')
    await page.waitForSelector(byTestId('search-hit-profile'))

    await clickElementByTestId(page, 'facet-space')
    await page.waitForSelector(byTestId('search-hit-space'))

    await clickElementByTestId(page, 'facet-volunteering')
    await page.waitForSelector(byTestId('search-hit-volunteering'))
  })
})
