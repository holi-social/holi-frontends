import {
  clickButtonByText,
  clickElementByAriaLabel,
  clickElementByTestId,
  locateElementByTestId,
  retry,
} from '@holi/e2e-web/tests/helpers'
import { test } from '@holi/e2e-web/tests/testmaster'
import { expect } from '@playwright/test'
import { InteractionType, VisibilityType } from '@holi/api/graphql/graphql-codegen'

test.describe('@Task collaboration multi user journey', () => {
  test('Task Space Admins can be contacted by User', async ({ sessions }) => {
    const { page: alice, user: aliceUser, api: aliceApi } = await sessions.signUp()
    const aliceFullName = aliceUser.firstName + ' ' + aliceUser.lastName
    const { page: bob, user: bobUser } = await sessions.signUp()
    const bobFullName = bobUser.firstName + ' ' + bobUser.lastName
    const { page: carol } = await sessions.signUp()

    const space = await aliceApi.createSpace()
    const task = await aliceApi.createSpaceTask(space.id, {
      interactionType: InteractionType.Chat,
      visibility: VisibilityType.Public,
    })

    await test.step('Another User is promoted to space admin', async () => {
      //  Alice invites Bob to space
      await alice.goto('/spaces/' + space.name)
      await clickElementByTestId(alice, 'btn-space-invite')
      const messageTextField = await locateElementByTestId(alice, 'space-invite-user-input')
      await messageTextField.fill(bobFullName)

      await clickElementByTestId(alice, 'btn-to-invite')

      //  Bob accepts the invite notification
      await retry(async () => {
        await bob.goto('/notifications')
        await expect(
          await locateElementByTestId(bob, `space-invite-notification-item_${bobUser.id}_${aliceUser.id}`)
        ).toBeVisible()
      })
      await clickElementByTestId(bob, 'accept-invite-button')

      //  make Bob admin
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
      await carol.getByRole('button', { name: 'Open chat' }).click()
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

    await test.step('User can view the engaged (contacted) task in the profile', async () => {
      await carol.goto('/profile')
      carol.getByText('My Engagements')

      const card = carol.getByTestId('volunteering-reco-card-with-status').first()

      await expect(card).toBeVisible({ timeout: 10000 })
      await expect(card).toContainText(task.name)
    })

    await test.step('User advance the engagements volunteering opportunity status by chatting', async () => {
      await clickElementByTestId(carol, 'volunteering-reco-card-with-status')
      await carol.getByRole('button', { name: 'Open chat' }).click()

      const chatInputBox = carol.getByTestId('chat-message-input-input')
      await chatInputBox.fill('Hello from automated QA task collaborator (e2e)')

      await clickElementByAriaLabel(carol, 'Send message')
      await carol.getByText('Hello from automated QA task collaborator (e2e)')
      await clickElementByTestId(carol, 'nav-button-back')

      await clickElementByAriaLabel(carol, 'Go to next step')
      await clickElementByAriaLabel(carol, 'Mark as done')
      await clickElementByAriaLabel(carol, 'Claim')

      await carol.goto('/profile')

      const card = carol.getByTestId('volunteering-reco-card-with-status').first()
      await expect(card).toContainText('Helping')
    })
  })
})
