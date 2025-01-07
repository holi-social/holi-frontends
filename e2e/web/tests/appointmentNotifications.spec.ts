import { Page, expect } from '@playwright/test'

import { randomSpaceName } from '@holi/e2e-web/tests/helpers/fixtures'

import { byTestId, clickElementByTestId, locateElementByTestId, retry } from './helpers'
import { createSpace } from './helpers/spaces'
import { test } from './testmaster'

const GET_INVOLVED_SPACE_TAB_TEST_ID = 'space-tabs-button-involvement-inactive'
const APPOINTMENT_CREATE_BUTTON_TEST_ID = 'btn-right-space-appointments-card'

// this is a long journey, but its as fast as our backends are
test.setTimeout(180000)

test.describe('@AppointmentNotifications', () => {
  test('space follower is notified about public appointment', async ({ sessions }) => {
    const spaceName = randomSpaceName()

    const { page: admin } = await sessions.signUp()

    // because we do a hard navigation we need to wait for logged in user to be fetched from BE. So, wait for 'logged-in-profile'
    await admin.waitForSelector(byTestId('logged-in-profile'))

    await createSpace(admin, spaceName)

    const { page: follower } = await sessions.signUp()
    await followSpace(follower, spaceName)

    await createSpaceAppointment(admin)
    await editAppointmentTitle(admin)

    await retry(async () => {
      await follower.goto('/notifications')
      // only one appointment here, the edit-update is not notifying as its just a title change
      await expect(await locateElementByTestId(follower, 'space-appointment')).toBeVisible()
    })

    await test.step('space can be deleted', async () => {
      await admin.goto('/spaces/' + spaceName)
      await clickElementByTestId(admin, 'space-options-btn')
      await clickElementByTestId(admin, 'space-delete')
      await clickElementByTestId(admin, 'space-delete-confirmation-primary')
    })
  })
})

async function followSpace(user: Page, spaceName: string) {
  return test.step('user follows space', async () => {
    await user.goto('/spaces/' + spaceName)
    await clickElementByTestId(user, 'follow-btn')
    await expect(await locateElementByTestId(user, 'unfollow-btn')).toBeVisible()
  })
}

async function createSpaceAppointment(adminA: Page) {
  await test.step('admin creates appointment', async () => {
    await clickElementByTestId(adminA, GET_INVOLVED_SPACE_TAB_TEST_ID)
    // wait for animation of tab to end
    await adminA.waitForTimeout(1000)
    await clickElementByTestId(adminA, APPOINTMENT_CREATE_BUTTON_TEST_ID)

    const titleField = await locateElementByTestId(adminA, 'appointment-title-input')
    await expect(titleField).toBeVisible()
    await titleField.fill('E2E Party')

    const descriptionField = await locateElementByTestId(adminA, 'appointment-description-input')
    await descriptionField.fill('Best E2E Party Description')

    await clickElementByTestId(adminA, 'form-wrapper-save-btn')
  })
}

async function editAppointmentTitle(user: Page) {
  await test.step('admin can edit appointment', async () => {
    await clickElementByTestId(user, GET_INVOLVED_SPACE_TAB_TEST_ID)
    await clickElementByTestId(user, 'btn-appointment-more-options')
    await clickElementByTestId(user, 'btn-to-edit-appointment')
    user.getByText('Edit appointment')
    const titleField = await locateElementByTestId(user, 'appointment-title-input')
    await titleField.fill('E2E Party Edited')
    await clickElementByTestId(user, 'form-wrapper-save-btn')

    await clickElementByTestId(user, GET_INVOLVED_SPACE_TAB_TEST_ID)
    const appointmentCard = await locateElementByTestId(user, 'space-appointment-tile')
    await expect(appointmentCard).toContainText('E2E Party Edited')
  })
}
