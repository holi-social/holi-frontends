import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'
import { getDeviceScreenSize } from '@holi/e2e-mobile/helpers/gestures'
import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  pressEnter,
  tapOnElementWithTestId,
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

    // Volunteering is selected by default
    await waitForElementWithTestId('holi-tabs-button-volunteering-active')

    // Search examples are displayed by default
    await waitForElementWithTestId('search-examples')

    // Test search by query
    await fillFieldByTestId('search-input', 't') // very short query to ensure there are always results
    // Close keyboard by submitting input
    await pressEnter('search-input')

    await waitForElementWithTestId('search-hit-volunteering')

    // Test facet filters
    await tapOnElementWithTestId('holi-tabs-button-profile-inactive')
    await waitForElementWithTestId('holi-tabs-button-profile-active')
    await waitForElementWithTestId('search-hit-profile')

    await tapOnElementWithTestId('holi-tabs-button-space-inactive')
    await waitForElementWithTestId('holi-tabs-button-space-active')
    await waitForElementWithTestId('search-hit-space')

    await tapOnElementWithTestId('holi-tabs-button-volunteering-inactive')
    await waitForElementWithTestId('holi-tabs-button-volunteering-active')
    await waitForElementWithTestId('search-hit-volunteering')
  })
})
