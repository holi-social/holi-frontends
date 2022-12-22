import { faker } from '@faker-js/faker'
import { test } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  createUserSendConnectionRequest,
  defaultAuthSteps,
  waitForAnimationEnd,
  waitForElementByTestId,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Notifications', () => {
  test.describe('CONNECTION_REQUEST', async () => {
    const emails = [
      `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`,
      `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`,
    ]
    const password = 'TheSamePassword4A11E2eUsers'

    test('create two users who send CONNECTION_REQUEST to the test user', async ({ context, page }) => {
      for (const email of emails) {
        await createUserSendConnectionRequest({ context, page, email, password })
      }
    })

    test('ignore CONNECTION_REQUEST from first user and accept it from the second one', async ({ context, page }) => {
      // login with your test user user
      await defaultAuthSteps(
        { context, page, email: process.env.E2E_USER_USERNAME, password: process.env.E2E_USER_PASSWORD },
        'login'
      )
      await waitForElementByTestId(page, 'btn-to-settings')

      // go to notifications
      await page.goto('/notifications')
      await waitForElementByTestId(page, 'connection-notification-item')

      // ignore first CONNECTION_REQUEST
      await clickElementByTestId(page, 'ignore-connection-request-button')
      await waitForAnimationEnd(page.locator(byTestId('connection-notification-loader-indicator')))

      // accept second CONNECTION_REQUEST
      await clickElementByTestId(page, 'accept-connection-request-button')
      await waitForAnimationEnd(page.locator(byTestId('connection-notification-loader-indicator')))
    })
  })
})
