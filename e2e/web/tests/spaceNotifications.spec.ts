import { Page, expect } from '@playwright/test'

import {
  byTestId,
  clickButtonByText,
  clickElementByTestId,
  locateElementByTestId,
  randomSpaceName,
  retry,
} from '@holi/e2e-web/tests/helpers'
import { test } from '@holi/e2e-web/tests/testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.setTimeout(240000)

test.describe('@SpaceNotifications', () => {
  test('multi user journey', async ({ userHandler, browserName }) => {
    // FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug `Error: page.goto: Navigation to "http://localhost:3000/login" is interrupted by another navigation to "http://localhost:3000/profile"`
    test.skip(browserName === 'webkit', 'FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug')

    await userHandler.asRandomUser(async (adminA, adminAId) => {
      const spaceName = randomSpaceName()
      await test.step('random user can create a space', async () => {
        //A at profile
        await createSpace(adminA, spaceName)
      })

      await userHandler.asRandomUser(async (adminB, adminBId, adminBFullName) => {
        await test.step('admins space invitation notifies the invited user', async () => {
          //A invites B to space
          await clickElementByTestId(adminA, 'btn-space-invite')
          const messageTextField = await locateElementByTestId(adminA, 'space-invite-user-input')
          await messageTextField.fill(adminBFullName)

          await clickElementByTestId(adminA, 'btn-to-invite')

          // B accepts the invite notification
          await retry(async () => {
            await adminB.goto('/notifications')
            await locateElementByTestId(adminB, `space-invite-notification-item_${adminBId}_${adminAId}`)
            await clickElementByTestId(adminB, 'accept-invite-button')
          })

          // A is notified about the acceptance of B
          await retry(async () => {
            await adminA.goto('/notifications')
            // await expect(adminA.getByTestId('space-membership-item')).toBeVisible()
            await locateElementByTestId(adminA, 'space-membership-item')
          })
        })

        await test.step('admin promotion notifies the promoted user', async () => {
          // A promotes B to admin
          await adminA.goto('/spaces/' + spaceName)
          await clickElementByTestId(adminA, 'btn-to-open-space-collaborators-modal')
          await clickButtonByText(adminA, adminBFullName)
          await clickElementByTestId(adminA, 'spaces-collaborators-grant-admin-btn')
          await clickElementByTestId(adminA, 'spaces-collaborators-grant-admin-confirmation-confirmation-confirm')

          // B is notified about promotion
          await retry(async () => {
            await adminB.goto('/notifications')
            await locateElementByTestId(adminB, `space-permissions-notification-item_${adminBId}`)
          })
        })

        await userHandler.asRandomUser(async (collaborator, collaboratorId) => {
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

            // when admins open their notification center
            await clickElementByTestId(adminA, 'btn-to-notifications')
            await clickElementByTestId(adminB, 'btn-to-notifications')

            // then both admins are notified
            await locateElementByTestId(adminA, `space-connection-notification-item_${adminAId}_${collaboratorId}`)
            await locateElementByTestId(adminB, `space-connection-notification-item_${adminBId}_${collaboratorId}`)
          })

          await test.step('declining a space join request notifies the declined user', async () => {
            // when B declines the join request
            await clickElementByTestId(adminB, 'decline-connection-request-button')

            // then collaborator is notified
            await retry(async () => {
              await collaborator.goto('/notifications')
              await locateElementByTestId(collaborator, 'space-membership-item')
            })
          })
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

const createSpace = async (page: Page, initialName = 'e2e space name', initialGoal = 'e2e space goal') => {
  await clickElementByTestId(page, 'btn-to-spaces')
  await clickElementByTestId(page, 'btn-create-space')

  await inputSpaceNameAndGoal(page, initialName, initialGoal)
  await clickElementByTestId(page, 'holi-wizard-next-btn')

  const termCheckboxes = page.locator(`${byTestId('space-terms-list')} >> [role="checkbox"]`)
  await termCheckboxes.nth(0).click()
  await clickElementByTestId(page, 'holi-wizard-next-btn')

  await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')
  await clickElementByTestId(page, 'holi-wizard-next-btn')

  try {
    await clickElementByTestId(page, 'space-onboard-content-close-btn')
  } catch (e) {
    // sometimes the modal doesn't show
    // just continue
  }

  try {
    await clickElementByTestId(page, 'space-edit-close')
  } catch (e) {
    // sometimes space creation does not end in edit mode
    // just continue
  }
}

const inputSpaceNameAndGoal = async (page: Page, name: string, goal: string) => {
  const nameInput = await locateElementByTestId(page, 'space-name-input')
  await nameInput.fill(name)

  const goalInput = await locateElementByTestId(page, 'space-goal-input')
  await goalInput.fill(goal)
}
