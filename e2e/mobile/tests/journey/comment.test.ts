import { faker } from '@faker-js/faker'

import { deleteAccount, registerNewUser } from '../../helpers/auth'
import { scrollDown, scrollUp } from '../../helpers/gestures'
import { navigateBackToHomeScreenDeeper } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'

describe('@Comment', () => {
  // TODO: Commenting has been briefly removed from the insight detail page and should be back once HOLI-7390 is finished
  xit('creates a comment and displays it in the post page.', async () => {
    await registerNewUser()

    // go to home feed
    await navigateBackToHomeScreenDeeper()

    // click first insight image link
    await scrollToElementWithTestId('feed-insight-image-link', 'down')
    await tapOnElementWithTestId('feed-insight-image-link')

    // click first post within the insight
    await scrollToElementWithTestId('btn-to-post', 'down', { maxAttempts: 5 })
    await tapOnElementWithTestId('btn-to-post')

    // click the comment footer button
    // TODO this is very slow due to client side rendering when there's a lot of comments - we're trying to fix it by using FlatList
    await tapOnElementWithTestId('post-detail-footer', 30000)

    // create e2e comment and fill the textinput
    const comment = `e2e comment ${faker.string.alphanumeric(5)}`
    await fillFieldByTestId('post-comment-input', comment)

    // submit comment
    await tapOnElementWithTestId('btn-submit-comment')

    // check if submit comment button is disabled accordingly
    // this is inherently fragile, since it depends on the timing, whether the button is still there and when it is enabled or disabled.
    // const submitButton = await waitForElementWithTestId('btn-submit-comment')
    //console.log(await submitButton.getAttribute('enabled'))
    // submitButton.waitForEnabled({ reverse: true })
    // expect(await submitButton.getAttribute('enabled')).toBe('false')

    // wait until we are back on the post detail page
    await waitForElementWithTestId('post-detail-footer', 30000)

    // TODO verify comment was added successfully, e.g. wait for success toast
    // This does not work, might be a timing issue
    // await waitForElementWithTestId('toast-SUCCESS', 60000)

    // clean up view
    await navigateBackToHomeScreenDeeper()

    // scroll up to make sure top menu shows up
    await scrollDown()
    await scrollUp()
    await scrollUp()

    await deleteAccount()
    await navigateBackToHomeScreenDeeper()
  })
})
