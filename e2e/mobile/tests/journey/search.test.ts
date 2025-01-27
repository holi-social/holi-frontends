import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'
import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  tapOnElementWithTestId,
  waitForAnyElementWithTestId,
  waitForElementWithTestId,
} from '@holi/e2e-mobile/helpers/selectors'

describe('@Search', () => {
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back to home screen
      await tapOnElementWithTestId('nav-button-back')
    }
  })

  it('should show and filter results', async () => {
    await continueAsGuest()

    // Navigate to search
    await waitForElementWithTestId('btn-to-search')
    await tapOnElementWithTestId('btn-to-search')

    const oldSearch = await checkIfElementWithTestIdExists('search-content')
    if (oldSearch) {
      // Abort as test only handles new search variant
      return
    }

    // Test search by query - expecting any result
    const allHitTypes = ['search-hit-volunteering', 'search-hit-profile', 'search-hit-space']
    await waitForAnyElementWithTestId(allHitTypes)
    await fillFieldByTestId('search-input', 'Test')
    await waitForAnyElementWithTestId(allHitTypes)

    // Clear query to prepare for facet filtering
    await tapOnElementWithTestId('search-input-clear')
    await waitForAnyElementWithTestId(allHitTypes)

    // Close keyboard by clicking on the background
    await tapOnElementWithTestId('search-results-list')
    await waitForAnyElementWithTestId(allHitTypes)

    // Test facet filters
    await tapOnElementWithTestId('facet-volunteering')
    await waitForElementWithTestId('search-hit-volunteering')

    await tapOnElementWithTestId('facet-profile')
    await waitForElementWithTestId('search-hit-profile')

    await tapOnElementWithTestId('facet-space')
    await waitForElementWithTestId('search-hit-space')
  })
})
