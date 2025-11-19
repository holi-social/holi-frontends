import type { LoginFlow, RegistrationFlow, UiNode, UiText } from '@ory/kratos-client'

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

export const registrationFlow: RegistrationFlow = {
  id: '8c67a4aa-cfd1-4ba9-aae8-d1a141e10cd9',
  type: 'browser',
  expires_at: '2025-11-14T13:30:27.004451799Z',
  issued_at: '2025-11-14T13:00:27.004451799Z',
  request_url: '/api/.ory/self-service/registration/browser?',
  ui: {
    action: '/api/.ory/self-service/registration?flow=8c67a4aa-cfd1-4ba9-aae8-d1a141e10cd9',
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
            id: 1040002,
            text: 'Sign up with Apple',
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
            id: 1040002,
            text: 'Sign up with Google',
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
          name: 'traits.email',
          type: 'email',
          required: true,
          autocomplete: 'email',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: 'E-Mail',
            type: 'info',
            context: {
              name: 'traits.email',
              title: 'E-Mail',
            },
          },
        },
      },
      {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'traits.name',
          type: 'text',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: 'Name',
            type: 'info',
            context: {
              name: 'traits.name',
              title: 'Name',
            },
          },
        },
      },
      {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'traits.given_name',
          type: 'text',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: 'Given name',
            type: 'info',
            context: {
              name: 'traits.given_name',
              title: 'Given name',
            },
          },
        },
      },
      {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'traits.family_name',
          type: 'text',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: 'Family name',
            type: 'info',
            context: {
              name: 'traits.family_name',
              title: 'Family name',
            },
          },
        },
      },
      {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'traits.consent',
          type: 'checkbox',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: 'Consent',
            type: 'info',
            context: {
              name: 'traits.consent',
              title: 'Consent',
            },
          },
        },
      },
      {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'traits.identity',
          type: 'text',
          disabled: false,
          node_type: 'input',
        },
        messages: [],
        meta: {},
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
            id: 1040006,
            text: 'Send sign up code',
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
          autocomplete: 'new-password',
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
            id: 1040001,
            text: 'Sign up',
            type: 'info',
          },
        },
      },
    ],
  },
  organization_id: null,
  state: 'choose_method',
}

export const createFlowWithNode = <F extends LoginFlow | RegistrationFlow>(flow: F, node: UiNode) => ({
  ...flow,
  ui: {
    ...flow.ui,
    nodes: [node, ...loginFlow.ui.nodes],
  },
})

export const createFlowWithMessages = <F extends LoginFlow | RegistrationFlow>(flow: F, messages: UiText[]) => ({
  ...flow,
  ui: {
    ...flow.ui,
    messages: [...messages, ...(loginFlow.ui.messages ?? [])],
  },
})

export const createFlowWithMessage = <F extends LoginFlow | RegistrationFlow>(flow: F, message: UiText) =>
  createFlowWithMessages(flow, [message])
