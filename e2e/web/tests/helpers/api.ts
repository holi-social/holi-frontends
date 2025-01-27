import { faker } from '@faker-js/faker'
import { APIRequestContext, BrowserContext } from '@playwright/test'

import { newUserEmail, randomPassword } from './fixtures'

export type User = {
  id: string
  identity: string
  firstName: string
  lastName: string
  email: string
  password: string
}

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

export const deleteAuthenticatedAccount = async (context: BrowserContext) => {
  const deleteResponse = await simpleGQLClient(context.request, deleteAuthenticatedUserMutation)
  if (process.env.DEBUG) console.log('DELETE', deleteResponse) // eslint-disable-line no-console
  await context.clearCookies()
}

export const signUp = async (
  context: BrowserContext,
  email: string = newUserEmail(),
  password: string = randomPassword()
): Promise<User> => {
  await context.clearCookies()

  const flowResponse = await context.request.get(`${baseURL}/api/.ory/self-service/registration/browser`, {
    headers: { Accept: 'application/json' },
  })

  const flow = await flowResponse.json()

  if (process.env.DEBUG) console.log('FLOW', flow) // eslint-disable-line no-console

  const payload = {
    method: 'password',
    csrf_token:
      (flow.ui.nodes.find((n: FlowNode) => n.attributes.name === 'csrf_token')?.attributes.value as string) || '',
    password: password,
    traits: {
      email: email,
    },
  }

  if (process.env.DEBUG) console.log('PAYLOAD', payload) // eslint-disable-line no-console

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

  if (process.env.DEBUG) console.log('REGISTERED', registered) // eslint-disable-line no-console

  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  const userUpdateResponse = await simpleGQLClient(context.request, updateUserMutation, {
    input: {
      firstName,
      lastName,
      trackingConsentAnalytics: false,
      trackingConsentPersonalization: false,
    },
  })

  if (process.env.DEBUG) console.log('USER', JSON.stringify(userUpdateResponse, null, 2)) // eslint-disable-line no-console

  return {
    id: userUpdateResponse.data.updateAuthenticatedUserV2.id,
    identity: userUpdateResponse.data.updateAuthenticatedUserV2.identity,
    firstName,
    lastName,
    email,
    password,
  }
}
