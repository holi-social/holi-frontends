import { clickButtonByText, clickElementByTestId, locateElementByTestId, retry } from '@holi/e2e-web/tests/helpers'
import { test } from '@holi/e2e-web/tests/testmaster'
import { expect } from '@playwright/test'

test.describe('@Task collaboration multi user journey', () => {
  test('Task Space Admins can be contacted by User', async ({ sessions }) => {
    const { page: alice, user: aliceUser, api: aliceApi } = await sessions.signUp()
    const aliceFullName = aliceUser.firstName + ' ' + aliceUser.lastName
    const { page: bob, user: bobUser } = await sessions.signUp()
    const bobFullName = bobUser.firstName + ' ' + bobUser.lastName
    const { page: carol } = await sessions.signUp()

    const space = await aliceApi.createSpace()
    const task = await aliceApi.createSpaceTask(space.id)

    // wait for the home to stabilize
    await expect(alice.getByTestId('home-feed-insights-heading')).toBeVisible()

    await test.step('Another User is promoted to space admin', async () => {
      //A invites B to space
      await alice.goto('/spaces/' + space.name)
      await clickElementByTestId(alice, 'btn-space-invite')
      const messageTextField = await locateElementByTestId(alice, 'space-invite-user-input')
      await messageTextField.fill(bobFullName)

      await clickElementByTestId(alice, 'btn-to-invite')

      // B accepts the invite notification
      await retry(async () => {
        await bob.goto('/notifications')
        await expect(
          await locateElementByTestId(bob, `space-invite-notification-item_${bobUser.id}_${aliceUser.id}`)
        ).toBeVisible()
      })
      await clickElementByTestId(bob, 'accept-invite-button')

      //make B admin
      await alice.goto('/spaces/' + space.name)
      await clickElementByTestId(alice, 'btn-to-open-space-collaborators-modal')
      await clickButtonByText(alice, bobFullName)
      await clickElementByTestId(alice, 'spaces-collaborators-grant-admin-btn')
      await clickElementByTestId(alice, 'spaces-collaborators-grant-admin-confirmation-confirmation-primary')
    })

    await test.step('User can engage in contact', async () => {
      await carol.goto('/spaces/' + space.id + '/tasks')
      await carol.getByTestId('link').first().click()
      await carol.getByLabel('Get in touch').click()
    })

    await test.step('Task chat explanation modal is confirmable', async () => {
      await expect(carol.getByText('Start by simply saying "Hi"')).toBeVisible()
      await carol.getByRole('button', { name: 'Start chatting' }).click()
    })

    await test.step('Multi user chat room with all space admins opens', async () => {
      await expect(async () => {
        carol.getByRole('banner', { name: task.name })
        carol.getByRole('button', { name: 'Send message' })
      }).toPass()

      //and all admins are mentioned
      await expect(carol.getByRole('link', { name: aliceFullName })).toBeVisible()
      await expect(carol.getByRole('link', { name: bobFullName })).toBeVisible()
    })
  })
})
