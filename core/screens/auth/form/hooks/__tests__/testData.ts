import type { LoginFlow, UiNode, UiText } from '@ory/kratos-client'

export const loginFlow: LoginFlow = {
  id: '31d562f0-8cab-43a5-b6d6-0ef7e12fa940',
  organization_id: null,
  type: 'browser',
  expires_at: '2025-11-05T16:19:38.25312375Z',
  issued_at: '2025-11-05T15:49:38.25312375Z',
  request_url: '/api/.ory/self-service/login/browser?refresh=true',
  ui: {
    action: '/api/.ory/self-service/login?flow=31d562f0-8cab-43a5-b6d6-0ef7e12fa940',
    method: 'POST',
    nodes: [
      {
        type: 'input',
        group: 'oidc',
        attributes: {
          name: 'provider',
          type: 'submit',
          value: 'apple-_KPH8UUU',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1010002,
            text: 'Sign in with Apple',
            type: 'info',
            context: {
              provider: 'Apple',
              provider_id: 'apple-_KPH8UUU',
            },
          },
        },
      },
      {
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
      },
      {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'csrf_token',
          type: 'hidden',
          value: 'some token',
          required: true,
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {},
      },
      {
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
      },
      {
        type: 'input',
        group: 'code',
        attributes: {
          name: 'method',
          type: 'submit',
          value: 'code',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1010015,
            text: 'Send sign in code',
            type: 'info',
          },
        },
      },
      {
        type: 'input',
        group: 'password',
        attributes: {
          name: 'password',
          type: 'password',
          required: true,
          autocomplete: 'current-password',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1070001,
            text: 'Password',
            type: 'info',
          },
        },
      },
      {
        type: 'input',
        group: 'password',
        attributes: {
          name: 'method',
          type: 'submit',
          value: 'password',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1010022,
            text: 'Sign in with password',
            type: 'info',
          },
        },
      },
    ],
  },
  created_at: '2025-11-05T15:49:38.260449Z',
  updated_at: '2025-11-05T15:49:38.260449Z',
  refresh: false,
  requested_aal: 'aal1',
  state: 'choose_method',
}

export const createLoginFlowWithNode = (node: UiNode) => ({
  ...loginFlow,
  ui: {
    ...loginFlow.ui,
    nodes: [node, ...loginFlow.ui.nodes],
  },
})

export const createLoginFlowWithMessage = (message: UiText) => ({
  ...loginFlow,
  ui: {
    ...loginFlow.ui,
    messages: [message, ...(loginFlow.ui.messages ?? [])],
  },
})
