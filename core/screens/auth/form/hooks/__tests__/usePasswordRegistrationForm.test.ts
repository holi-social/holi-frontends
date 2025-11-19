import { act, renderHook } from '@testing-library/react-native'
import type { UiNode } from '@ory/kratos-client'
import { usePasswordRegistrationForm } from '@holi/core/screens/auth/form/hooks/usePasswordRegistrationForm'
import { createFlowWithNode, registrationFlow } from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { TrackingEvent } from '@holi/core/tracking'

describe('usePasswordRegistrationForm', () => {
  describe('static props', () => {
    it('should return correct static props', () => {
      const { result } = renderHook(() => usePasswordRegistrationForm({ performRegistration: jest.fn() }))

      expect(result.current.autoFocusEmail).toBeTruthy()
      expect(result.current.submitLabel).toEqual('auth.login.input.label-SignUp')
    })
  })

  describe('email', () => {
    it('should return empty value for email if flow is missing', () => {
      const { result } = renderHook(() => usePasswordRegistrationForm({ performRegistration: jest.fn() }))

      expect(result.current.email).toBeUndefined()
      expect(result.current.emailValidationError).toBeUndefined()
    })

    it('should get email value and validation message from flow', () => {
      const emailNode: UiNode = {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'traits.email',
          type: 'text',
          value: 'asd',
          required: true,
          disabled: false,
          node_type: 'input',
        },
        messages: [
          {
            id: 4000001,
            text: '"asd" is not valid "email"',
            type: 'error',
            context: {
              reason: '"asd" is not valid "email"',
            },
          },
        ],
        meta: {
          label: {
            id: 1070004,
            text: 'ID',
            type: 'info',
          },
        },
      }

      const { result } = renderHook(() =>
        usePasswordRegistrationForm({
          flow: createFlowWithNode(registrationFlow, emailNode),
          performRegistration: jest.fn(),
        })
      )

      expect(result.current.email).toEqual('asd')
      expect(result.current.emailValidationError).toEqual('"asd" is not valid "email"')
    })

    it('should expose function to update the email', async () => {
      const { result } = renderHook(() =>
        usePasswordRegistrationForm({ flow: registrationFlow, performRegistration: jest.fn() })
      )

      expect(result.current.email).toBeUndefined()

      act(() => {
        result.current.setEmail('foo@bar.baz')
      })

      expect(result.current.email).toEqual('foo@bar.baz')
    })
  })

  describe('password', () => {
    it('should return empty value for password if flow is missing', () => {
      const { result } = renderHook(() => usePasswordRegistrationForm({ performRegistration: jest.fn() }))

      expect(result.current.password).toBeUndefined()
      expect(result.current.passwordValidationError).toBeUndefined()
    })

    it('should get password value and validation message from flow', () => {
      const passwordNode: UiNode = {
        type: 'input',
        group: 'password',
        attributes: {
          name: 'password',
          type: 'password',
          value: '123',
          required: true,
          autocomplete: 'current-password',
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
      }

      const { result } = renderHook(() =>
        usePasswordRegistrationForm({
          flow: createFlowWithNode(registrationFlow, passwordNode),
          performRegistration: jest.fn(),
        })
      )

      expect(result.current.password).toEqual('123')
      expect(result.current.passwordValidationError).toEqual(
        'The password must be at least 8 characters long, but got 3.'
      )
    })

    it('should expose function to update the password', async () => {
      const { result } = renderHook(() =>
        usePasswordRegistrationForm({ flow: registrationFlow, performRegistration: jest.fn() })
      )

      expect(result.current.password).toBeUndefined()

      act(() => {
        result.current.setPassword('P4ssw0rd')
      })

      expect(result.current.password).toEqual('P4ssw0rd')
    })
  })

  describe('submit', () => {
    it('should disable submit and do nothing if flow is missing', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() => usePasswordRegistrationForm({ performRegistration }))

      expect(result.current.submitDisabled).toBeTruthy()

      await result.current.onSubmit()

      expect(performRegistration).not.toHaveBeenCalled()
      expect(mockTrack).not.toHaveBeenCalled()
    })

    it('should track button press', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() =>
        usePasswordRegistrationForm({
          flow: registrationFlow,
          performRegistration,
        })
      )

      await result.current.onSubmit()

      expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Auth.LoginButtonPressed)
    })

    it('should perform registration with correct payload', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() => usePasswordRegistrationForm({ flow: registrationFlow, performRegistration }))

      expect(result.current.submitDisabled).toBeFalsy()

      act(() => {
        result.current.setEmail('ada@lovelace.com')
        result.current.setPassword('P4ssw0rd')
      })

      await result.current.onSubmit()

      expect(performRegistration).toHaveBeenCalledWith({
        method: 'password',
        traits: {
          email: 'ada@lovelace.com',
        },
        password: 'P4ssw0rd',
        csrf_token: 'some token',
      })
    })
  })
})
