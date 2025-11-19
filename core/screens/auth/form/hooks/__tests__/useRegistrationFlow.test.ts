import { renderHook, waitFor } from '@testing-library/react-native'
import type { AxiosResponse } from 'axios'
import {
  useRegistrationFlow,
  type UseRegistrationFlowProps,
} from '@holi/core/screens/auth/form/hooks/useRegistrationFlow'
import {
  doBrowserLogin,
  getRegistrationFlow,
  initRegistrationFlow,
  submitRegistrationFlow,
} from '@holi/core/auth/helpers/auth'
import { useFinalizeRegistration } from '@holi/core/screens/auth/form/hooks/useFinalizeRegistration'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  type HandleFlowErrorProps,
  useFlowErrorHandling,
} from '@holi/core/screens/auth/form/hooks/useFlowErrorHandling'
import { createFlowWithMessage, registrationFlow } from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { OryErrorCode } from '@holi/core/auth/helpers/auth/errorCodes'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { act } from 'react'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'

const mockDoBrowserLogin = jest.mocked(doBrowserLogin)
const mockGetRegistrationFlow = jest.mocked(getRegistrationFlow)
const mockInitRegistrationFlow = jest.mocked(initRegistrationFlow)
const mockSubmitRegistrationFlow = jest.mocked(submitRegistrationFlow)
jest.mock('@holi/core/auth/helpers/auth', () => {
  const original = jest.requireActual('@holi/core/auth/helpers/auth')
  return {
    ...original,
    doBrowserLogin: jest.fn(),
    getRegistrationFlow: jest.fn(),
    initRegistrationFlow: jest.fn(),
    submitRegistrationFlow: jest.fn(),
  }
})

const mockUseFinalizeRegistration = jest.mocked(useFinalizeRegistration)
jest.mock('@holi/core/screens/auth/form/hooks/useFinalizeRegistration', () => ({
  useFinalizeRegistration: jest.fn(),
}))

const mockUseRouting = jest.mocked(useRouting)
jest.mock('@holi/core/navigation/hooks/useRouting', () => jest.fn())

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const mockUseFlowErrorHandling = jest.mocked(useFlowErrorHandling)
jest.mock('@holi/core/screens/auth/form/hooks/useFlowErrorHandling', () => {
  const original = jest.requireActual('@holi/core/screens/auth/form/hooks/useFlowErrorHandling')
  return {
    ...original,
    useFlowErrorHandling: jest.fn(),
  }
})

const mockStoreOnboardingState = jest.mocked(storeOnboardingState)
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  storeOnboardingState: jest.fn(),
}))

const mockSetVerificationFlowData = jest.mocked(setVerificationFlowData)
jest.mock('@holi/core/auth/helpers/useVerificationFlowData', () => ({
  setVerificationFlowData: jest.fn(),
}))

jest.useFakeTimers()

describe('useRegistrationFlow', () => {
  beforeEach(() => {
    mockUseRouting.mockReturnValue({
      navigate: jest.fn(),
      navigateBack: jest.fn(),
      replaceRoute: jest.fn(),
      replaceHistory: jest.fn(),
      setParams: jest.fn(),
    })
    mockInitRegistrationFlow.mockResolvedValue(registrationFlow)
    mockGetRegistrationFlow.mockResolvedValue(registrationFlow)
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
    mockUseFlowErrorHandling.mockReturnValue({
      handleFlowSubmitError: jest.fn(),
    })
  })

  describe('static props', () => {
    it('should use correct label for password button', async () => {
      const { result } = renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      expect(result.current.usePasswordLabel).toEqual('auth.CTA.registration.emailPassword')
    })
  })

  describe('new flow', () => {
    it('should initialize new flow', async () => {
      const { result } = renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      expect(result.current.flow).toBeUndefined()

      expect(mockInitRegistrationFlow).toHaveBeenCalled()

      await waitFor(() => expect(result.current.flow).toEqual(registrationFlow))
    })

    it('should call onFlowUpdate callback after initialization', async () => {
      const onFlowUpdate = jest.fn()
      renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate }))

      await waitFor(() => expect(onFlowUpdate).toHaveBeenCalledWith(registrationFlow))
    })

    it('should display error when initializing the flow failed', async () => {
      const error = new Error('Test')
      const displayError = jest.fn()
      mockUseErrorHandling.mockReturnValue({ displayError })
      mockInitRegistrationFlow.mockRejectedValue(error)

      const { result } = renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toBeUndefined()
      expect(displayError).toHaveBeenCalledWith(error, 'Failed to initialize registration flow', {
        displayMessage: 'auth.login.error.initialization',
        location: 'useRegistrationFlow.initializeFlow',
      })
    })

    it('should not initialize the flow if initialization was successful already', async () => {
      const initialProps: UseRegistrationFlowProps = { resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }
      const { result, rerender } = renderHook((props: typeof initialProps) => useRegistrationFlow(props), {
        initialProps,
      })

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(registrationFlow)

      mockInitRegistrationFlow.mockClear()
      mockGetRegistrationFlow.mockClear()

      rerender({ ...initialProps, startedFlowId: '123' })

      expect(mockInitRegistrationFlow).not.toHaveBeenCalled()
      expect(mockGetRegistrationFlow).not.toHaveBeenCalled()
    })

    it('should create new flow on reset', async () => {
      const initialFlow = {
        ...registrationFlow,
        id: 'first flow id',
      }
      mockInitRegistrationFlow.mockResolvedValueOnce(initialFlow)
      const { result } = renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(initialFlow)

      await act(() => result.current.resetFlow())

      expect(result.current.flow).toEqual(registrationFlow)
    })
  })

  describe('existing flow', () => {
    it('should get existing flow by id', async () => {
      const { result } = renderHook(() =>
        useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn(), startedFlowId: '123' })
      )

      expect(result.current.flow).toBeUndefined()

      expect(mockGetRegistrationFlow).toHaveBeenCalled()

      await waitFor(() => expect(result.current.flow).toEqual(registrationFlow))
    })

    it('should initialize new flow and reset flow id on duplicated account error', async () => {
      mockGetRegistrationFlow.mockResolvedValue(
        createFlowWithMessage(registrationFlow, {
          id: OryErrorCode.DUPLICATED_ACCOUNT_IDENTIFIER,
          type: 'error',
          text: 'Duplicated account',
        })
      )
      const displayError = jest.fn()
      mockUseErrorHandling.mockReturnValue({ displayError })
      const resetFlowId = jest.fn()

      const { result } = renderHook(() =>
        useRegistrationFlow({ resetFlowId, onFlowUpdate: jest.fn(), startedFlowId: '123' })
      )

      await waitFor(() => jest.runAllTimersAsync())

      expect(displayError).toHaveBeenCalledWith(
        new Error('Email already used'),
        'Failed to initialize registration flow',
        {
          displayMessage: 'auth.login.message.1010016',
          location: 'useRegistrationFlow.getRegistrationFlow',
        }
      )
      expect(mockInitRegistrationFlow).toHaveBeenCalled()
      expect(resetFlowId).toHaveBeenCalled()

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(registrationFlow)
    })

    it('should reset flow id and display error if fetching existing flow failed', async () => {
      const error = new Error('Test')
      const displayError = jest.fn()
      mockUseErrorHandling.mockReturnValue({ displayError })
      mockGetRegistrationFlow.mockRejectedValue(error)
      const resetFlowId = jest.fn()

      const { result } = renderHook(() =>
        useRegistrationFlow({ resetFlowId, onFlowUpdate: jest.fn(), startedFlowId: '123' })
      )

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toBeUndefined()
      expect(resetFlowId).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(error, 'Failed to initialize registration flow', {
        displayMessage: 'auth.login.error.initialization',
        location: 'useRegistrationFlow.initializeFlow',
      })
    })

    it('should call onFlowUpdate callback after fetching the flow', async () => {
      const onFlowUpdate = jest.fn()
      renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate, startedFlowId: '123' }))

      await waitFor(() => expect(onFlowUpdate).toHaveBeenCalledWith(registrationFlow))
    })

    it('should not initialize the flow if initialization was successful already', async () => {
      const initialProps: UseRegistrationFlowProps = {
        resetFlowId: jest.fn(),
        onFlowUpdate: jest.fn(),
        startedFlowId: '123',
      }
      const { result, rerender } = renderHook((props: typeof initialProps) => useRegistrationFlow(props), {
        initialProps,
      })

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(registrationFlow)

      mockInitRegistrationFlow.mockClear()
      mockGetRegistrationFlow.mockClear()

      rerender({ ...initialProps, startedFlowId: undefined })

      expect(mockInitRegistrationFlow).not.toHaveBeenCalled()
      expect(mockGetRegistrationFlow).not.toHaveBeenCalled()
    })
  })

  describe('performRegistration', () => {
    const submitPayload: UpdateRegistrationFlowBody = {
      method: 'password',
      traits: {
        email: '',
      },
      password: '',
    }
    const sessionData: OrySessionContext = {
      session: {
        id: '123',
      },
      session_token: 'some token',
    }

    it('should do nothing if the flow is missing', async () => {
      const { result } = renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      await act(() => result.current.performRegistration(submitPayload))

      expect(mockSubmitRegistrationFlow).not.toHaveBeenCalled()
    })

    it('should submit the flow with the correct payload', async () => {
      const payload: UpdateRegistrationFlowBody = {
        method: 'oidc',
        provider: 'google_123',
      }
      const { result } = renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      // Await flow initialization
      await act(() => jest.runAllTimersAsync())

      await act(() => result.current.performRegistration(payload, 'Google'))

      expect(mockSubmitRegistrationFlow).toHaveBeenCalledWith(registrationFlow, payload, 'Google')
    })

    it('should set verification flow data if submitting the flow was successful', async () => {
      mockSubmitRegistrationFlow.mockResolvedValue({ data: sessionData } as AxiosResponse)
      const { result } = renderHook(() => useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      // Await flow initialization
      await act(() => jest.runAllTimersAsync())

      await act(() => result.current.performRegistration(submitPayload))

      expect(mockSetVerificationFlowData).toHaveBeenCalledWith('verification-disabled')
    })

    it('should finalize the registration if submitting the flow was successful', async () => {
      const finalizeRegistration = jest.fn()
      const onRegister = jest.fn()
      mockUseFinalizeRegistration.mockReturnValue(finalizeRegistration)
      mockSubmitRegistrationFlow.mockResolvedValue({ data: sessionData } as AxiosResponse)
      const { result } = renderHook(() =>
        useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn(), onRegister })
      )

      // Await flow initialization
      await act(() => jest.runAllTimersAsync())

      await act(() => result.current.performRegistration(submitPayload))

      expect(mockUseFinalizeRegistration).toHaveBeenCalledWith(onRegister)
      expect(finalizeRegistration).toHaveBeenCalledWith(sessionData)
    })

    describe('error handling', () => {
      const error = new Error('Test')
      const handleFlowSubmitError = jest.fn()

      beforeEach(() => {
        mockSubmitRegistrationFlow.mockRejectedValue(error)
        handleFlowSubmitError.mockReturnValue(undefined)
        mockUseFlowErrorHandling.mockReturnValue({ handleFlowSubmitError })
      })

      const simulateFlowErrorHandling = async (options: Partial<UseRegistrationFlowProps> = {}) => {
        const { result } = renderHook(() =>
          useRegistrationFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn(), ...options })
        )

        // Await flow initialization
        await act(() => jest.runAllTimersAsync())

        await act(async () => {
          await result.current.performRegistration(submitPayload)
        })

        const callbacks = handleFlowSubmitError.mock.calls[0][1] as HandleFlowErrorProps<RegistrationFlow>

        return { result, callbacks }
      }

      it('should handle error during submit', async () => {
        await simulateFlowErrorHandling()

        expect(handleFlowSubmitError).toHaveBeenCalledWith(error, expect.any(Object))
      })

      it('should handle flow reset during error handling', async () => {
        const { callbacks } = await simulateFlowErrorHandling()

        mockInitRegistrationFlow.mockClear()

        await act(async () => {
          callbacks.resetFlow()
          await jest.runAllTimersAsync()
        })

        expect(mockInitRegistrationFlow).toHaveBeenCalled()
      })

      it('should handle browser registration during error handling', async () => {
        mockDoBrowserLogin.mockResolvedValue(sessionData)
        const finalizeRegistration = jest.fn()
        mockUseFinalizeRegistration.mockReturnValue(finalizeRegistration)

        const { callbacks } = await simulateFlowErrorHandling()

        await callbacks.handleBrowserLogin('some url')

        expect(doBrowserLogin).toHaveBeenCalledWith('some url', registrationFlow)
        expect(finalizeRegistration).toHaveBeenCalledWith(sessionData)
      })

      it('should handle email verification during error handling', async () => {
        const { callbacks } = await simulateFlowErrorHandling()

        callbacks.handleEmailVerification()

        expect(mockSetVerificationFlowData).toHaveBeenCalledWith(submitPayload)
        expect(mockStoreOnboardingState).toHaveBeenCalledWith('emailVerification')
      })

      it('should update flow during error handling', async () => {
        const updatedFlow = {
          ...registrationFlow,
          id: 'new id',
        }
        const onFlowUpdate = jest.fn()

        const { result, callbacks } = await simulateFlowErrorHandling({ onFlowUpdate })

        onFlowUpdate.mockClear()

        act(() => callbacks.updateFlow(updatedFlow))

        expect(result.current.flow).toEqual(updatedFlow)
        expect(onFlowUpdate).toHaveBeenCalledWith(updatedFlow)
      })
    })
  })
})
