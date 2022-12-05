import { faker } from '@faker-js/faker'

import { defaultAuthSteps, logout } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@Comment', () => {
  test('creates a comment and displays it in the post page.', async () => {
    // login
    await defaultAuthSteps()

    // go to home feed
    await navigateBackToHomeScreen()

    // click first insight image link
    await waitForElementWithTestId('feed-insight-image-link')
    await tapOnElementWithTestId('feed-insight-image-link')

    // click first post within the insight
    await scrollToElementWithTestId('btn-to-post', 'down', { maxAttempts: 5 })
    await waitForElementWithTestId('btn-to-post')
    await tapOnElementWithTestId('btn-to-post')

    // click the comment footer button
    await waitForElementWithTestId('post-detail-footer')
    await tapOnElementWithTestId('post-detail-footer')

    // create e2e comment and fill the textinput
    const comment = `e2e comment ${faker.random.alphaNumeric(5)}`
    await fillFieldByTestId('post-comment-input', comment)

    // submit comment
    await tapOnElementWithTestId('btn-submit-comment')

    // check if submit comment button disappears accordingly
    await waitForElementWithTestIdToBeNull('btn-submit-comment')

    // clean up view
    await scrollToElementWithTestId('nav-button-back', 'up')
    await tapOnElementWithTestId('nav-button-back', 0)
    await logout()
    await scrollToElementWithTestId('home-feed-insights-heading', 'up', { maxAttempts: 3 })
  })
})
