import { faker } from '@faker-js/faker'
import type { APIRequestContext, BrowserContext } from '@playwright/test'

import { newUserEmail, randomPassword } from './fixtures'

import { readFileSync } from 'fs'
import { CreateTaskDocument } from '@holi/api/graphql/graphql-codegen'
import { print } from 'graphql'

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

export type E2ETestSpaceResponse = {
  id: string
  title: string
  description: string
  name: string
  cover: string
  coverBlurhash: string
}

export const createSpace = async (context: BrowserContext) => {
  const file = new File([new Uint8Array(readFileSync('tests/helpers/testimage.png'))], 'testimage.png')

  const formData = new FormData()
  formData.append(
    'operations',
    JSON.stringify({
      operationName: 'CreateSpace',
      variables: {
        input: {
          title: `E2E ${faker.company.name()}`,
          description: 'E2E Space Description',
          topicsV2: ['other'],
          cover: null,
        },
      },
      query:
        'mutation CreateSpace($input: CreateSpaceInput!) {\ncreateSpace(input: $input) {\n id\n title\n description\n name\n cover\n coverBlurhash\n name\n}\n}',
    })
  )
  formData.append('map', '{"1":["variables.input.cover"]}')
  formData.append('1', file, 'testimage.png')

  // todo gregor: use codegen types after generating the create space types
  // @ts-ignore
  const createSpaceResponse: Response<{ data?: { createSpace: E2ETestSpaceResponse }; errors?: object[] }> = await (
    await context.request.post(`${baseURL}/api/graphql`, {
      multipart: formData,
    })
  ).json()

  if (createSpaceResponse.errors) {
    throw new Error('Failed to create space ' + JSON.stringify(createSpaceResponse.errors, null, 2))
  }

  return createSpaceResponse.data.createSpace
}

export type E2ETestSpaceTaskResponse = {
  id: string
  name: string
  description: string
}

export const createSpaceTask = async (context: BrowserContext, spaceId: string) => {
  const createSpaceTaskResponse: { data?: { createTask: E2ETestSpaceTaskResponse }; errors?: object[] } = await (
    await context.request.post(`${baseURL}/api/graphql`, {
      data: {
        operationName: 'CreateTask',
        query: print(CreateTaskDocument),
        variables: {
          input: {
            spaceId: spaceId,
            name: faker.lorem.words(3),
            description: faker.lorem.lines(3),
            visibility: 'PUBLIC',
            locationType: 'REMOTE',
            regularity: 'ONE_TIME',
            contactEmail: faker.internet.email(),
            slotsAvailable: 1,
            skillsV2: [],
          },
        },
      },
    })
  ).json()

  if (createSpaceTaskResponse.errors) {
    throw new Error('Failed to create space task ' + JSON.stringify(createSpaceTaskResponse.errors, null, 2))
  }

  return createSpaceTaskResponse.data!.createTask
}
