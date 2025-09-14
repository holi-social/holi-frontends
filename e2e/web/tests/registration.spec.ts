import { faker } from '@faker-js/faker'
import { type BrowserContext, type Page, expect, test } from '@playwright/test'

import { deleteAuthenticatedAccount } from '@holi/e2e-web/tests/helpers/api'
import { newUserEmail, newUserPassword, randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

test.describe('@Registration', () => {
  test.describe('Registering with email & password', () => {
    test('should not register with invalid credentials', async ({ context, page }) => {
      const validPassword = randomPassword()
      const validEmail = 'foobar@barbaz.de'

      // no password and email provided
      await fillOutRegistration(context, page, { email: '', password: '' })
      await expect(page.getByTestId('ory-traits-email-input-error-message')).toBeVisible()
      await expect(page.getByTestId('ory-password-input-error-message')).toBeVisible()

      // invalid email provided
      await fillOutRegistration(context, page, { email: '!!!wrong@', password: validPassword })
      await expect(page.getByTestId('ory-traits-email-input-error-message')).toBeVisible()

      // short password provided
      await fillOutRegistration(context, page, { email: validEmail, password: 'Sh0rt' })
      await expect(page.getByTestId('ory-password-input-error-message')).toBeVisible()

      // weak password provided
      await fillOutRegistration(context, page, { email: validEmail, password: '11111111' })
      await expect(page.getByTestId('ory-password-input-error-message')).toBeVisible()
    })

    test('should register with valid credentials', async ({ context, page }) => {
      await fillOutRegistration(context, page)
      await finishAccountSetup(page)

      await expect(page.getByLabel('Bottom navigation').getByText('Me')).toBeVisible({ timeout: 30_000 })

      await deleteAuthenticatedAccount(context)
    })
  })
})

const finishAccountSetup = async (page: Page) => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  await page.getByRole('textbox', { name: 'First name' }).fill(firstName)
  await page.getByRole('textbox', { name: 'Last name' }).fill(lastName)

  await page.getByRole('button', { name: 'Continue' }).click()
}

const fillOutRegistration = async (
  context: BrowserContext,
  page: Page,
  {
    email = newUserEmail(),
    password = newUserPassword,
  }: {
    email?: string
    password?: string
  } = {}
) => {
  await await context.clearCookies()
  await page.goto('/onboarding')

  await page.getByRole('button', { name: "Let's go" }).click()
  await page.getByRole('button', { name: 'Continue with email and password' }).click()

  await page.getByRole('textbox', { name: 'Email' }).fill(email)
  await page.getByRole('textbox', { name: 'Password' }).fill(password)

  await page.getByRole('button', { name: 'Create account' }).click()
}
