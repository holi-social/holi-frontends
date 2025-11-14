import { getInputNodeState } from '@holi/core/screens/auth/form/helpers/getInputNodeState'
import type { LoginFlow, UiNode } from '@ory/kratos-client'
import type { UseTranslationResponse } from 'react-i18next'
import i18n from '@holi/core/i18n'

const i18nMock = {
  ...i18n,
  exists: () => true,
  t: ((key: string) => key) as UseTranslationResponse<'translation', undefined>['i18n']['t'],
}

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

describe('getInputNodeState', () => {
  it('should return node value', () => {
    const state = getInputNodeState(
      createFlowWithUiNode({
        type: 'input',
        group: 'password',
        attributes: {
          name: 'password',
          type: 'password',
          required: true,
          autocomplete: 'new-password',
          disabled: false,
          node_type: 'input',
          value: 'P4ssw0rd',
        },
        messages: [],
        meta: {
          label: {
            id: 1070001,
            text: 'Password',
            type: 'info',
          },
        },
      }),
      i18nMock,
      'password'
    )

    expect(state).toEqual({
      value: 'P4ssw0rd',
      validationError: '',
    })
  })

  it('should return node validation error', () => {
    const state = getInputNodeState(
      createFlowWithUiNode({
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
        messages: [
          {
            id: 4000032,
            text: 'The password must be at least 8 characters long, but got 3.',
            type: 'error',
            context: {
              actual_length: 3,
              min_length: 8,
            },
          },
        ],
        meta: {
          label: {
            id: 1070001,
            text: 'Password',
            type: 'info',
          },
        },
      }),
      i18nMock,
      'password'
    )

    expect(state).toEqual({
      validationError: 'auth.login.input.message.4000032',
    })
  })

  it('should return empty state if node for name was not found', () => {
    const state = getInputNodeState(
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
      i18nMock,
      'password'
    )

    expect(state).toEqual({})
  })

  it('should return empty state if flow is missing', () => {
    const state = getInputNodeState(undefined, i18nMock, 'password')

    expect(state).toEqual({})
  })
})
