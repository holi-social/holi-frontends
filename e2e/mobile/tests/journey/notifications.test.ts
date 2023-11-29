import { faker } from '@faker-js/faker'

import { defaultAuthSteps, deleteAccount, finishAccountSetup, logout } from '../../helpers/auth'
import { itif } from '../../helpers/platform'
import { elementByTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

const userFirstName = faker.internet.userName()
const userLastName = faker.string.numeric(4)
const userName = userFirstName + ' ' + userLastName
const email = `${userFirstName}${userLastName}@e2etest.com`
const password = 'TheSamePassword4A11E2eUsers'

describe('@Notifications', () => {
  itif(platform === 'ios', 'mentioning a user on a comment to a post notifies them in-app', async () => {
    // given a new user
    await defaultAuthSteps({ email, password }, 'registration', false)
    await finishAccountSetup({ firstName: userFirstName, lastName: userLastName })
    await logout()

    // when logging in as e2e user
    await defaultAuthSteps()
    await tapOnElementWithTestId('btn-to-home-view')

    // and mentioning the new user in a comment to a post
    // which likely is an existing daily inspiration post
    await tapOnElementWithTestId('btn-to-post')
    await tapOnElementWithTestId('post-detail-footer')
    const input = await elementByTestId('post-comment')
    await input.setValue('E2E Testing mention for @')
    await input.sendKeys([...userName])
    // should be the first suggested user for that name
    await waitForElementWithTestId('post-comment-suggestions')
    if (platform === 'ios') {
      // FIXME: the ios ui requires to close the keyboard before suggestion can be clicked (ios simulator)
      // so we click it twice to close the keyboard (Appium.hideKeyboard doesn't work)
      await tapOnElementWithTestId('post-comment-suggestions-item')
    }
    await tapOnElementWithTestId('post-comment-suggestions-item')
    await tapOnElementWithTestId('btn-submit-comment')

    // and logging out afterwards
    await logout()

    // and logging in as the new user
    await defaultAuthSteps({ email, password }, 'login')
    await tapOnElementWithTestId('btn-to-home-view')

    // then badge is displayed on the notification bell
    // and notification center has a notification for it
    await waitForElementWithTestId('btn-to-notifications-with-badge')
    await tapOnElementWithTestId('btn-to-notifications')
    await waitForElementWithTestId('notification-list')
    await waitForElementWithTestId('post-comment')

    // cleanup new user
    await deleteAccount()
  })
})
