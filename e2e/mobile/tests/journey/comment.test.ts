import { faker } from '@faker-js/faker'

import { defaultAuthSteps, logout } from '../../helpers/auth'
import { navigateBackToHomeScreenDeeper } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'

describe('@Comment', () => {
  // fails on android: The element 'By.xpath: //*[@resource-id='btn-submit-comment']' does not exist in DOM anymore
  // fails on ios: element ("~btn-to-post") still not displayed after 1ms
  it('creates a comment and displays it in the post page.', async () => {
    // login
    await defaultAuthSteps()

    // go to home feed
    await navigateBackToHomeScreenDeeper()

    // click first insight image link
    await waitForElementWithTestId('feed-insight-image-link')
    await tapOnElementWithTestId('feed-insight-image-link')

    // click first post within the insight
    await scrollToElementWithTestId('btn-to-post', 'down', { maxAttempts: 5 })
    await waitForElementWithTestId('btn-to-post')
    await tapOnElementWithTestId('btn-to-post')

    // click the comment footer button
    // TODO this is very slow due to client side rendering when there's a lot of comments - we're trying to fix it by using FlatList
    await waitForElementWithTestId('post-detail-footer', 30000)
    await tapOnElementWithTestId('post-detail-footer')

    // create e2e comment and fill the textinput
    const comment = `e2e comment ${faker.random.alphaNumeric(5)}`
    await fillFieldByTestId('post-comment', comment)

    // submit comment
    await tapOnElementWithTestId('btn-submit-comment')

    // check if submit comment button is disabled accordingly
    const submitButton = await waitForElementWithTestId('btn-submit-comment')
    //console.log(await submitButton.getAttribute('enabled'))
    expect(await submitButton.getAttribute('enabled')).toBe('false')

    // wait until we are back on the post detail page
    await waitForElementWithTestId('post-detail-footer')

    // TODO verify comment was added successfully, e.g. wait for success toast
    // This does not work, might be a timing issue
    // await waitForElementWithTestId('toast-SUCCESS', 60000)

    // clean up view
    await navigateBackToHomeScreenDeeper()
    await logout()
    await navigateBackToHomeScreenDeeper()
  })
})
