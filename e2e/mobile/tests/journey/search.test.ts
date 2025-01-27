import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'
import { getDeviceScreenSize } from '@holi/e2e-mobile/helpers/gestures'
import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  pressEnter,
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
    try {
      await tapOnElementWithTestId('btn-to-search')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // On android in browserstack the above does not work
      // Instead we touch via coordinates starting from the status bar
      const size = await getDeviceScreenSize()
      // @ts-ignore
      const { pixelRatio, statBarHeight } = Appium.capabilities
      const gap = 24 // Top + right gap to the search button

      await Appium.touchAction({ action: 'tap', x: size.width - gap * pixelRatio, y: statBarHeight + gap * pixelRatio })
    }

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

    // Close keyboard by submitting (empty) input
    await pressEnter('search-input')
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
