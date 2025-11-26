import { act, renderHook } from '@testing-library/react-native'
import type { UiNode } from '@ory/kratos-client'
import { useOtpRegistrationForm } from '@holi/core/screens/auth/form/hooks/useOtpRegistrationForm'
import { createFlowWithNode, registrationFlow } from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { TrackingEvent } from '@holi/core/tracking'

describe('useOtpRegistrationForm', () => {
  describe('static props', () => {
    it('should return correct static props', () => {
      const { result } = renderHook(() =>
        useOtpRegistrationForm({ performRegistration: jest.fn(), resetFlow: jest.fn() })
      )

      expect(result.current.autoFocusEmail).toBeTruthy()
      expect(result.current.submitLabel).toEqual('auth.login.input.label-SignUpCode')
      expect(result.current.trackingScreen).toEqual('mainRegistration')
    })
  })

  describe('email', () => {
    it('should return empty value for email if flow is missing', () => {
      const { result } = renderHook(() =>
        useOtpRegistrationForm({ performRegistration: jest.fn(), resetFlow: jest.fn() })
      )

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
        useOtpRegistrationForm({
          flow: createFlowWithNode(registrationFlow, emailNode),
          performRegistration: jest.fn(),
          resetFlow: jest.fn(),
        })
      )

      expect(result.current.email).toEqual('asd')
      expect(result.current.emailValidationError).toEqual('"asd" is not valid "email"')
    })

    it('should expose function to update the email', async () => {
      const { result } = renderHook(() =>
        useOtpRegistrationForm({ flow: registrationFlow, performRegistration: jest.fn(), resetFlow: jest.fn() })
      )

      expect(result.current.email).toBeUndefined()

      act(() => {
        result.current.setEmail('foo@bar.baz')
      })

      expect(result.current.email).toEqual('foo@bar.baz')
    })

    it('should reset flow on email change', () => {
      const resetFlow = jest.fn()

      const { result } = renderHook(() =>
        useOtpRegistrationForm({ flow: registrationFlow, performRegistration: jest.fn(), resetFlow })
      )

      result.current.onChangeEmail()

      expect(resetFlow).toHaveBeenCalled()
    })
  })

  describe('code', () => {
    it('should return empty value for code if flow is missing', () => {
      const { result } = renderHook(() =>
        useOtpRegistrationForm({ performRegistration: jest.fn(), resetFlow: jest.fn() })
      )

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
            text: 'Registration code',
            type: 'info',
          },
        },
      }

      const { result } = renderHook(() =>
        useOtpRegistrationForm({
          flow: createFlowWithNode(registrationFlow, codeNode),
          performRegistration: jest.fn(),
          resetFlow: jest.fn(),
        })
      )

      expect(result.current.code).toEqual('123')
      expect(result.current.codeValidationError).toEqual('Property code is missing.')
    })

    it('should expose function to update the code', async () => {
      const { result } = renderHook(() =>
        useOtpRegistrationForm({ flow: registrationFlow, performRegistration: jest.fn(), resetFlow: jest.fn() })
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
      const performRegistration = jest.fn()
      const { result } = renderHook(() => useOtpRegistrationForm({ performRegistration, resetFlow: jest.fn() }))

      expect(result.current.submitDisabled).toBeTruthy()

      await result.current.onSubmit('email')

      expect(performRegistration).not.toHaveBeenCalled()
      expect(mockTrack).not.toHaveBeenCalled()
    })

    it('should track button press when code is requested', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() =>
        useOtpRegistrationForm({
          flow: registrationFlow,
          performRegistration,
          resetFlow: jest.fn(),
        })
      )

      await result.current.onSubmit('email')

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: 'email',
          screen: 'mainRegistration',
        })
      )
      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.RegistrationOptionSelected({
          method: 'otp',
          screen: 'mainRegistration',
        })
      )
    })

    it('should track button press when code is submitted', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() =>
        useOtpRegistrationForm({
          flow: { ...registrationFlow, state: 'sent_email' },
          performRegistration,
          resetFlow: jest.fn(),
        })
      )

      await result.current.onSubmit('code')

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: 'code',
          screen: 'mainRegistration',
        })
      )
      expect(mockTrack).toHaveBeenCalledTimes(1)
    })

    it('should perform login with correct payload', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() =>
        useOtpRegistrationForm({ flow: registrationFlow, performRegistration, resetFlow: jest.fn() })
      )

      expect(result.current.submitDisabled).toBeFalsy()

      act(() => {
        result.current.setEmail('ada@lovelace.com')
        result.current.setCode('123456')
      })

      await result.current.onSubmit('code')

      expect(performRegistration).toHaveBeenCalledWith(
        {
          method: 'code',
          traits: {
            email: 'ada@lovelace.com',
          },
          code: '123456',
          csrf_token: 'some token',
        },
        'otp'
      )
    })
  })

  describe('resend', () => {
    it('should do nothing if flow is missing', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() => useOtpRegistrationForm({ performRegistration, resetFlow: jest.fn() }))

      await result.current.onSubmit('resend')

      expect(performRegistration).not.toHaveBeenCalled()
      expect(mockTrack).not.toHaveBeenCalled()
    })

    it('should track button press', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() =>
        useOtpRegistrationForm({
          flow: registrationFlow,
          performRegistration,
          resetFlow: jest.fn(),
        })
      )

      await result.current.onSubmit('resend')

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: 'resend',
          screen: 'mainRegistration',
        })
      )
      expect(mockTrack).toHaveBeenCalledTimes(1)
    })

    it('should perform login with correct payload', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() =>
        useOtpRegistrationForm({ flow: registrationFlow, performRegistration, resetFlow: jest.fn() })
      )

      act(() => {
        result.current.setEmail('ada@lovelace.com')
      })

      await result.current.onSubmit('resend')

      expect(performRegistration).toHaveBeenCalledWith(
        {
          method: 'code',
          traits: {
            email: 'ada@lovelace.com',
          },
          csrf_token: 'some token',
          resend: 'code',
        },
        'otp'
      )
    })
  })
})
