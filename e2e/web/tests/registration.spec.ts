import { faker } from '@faker-js/faker'
import { test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, defaultAuthSteps, waitForElementByTestId } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Registration', () => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  test('redirects from Registration to Login and back to Registration', async ({ page }) => {
    await clickElementByTestId(page, 'btn-to-profile-view')

    // go to registration
    await clickElementByTestId(page, 'btn-to-registration-form')
    await page.waitForURL('**/registration')

    // switch to login
    await clickElementByTestId(page, 'btn-to-login-form')
    await page.waitForURL('**/login')

    // switch to registration again
    await clickElementByTestId(page, 'btn-to-registration-form')
    await page.waitForURL('**/registration')
  })

  test('validate Email and password fields', async ({ context, page }) => {
    // no password and email provided
    await defaultAuthSteps(
      {
        context,
        page,
        email: '',
        password: '',
      },
      'registration'
    )

    await waitForElementByTestId(page, 'ory-traits-email-input-error-message')
    await waitForElementByTestId(page, 'ory-password-input-error-message')
    await checkAccessibility(page)

    // invalid email provided
    await defaultAuthSteps(
      {
        context,
        page,
        email: '!!!wrong@',
        password,
      },
      'registration'
    )

    await waitForElementByTestId(page, 'ory-traits-email-input-error-message')

    // short password provided
    await defaultAuthSteps(
      {
        context,
        page,
        email,
        password: 'Sh0rt',
      },
      'registration'
    )

    await waitForElementByTestId(page, 'ory-password-input-error-message')

    // weak password provided
    await defaultAuthSteps(
      {
        context,
        page,
        email,
        password: '11111111',
      },
      'registration'
    )

    await waitForElementByTestId(page, 'ory-password-input-error-message')
  })

  test('Registration - Logout', async ({ context, page }) => {
    // create a new user
    await defaultAuthSteps(
      {
        context,
        page,
        email,
        password,
      },
      'registration'
    )

    await waitForElementByTestId(page, 'btn-to-settings')

    // try to go to registration or login page with logged in user
    await page.goto('/registration')
    await waitForElementByTestId(page, 'btn-to-settings')

    await page.goto('/login')
    await waitForElementByTestId(page, 'btn-to-settings')

    // logout
    await clickElementByTestId(page, 'btn-to-settings')
    await clickElementByTestId(page, 'btn-to-logout')
    await clickElementByTestId(page, 'confirm-logout-button')

    // try to create a new user with the same credentials and assert that this fails
    await defaultAuthSteps(
      {
        context,
        page,
        email,
        password,
      },
      'registration'
    )
    await waitForElementByTestId(page, 'ory-traits-email-input-error-message')
  })
})
