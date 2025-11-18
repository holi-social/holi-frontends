import { act, renderHook } from '@testing-library/react-native'
import type { UiNode } from '@ory/kratos-client'
import { useOtpLoginForm } from '@holi/core/screens/auth/form/hooks/useOtpLoginForm'
import { createLoginFlowWithNode, loginFlow } from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { TrackingEvent } from '@holi/core/tracking'

describe('useOtpLoginForm', () => {
  describe('static props', () => {
    it('should return correct static props', () => {
      const { result } = renderHook(() => useOtpLoginForm({ performLogin: jest.fn(), resetFlow: jest.fn() }))

      expect(result.current.autoFocusEmail).toBeTruthy()
      expect(result.current.submitLabel).toEqual('auth.login.cta.OTPlogin')
    })
  })

  describe('email', () => {
    it('should return empty value for email if flow is missing', () => {
      const { result } = renderHook(() => useOtpLoginForm({ performLogin: jest.fn(), resetFlow: jest.fn() }))

      expect(result.current.email).toBeUndefined()
      expect(result.current.emailValidationError).toBeUndefined()
    })

    it('should get email value and validation message from flow', () => {
      const emailNode: UiNode = {
        type: 'input',
        group: 'default',
        attributes: {
          name: 'identifier',
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
        useOtpLoginForm({ flow: createLoginFlowWithNode(emailNode), performLogin: jest.fn(), resetFlow: jest.fn() })
      )

      expect(result.current.email).toEqual('asd')
      expect(result.current.emailValidationError).toEqual('"asd" is not valid "email"')
    })

    it('should expose function to update the email', async () => {
      const { result } = renderHook(() =>
        useOtpLoginForm({ flow: loginFlow, performLogin: jest.fn(), resetFlow: jest.fn() })
      )

      expect(result.current.email).toEqual('')

      act(() => {
        result.current.setEmail('foo@bar.baz')
      })

      expect(result.current.email).toEqual('foo@bar.baz')
    })

    it('should reset flow on email change', () => {
      const resetFlow = jest.fn()

      const { result } = renderHook(() => useOtpLoginForm({ flow: loginFlow, performLogin: jest.fn(), resetFlow }))

      result.current.onChangeEmail()

      expect(resetFlow).toHaveBeenCalled()
    })
  })

  describe('code', () => {
    it('should return empty value for code if flow is missing', () => {
      const { result } = renderHook(() => useOtpLoginForm({ performLogin: jest.fn(), resetFlow: jest.fn() }))

      expect(result.current.code).toBeUndefined()
      expect(result.current.codeValidationError).toBeUndefined()
    })

    it('should get code value and validation message from flow', () => {
      const codeNode: UiNode = {
        type: 'input',
        group: 'code',
        attributes: {
          name: 'code',
          type: 'text',
          value: '123',
          required: true,
          disabled: false,
          node_type: 'input',
        },
        messages: [
          {
            id: 4000002,
            text: 'Property code is missing.',
            type: 'error',
            context: {
              property: 'code',
            },
          },
        ],
        meta: {
          label: {
            id: 1070013,
            text: 'Login code',
            type: 'info',
          },
        },
      }

      const { result } = renderHook(() =>
        useOtpLoginForm({ flow: createLoginFlowWithNode(codeNode), performLogin: jest.fn(), resetFlow: jest.fn() })
      )

      expect(result.current.code).toEqual('123')
      expect(result.current.codeValidationError).toEqual('Property code is missing.')
    })

    it('should expose function to update the code', async () => {
      const { result } = renderHook(() =>
        useOtpLoginForm({ flow: loginFlow, performLogin: jest.fn(), resetFlow: jest.fn() })
      )

      expect(result.current.code).toBeUndefined()

      act(() => {
        result.current.setCode('123456')
      })

      expect(result.current.code).toEqual('123456')
    })
  })

  describe('submit', () => {
    it('should disable submit and do nothing if flow is missing', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() => useOtpLoginForm({ performLogin, resetFlow: jest.fn() }))

      expect(result.current.submitDisabled).toBeTruthy()

      await result.current.onSubmit()

      expect(performLogin).not.toHaveBeenCalled()
      expect(mockTrack).not.toHaveBeenCalled()
    })

    it('should track button press when code is requested', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() =>
        useOtpLoginForm({
          flow: loginFlow,
          performLogin,
          resetFlow: jest.fn(),
        })
      )

      await result.current.onSubmit()

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: 'email',
          screen: 'mainLogin',
        })
      )
    })

    it('should track button press when code is submitted', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() =>
        useOtpLoginForm({
          flow: { ...loginFlow, state: 'sent_email' },
          performLogin,
          resetFlow: jest.fn(),
        })
      )

      await result.current.onSubmit()

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: 'code',
          screen: 'mainLogin',
        })
      )
    })

    it('should perform login with correct payload', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() => useOtpLoginForm({ flow: loginFlow, performLogin, resetFlow: jest.fn() }))

      expect(result.current.submitDisabled).toBeFalsy()

      act(() => {
        result.current.setEmail('ada@lovelace.com')
        result.current.setCode('123456')
      })

      await result.current.onSubmit()

      expect(performLogin).toHaveBeenCalledWith({
        method: 'code',
        identifier: 'ada@lovelace.com',
        code: '123456',
        csrf_token: 'some token',
      })
    })
  })

  describe('resend', () => {
    it('should do nothing if flow is missing', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() => useOtpLoginForm({ performLogin, resetFlow: jest.fn() }))

      await result.current.onResend()

      expect(performLogin).not.toHaveBeenCalled()
      expect(mockTrack).not.toHaveBeenCalled()
    })

    it('should track button press', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() =>
        useOtpLoginForm({
          flow: loginFlow,
          performLogin,
          resetFlow: jest.fn(),
        })
      )

      await result.current.onResend()

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: 'resend',
          screen: 'mainLogin',
        })
      )
    })

    it('should perform login with correct payload', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() => useOtpLoginForm({ flow: loginFlow, performLogin, resetFlow: jest.fn() }))

      act(() => {
        result.current.setEmail('ada@lovelace.com')
      })

      await result.current.onResend()

      expect(performLogin).toHaveBeenCalledWith({
        method: 'code',
        identifier: 'ada@lovelace.com',
        csrf_token: 'some token',
        resend: 'code',
      })
    })
  })
})
