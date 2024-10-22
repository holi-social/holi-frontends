import { Page, expect } from '@playwright/test'

import { randomSpaceName } from '@holi/e2e-web/tests/helpers/fixtures'

import { clickButtonByText, clickElementByTestId, locateElementByTestId, retry } from './helpers'
import { createSpace } from './helpers/spaces'
import { test } from './testmaster'

test.describe('@SpaceNotifications', async () => {
  test('multi user journey', async ({ sessions, browserName }) => {
    // FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug `Error: page.goto: Navigation to "http://localhost:3000/login" is interrupted by another navigation to "http://localhost:3000/profile"`
    test.skip(browserName === 'webkit', 'FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug')

    const { page: adminA, user } = await sessions.signUp()
    const adminAId = user.id

    const { page: adminB, user: userb } = await sessions.signUp()
    const adminBFullName = userb.firstName + ' ' + userb.lastName
    const adminBId = userb.id

    const spaceName = randomSpaceName()
    await test.step('random user can create a space', async () => {
      //A at profile
      await createSpace(adminA, spaceName)
    })

    await test.step('admins space invitation notifies the invited user', async () => {
      //A invites B to space
      await clickElementByTestId(adminA, 'btn-space-invite')
      const messageTextField = await locateElementByTestId(adminA, 'space-invite-user-input')
      await messageTextField.fill(adminBFullName)

      await clickElementByTestId(adminA, 'btn-to-invite')

      // B accepts the invite notification
      await retry(async () => {
        await adminB.goto('/notifications')
        await expect(
          await locateElementByTestId(adminB, `space-invite-notification-item_${adminBId}_${adminAId}`)
        ).toBeVisible()
      })

      await clickElementByTestId(adminB, 'accept-invite-button')

      // A is notified about the acceptance of B
      await retry(async () => {
        await adminA.goto('/notifications')
        await expect(await locateElementByTestId(adminA, 'space-membership-item')).toBeVisible({ timeout: 10000 })
      })
    })

    await test.step('admin promotion notifies the promoted user', async () => {
      // A promotes B to admin
      await adminA.goto('/spaces/' + spaceName)
      await clickElementByTestId(adminA, 'btn-to-open-space-collaborators-modal')
      await clickButtonByText(adminA, adminBFullName)
      await clickElementByTestId(adminA, 'spaces-collaborators-grant-admin-btn')
      await clickElementByTestId(adminA, 'spaces-collaborators-grant-admin-confirmation-confirmation-primary')

      // B is notified about promotion
      await retry(async () => {
        await adminB.goto('/notifications')
        await expect(
          await locateElementByTestId(adminB, `space-permissions-notification-item_${adminBId}`)
        ).toBeVisible()
      })
    })

    const { page: collaborator, user: userCollaborator } = await sessions.signUp()
    const collaboratorId = userCollaborator.id

    await test.step('collaborator space join request notifies all admins', async () => {
      // when collaborator makes request
      await requestSpaceCollaboration(collaborator, spaceName)

      // then its waiting for approval
      await locateElementByTestId(collaborator, 'space-collaborate-pending-button')

      // when admins opens the app for a route that shows the full header
      await adminA.goto('/spaces')
      await adminB.goto('/spaces')

      // then notification bell shows a "unseen" notifications badges
      await locateElementByTestId(adminA, 'btn-to-notifications-with-badge')
      await locateElementByTestId(adminB, 'btn-to-notifications-with-badge')

      // then both admins are notified
      await retry(async () => {
        await adminA.goto('/notifications')
        await expect(
          await locateElementByTestId(adminA, `space-connection-notification-item_${adminAId}_${collaboratorId}`)
        ).toBeVisible()
      })

      await retry(async () => {
        await adminB.goto('/notifications')
        await expect(
          await locateElementByTestId(adminB, `space-connection-notification-item_${adminBId}_${collaboratorId}`)
        ).toBeVisible()
      })
    })

    await test.step('declining a space join request notifies the declined user', async () => {
      // when B declines the join request
      await clickElementByTestId(adminB, 'decline-connection-request-button')

      // then collaborator is notified
      await retry(async () => {
        await collaborator.goto('/notifications')
        await expect(await locateElementByTestId(collaborator, 'space-membership-item')).toBeVisible()
      })
    })

    await test.step('space can be deleted', async () => {
      await retry(async () => {
        await adminA.goto('/spaces/' + spaceName)
        await clickElementByTestId(adminA, 'space-options-btn')
        await clickElementByTestId(adminA, 'space-delete')
        await clickElementByTestId(adminA, 'space-delete-confirmation-primary')
      })
    })
  })
})

async function requestSpaceCollaboration(user: Page, spaceName: string) {
  return test.step('user requests space membership', async () => {
    await user.goto('/spaces/' + spaceName)

    // wait for the react internals to settle the users logged in state
    await user.waitForTimeout(3000)

    await clickElementByTestId(user, 'space-collaborate-button')

    const messageTextField = await locateElementByTestId(user, 'holi-text-input')
    await messageTextField.fill("I'd love to collaborate!")

    // send
    await clickElementByTestId(user, 'space-join-request-modal-save-btn')
    // confirm the same button, to close the request confirm view
    await clickElementByTestId(user, 'space-join-request-modal-save-btn')
  })
}
