import { Page, expect } from '@playwright/test'

import { clickElementByTestId, locateElementByTestId, randomSpaceName, retry } from './helpers'
import { createSpace } from './helpers/spaces'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.setTimeout(240000)

const GET_INVOLVED_SPACE_TAB_TEST_ID = 'space-tabs-button-2-inactive'
const APPOINTMENT_CREATE_BUTTON_TEST_ID = 'btn-right-space-appointments-card'

test.describe('@AppointmentNotifications', () => {
  test('space follower is notified about public appointment', async ({ userHandler, browserName }) => {
    // FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug `Error: page.goto: Navigation to "http://localhost:3000/login" is interrupted by another navigation to "http://localhost:3000/profile"`
    test.skip(browserName === 'webkit', 'FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug')

    await userHandler.asRandomUser(async (adminA) => {
      const spaceName = randomSpaceName()
      await test.step('random user can create a space and becomes admin', async () => {
        await createSpace(adminA, spaceName)
      })

      await userHandler.asRandomUser(async (follower) => {
        // when
        await followSpace(follower, spaceName)
        await createSpaceAppointment(adminA)

        // then follower is notified
        await retry(async () => {
          await follower.goto('/notifications')
          await expect(await locateElementByTestId(follower, 'space-appointment')).toBeVisible()
        })
      })

      await test.step('space can be deleted', async () => {
        await retry(async () => {
          await adminA.goto('/spaces/' + spaceName)
          await clickElementByTestId(adminA, 'space-options-btn')
          await clickElementByTestId(adminA, 'space-delete')
          await clickElementByTestId(adminA, 'space-delete-confirmation-confirm')
        })
      })
    })
  })
})

async function followSpace(user: Page, spaceName: string) {
  return test.step('user follows space', async () => {
    await user.goto('/spaces/' + spaceName)

    await clickElementByTestId(user, 'follow-btn')

    await locateElementByTestId(user, 'unfollow-btn')
  })
}

async function createSpaceAppointment(adminA: Page) {
  await test.step('admin creates appointment', async () => {
    await clickElementByTestId(adminA, GET_INVOLVED_SPACE_TAB_TEST_ID)
    // wait for animation of tab to end
    await adminA.waitForTimeout(500)
    await clickElementByTestId(adminA, APPOINTMENT_CREATE_BUTTON_TEST_ID)

    const titleField = await locateElementByTestId(adminA, 'appointment-title-input')
    await titleField.fill('E2E Party')

    // advance the starting time to have the appointment in the future
    // so it triggers notifications
    await clickElementByTestId(adminA, 'btn-holi-date-picker')

    // next month
    await clickElementByTestId(adminA, 'undefined.header.rightArrow')
    // select first day
    // using keyboard is simpler than using the ids as they aren't static
    await adminA.keyboard.press('Tab')
    await adminA.keyboard.press('Enter')

    const descriptionField = await locateElementByTestId(adminA, 'appointment-description-input')
    await descriptionField.fill('Best E2E Party Description')

    await clickElementByTestId(adminA, 'form-wrapper-save-btn')
  })
}
