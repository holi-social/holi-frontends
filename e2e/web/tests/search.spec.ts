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

    // Test search by query - expecting any result
    const allHitTypes = ['search-hit-volunteering', 'search-hit-profile', 'search-hit-space']
      .map((testID) => byTestId(testID))
      .join(', ')
    await page.waitForSelector(allHitTypes)
    const emailInput = await locateElementByTestId(page, 'search-input')
    await emailInput.fill('Test')
    await page.waitForSelector(allHitTypes)

    // Clear query to prepare for facet filtering
    await clickElementByTestId(page, 'search-input-clear')
    await page.waitForSelector(allHitTypes)

    // Check accessibility
    await checkAccessibility(page)

    // Test facet filters
    await clickElementByTestId(page, 'facet-volunteering')
    await page.waitForSelector(byTestId('search-hit-volunteering'))

    await clickElementByTestId(page, 'facet-profile')
    await page.waitForSelector(byTestId('search-hit-profile'))

    await clickElementByTestId(page, 'facet-space')
    await page.waitForSelector(byTestId('search-hit-space'))
  })
})
