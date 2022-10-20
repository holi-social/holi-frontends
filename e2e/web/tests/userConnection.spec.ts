import { faker } from '@faker-js/faker'
import { test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  defaultAuthSteps,
  waitForAnimationEnd,
  waitForElementByTestId,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@UserConnection', () => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  test('request connection from another user profile page', async ({ context, page }) => {
    // create a new user
    await defaultAuthSteps({ context, page, email, password }, 'registration')
    await waitForElementByTestId(page, 'btn-to-logout')

    // visit another user's profile page via url
    const userId = process.env.E2E_USER_ID || 'empty'
    await page.goto('/profile/' + userId)
    await waitForElementByTestId(page, 'user-profile-full-name')

    // for the newly created user, the button state should be NOT_CONNECTED
    await clickElementByTestId(page, `user-connection-button-NOT_CONNECTED`)

    // after clicked, the button state should change to REQUESTED
    await page.waitForSelector(byTestId('user-connection-button-REQUESTED'), { state: 'detached' })

    await checkAccessibility(page)
  })

  test('cancel connection request from another user profile page', async ({ context, page }) => {
    // create a new user
    await defaultAuthSteps({ context, page, email, password }, 'login')
    await waitForElementByTestId(page, 'btn-to-logout')

    // visit another user's profile page via url
    const userId = process.env.E2E_USER_ID || 'empty'
    await page.goto('/profile/' + userId)
    await waitForElementByTestId(page, 'user-profile-full-name')

    // after the previous test, the button state should be REQUESTED
    await clickElementByTestId(page, `user-connection-button-REQUESTED`)

    // after clicked, the confirmation dialog should be opened
    await waitForAnimationEnd(page.locator(byTestId('user-connection-confirmation-dialog')))

    // click on confirm within the confirmation dialog and wait for NOT_CONNECTED state
    await clickElementByTestId(page, `user-connection-confirmation-confirm`)
    await waitForAnimationEnd(page.locator(byTestId('user-connection-confirmation-dialog')))
    await page.waitForSelector(byTestId('user-connection-button-NOT_CONNECTED'))

    await checkAccessibility(page)
  })
})
