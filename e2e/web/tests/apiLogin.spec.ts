import { BrowserContext } from '@playwright/test'

import { finishAccountSetup } from '@holi/e2e-web/tests/helpers'

import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

const signUp = async (context: BrowserContext, email: string, password: string) => {
  const baseURL = process.env.BASE_URL || 'https://staging.dev.holi.social'

  context.clearCookies()

  const flowResponse = await context.request.get(`${baseURL}/api/.ory/self-service/registration/browser`, {
    headers: { Accept: 'application/json' },
  })

  const flow = await flowResponse.json()

  const payload = {
    method: 'password',
    csrf_token: (flow.ui.nodes.find((n) => n.attributes.name === 'csrf_token')?.attributes.value as string) || '',
    password: password,
    traits: {
      email: email,
    },
  }

  const upated = await context.request.post(`${baseURL}/api/.ory/self-service/registration?flow=${flow.id}`, {
    data: payload,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const updRes = await upated.json()

  console.log('WAY', updRes)
}

test.describe('@ApiLogin', () => {
  test('API', async ({ context, page }) => {
    signUp(context, 'tom+1234567891@holi.social', 'Goo(999____urejhefnlfw')

    await page.goto('/')

    finishAccountSetup(page)

    await page.waitForTimeout(150 * 10000)
  })
})
