import type { UiNode, LoginFlow } from '@ory/kratos-client'
import { getSocialLoginProviderId } from '@holi/core/screens/auth/form/helpers/getSocialLoginProviderId'

const createFlowWithUiNode = (node: UiNode): LoginFlow => ({
  expires_at: '2025-11-05T12:57:01.74283238Z',
  id: 'a571f1be-1821-4c4c-a99d-8cdb4e83cc7a',
  issued_at: '2025-11-05T12:27:01.74283238Z',
  request_url: '/api/.ory/self-service/login/browser?refresh=true',
  state: 'choose_method',
  type: 'browser',
  ui: {
    action: '/api/.ory/self-service/login?flow=a571f1be-1821-4c4c-a99d-8cdb4e83cc7a',
    method: 'POST',
    nodes: [node],
  },
})

describe('getSocialLoginProviderId', () => {
  it('should retrieve provider id from provider node', () => {
    const id = getSocialLoginProviderId(
      createFlowWithUiNode({
        type: 'input',
        group: 'oidc',
        attributes: {
          name: 'provider',
          type: 'submit',
          value: 'google-SBFqZZ_v',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1010002,
            text: 'Sign in with Google',
            type: 'info',
            context: {
              provider: 'Google',
              provider_id: 'google-SBFqZZ_v',
            },
          },
        },
      }),
      'Google'
    )

    expect(id).toEqual('google-SBFqZZ_v')
  })

  it('should return undefined if node is not for provider', () => {
    const id = getSocialLoginProviderId(
      createFlowWithUiNode({
        type: 'input',
        group: 'default',
        attributes: {
          name: 'identifier',
          type: 'text',
          value: '',
          required: true,
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1070004,
            text: 'ID',
            type: 'info',
          },
        },
      }),
      'Google'
    )

    expect(id).toBeUndefined()
  })

  it('should return undefined if node type is not input', () => {
    const id = getSocialLoginProviderId(
      createFlowWithUiNode({
        type: 'text',
        group: 'default',
        attributes: {
          id: 'some id',
          text: {
            id: 0,
            text: 'some text',
            type: 'info',
          },
          node_type: 'text',
        },
        messages: [],
        meta: {},
      }),
      'Google'
    )

    expect(id).toBeUndefined()
  })

  it('should return undefined if flow is undefined', () => {
    const id = getSocialLoginProviderId(undefined, 'Google')

    expect(id).toBeUndefined()
  })
})
