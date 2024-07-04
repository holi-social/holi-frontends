import { test } from './testmaster'

test.describe('@Demo', () => {
  test('API', async ({ session }) => {
    const { page } = await session.signUp()

    await page.goto('/')

    await page.waitForTimeout(5 * 1000)
  })
})
