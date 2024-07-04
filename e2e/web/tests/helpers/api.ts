/* eslint-disable no-console */
import { faker } from '@faker-js/faker'
import { APIRequestContext, BrowserContext, Page } from '@playwright/test'

type FlowNode = {
  attributes: {
    name: string
    value: string
  }
}

const baseURL = process.env.BASE_URL || 'https://staging.dev.holi.social'

const updateUserMutation = `
  mutation UpdateAuthenticatedUser($input: UpdateAuthenticatedUserInput!) {
    updateAuthenticatedUserV2(input: $input) {
      id
      identity
    }
  }
`

const deleteAuthenticatedUserMutation = `
  mutation DeleteAuthenticatedUser {
    deleteAuthenticatedUser {
      success
    }
  }
`

const simpleGQLClient = async (request: APIRequestContext, query: string, variables?: object) => {
  const response = await request.post(`${baseURL}/api/graphql`, {
    headers: {
      'content-type': 'application/json',
    },
    data: {
      query,
      variables,
    },
  })

  return await response.json()
}

export const denyTracking = async (page: Page) => {
  await page.evaluate(() =>
    localStorage.setItem('HOLI_TRACKING_CONSENT', '{"ANALYTICS":"denied","PERSONALIZATION":"denied"}')
  )
}

export const deleteAuthenticatedAccount = async (context: BrowserContext) => {
  const deleteResponse = await simpleGQLClient(context.request, deleteAuthenticatedUserMutation)
  // eslint-disable-next-line no-console
  console.log('DELETE', deleteResponse)
  context.clearCookies()
}

export const signUp = async (context: BrowserContext, email: string, password: string) => {
  context.clearCookies()

  const flowResponse = await context.request.get(`${baseURL}/api/.ory/self-service/registration/browser`, {
    headers: { Accept: 'application/json' },
  })

  const flow = await flowResponse.json()

  console.log('FLOW', flow)

  const payload = {
    method: 'password',
    csrf_token:
      (flow.ui.nodes.find((n: FlowNode) => n.attributes.name === 'csrf_token')?.attributes.value as string) || '',
    password: password,
    traits: {
      email: email,
    },
  }

  console.log('PAYLOAD', payload)

  const registeredResponse = await context.request.post(
    `${baseURL}/api/.ory/self-service/registration?flow=${flow.id}`,
    {
      data: payload,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )

  const registered = await registeredResponse.json()

  console.log('REGISTERED', registered)

  const userUpdateResponse = await simpleGQLClient(context.request, updateUserMutation, {
    input: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      trackingConsentAnalytics: false,
      trackingConsentPersonalization: false,
    },
  })

  console.log('USER', userUpdateResponse)
}
