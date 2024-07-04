import { test } from './testmaster'

test.describe('@Demo', () => {
  test('API', async ({ sessions }) => {
    const { page } = await sessions.signUp()

    await page.goto('/')

    await page.waitForTimeout(5 * 1000)
  })
})
