import { renderHook, waitFor } from '@testing-library/react-native'
import type { AxiosResponse } from 'axios'
import { useLoginFlow, type UseLoginFlowProps } from '@holi/core/screens/auth/form/hooks/useLoginFlow'
import { doBrowserLogin, getLoginFlow, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { useFinalizeLogin } from '@holi/core/screens/auth/form/hooks/useFinalizeLogin'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  type HandleFlowErrorProps,
  useFlowErrorHandling,
} from '@holi/core/screens/auth/form/hooks/useFlowErrorHandling'
import { createLoginFlowWithMessage, loginFlow } from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { OryErrorCode } from '@holi/core/auth/helpers/auth/errorCodes'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { act } from 'react'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'

const mockDoBrowserLogin = jest.mocked(doBrowserLogin)
const mockGetLoginFlow = jest.mocked(getLoginFlow)
const mockInitLoginFlow = jest.mocked(initLoginFlow)
const mockSubmitLoginFlow = jest.mocked(submitLoginFlow)
jest.mock('@holi/core/auth/helpers/auth', () => ({
  doBrowserLogin: jest.fn(),
  getLoginFlow: jest.fn(),
  initLoginFlow: jest.fn(),
  submitLoginFlow: jest.fn(),
}))

const mockUseFinalizeLogin = jest.mocked(useFinalizeLogin)
jest.mock('@holi/core/screens/auth/form/hooks/useFinalizeLogin', () => ({
  useFinalizeLogin: jest.fn(),
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

describe('useLoginFlow', () => {
  beforeEach(() => {
    mockUseRouting.mockReturnValue({
      navigate: jest.fn(),
      navigateBack: jest.fn(),
      replaceRoute: jest.fn(),
      replaceHistory: jest.fn(),
      setParams: jest.fn(),
    })
    mockInitLoginFlow.mockResolvedValue(loginFlow)
    mockGetLoginFlow.mockResolvedValue(loginFlow)
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
    mockUseFlowErrorHandling.mockReturnValue({
      handleFlowSubmitError: jest.fn(),
    })
  })

  describe('new flow', () => {
    it('should initialize new flow', async () => {
      const { result } = renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      expect(result.current.flow).toBeUndefined()

      expect(mockInitLoginFlow).toHaveBeenCalled()

      await waitFor(() => expect(result.current.flow).toEqual(loginFlow))
    })

    it('should call onFlowUpdate callback after initialization', async () => {
      const onFlowUpdate = jest.fn()
      renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate }))

      await waitFor(() => expect(onFlowUpdate).toHaveBeenCalledWith(loginFlow))
    })

    it('should display error when initializing the flow failed', async () => {
      const error = new Error('Test')
      const displayError = jest.fn()
      mockUseErrorHandling.mockReturnValue({ displayError })
      mockInitLoginFlow.mockRejectedValue(error)

      const { result } = renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toBeUndefined()
      expect(displayError).toHaveBeenCalledWith(error, 'Failed to initialize login flow', {
        displayMessage: 'auth.login.error.initialization',
        location: 'useLoginFlow.initializeFlow',
      })
    })

    it('should not initialize the flow if initialization was successful already', async () => {
      const initialProps: UseLoginFlowProps = { resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }
      const { result, rerender } = renderHook((props: typeof initialProps) => useLoginFlow(props), {
        initialProps,
      })

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(loginFlow)

      mockInitLoginFlow.mockClear()
      mockGetLoginFlow.mockClear()

      rerender({ ...initialProps, startedFlowId: '123' })

      expect(mockInitLoginFlow).not.toHaveBeenCalled()
      expect(mockGetLoginFlow).not.toHaveBeenCalled()
    })

    it('should create new flow on reset', async () => {
      const initialFlow = {
        ...loginFlow,
        id: 'first flow id',
      }
      mockInitLoginFlow.mockResolvedValueOnce(initialFlow)
      const { result } = renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(initialFlow)

      await act(() => result.current.resetFlow())

      expect(result.current.flow).toEqual(loginFlow)
    })
  })

  describe('existing flow', () => {
    it('should get existing flow by id', async () => {
      const { result } = renderHook(() =>
        useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn(), startedFlowId: '123' })
      )

      expect(result.current.flow).toBeUndefined()

      expect(mockGetLoginFlow).toHaveBeenCalled()

      await waitFor(() => expect(result.current.flow).toEqual(loginFlow))
    })

    it('should initialize new flow and reset flow id on duplicated account error', async () => {
      mockGetLoginFlow.mockResolvedValue(
        createLoginFlowWithMessage({
          id: OryErrorCode.DUPLICATED_ACCOUNT_IDENTIFIER,
          type: 'error',
          text: 'Duplicated account',
        })
      )
      const displayError = jest.fn()
      mockUseErrorHandling.mockReturnValue({ displayError })
      const resetFlowId = jest.fn()

      const { result } = renderHook(() => useLoginFlow({ resetFlowId, onFlowUpdate: jest.fn(), startedFlowId: '123' }))

      await waitFor(() => jest.runAllTimersAsync())

      expect(displayError).toHaveBeenCalledWith(new Error('Email already used'), 'Failed to initialize login flow', {
        displayMessage: 'auth.login.message.1010016',
        location: 'useLoginFlow.getLoginFlow',
      })
      expect(mockInitLoginFlow).toHaveBeenCalled()
      expect(resetFlowId).toHaveBeenCalled()

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(loginFlow)
    })

    it('should reset flow id and display error if fetching existing flow failed', async () => {
      const error = new Error('Test')
      const displayError = jest.fn()
      mockUseErrorHandling.mockReturnValue({ displayError })
      mockGetLoginFlow.mockRejectedValue(error)
      const resetFlowId = jest.fn()

      const { result } = renderHook(() => useLoginFlow({ resetFlowId, onFlowUpdate: jest.fn(), startedFlowId: '123' }))

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toBeUndefined()
      expect(resetFlowId).toHaveBeenCalled()
      expect(displayError).toHaveBeenCalledWith(error, 'Failed to initialize login flow', {
        displayMessage: 'auth.login.error.initialization',
        location: 'useLoginFlow.initializeFlow',
      })
    })

    it('should call onFlowUpdate callback after fetching the flow', async () => {
      const onFlowUpdate = jest.fn()
      renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate, startedFlowId: '123' }))

      await waitFor(() => expect(onFlowUpdate).toHaveBeenCalledWith(loginFlow))
    })

    it('should not initialize the flow if initialization was successful already', async () => {
      const initialProps: UseLoginFlowProps = { resetFlowId: jest.fn(), onFlowUpdate: jest.fn(), startedFlowId: '123' }
      const { result, rerender } = renderHook((props: typeof initialProps) => useLoginFlow(props), {
        initialProps,
      })

      await waitFor(() => jest.runAllTimersAsync())

      expect(result.current.flow).toEqual(loginFlow)

      mockInitLoginFlow.mockClear()
      mockGetLoginFlow.mockClear()

      rerender({ ...initialProps, startedFlowId: undefined })

      expect(mockInitLoginFlow).not.toHaveBeenCalled()
      expect(mockGetLoginFlow).not.toHaveBeenCalled()
    })
  })

  describe('performLogin', () => {
    const submitPayload: UpdateLoginFlowBody = {
      method: 'password',
      identifier: '',
      password: '',
    }
    const sessionData: OrySessionContext = {
      session: {
        id: '123',
      },
    }

    it('should do nothing if the flow is missing', async () => {
      const { result } = renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      await act(() => result.current.performLogin(submitPayload))

      expect(mockSubmitLoginFlow).not.toHaveBeenCalled()
    })

    it('should submit the flow with the correct payload', async () => {
      const payload: UpdateLoginFlowBody = {
        method: 'oidc',
        provider: 'google_123',
      }
      const { result } = renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      // Await flow initialization
      await act(() => jest.runAllTimersAsync())

      await act(() => result.current.performLogin(payload, 'Google'))

      expect(mockSubmitLoginFlow).toHaveBeenCalledWith(loginFlow, payload, 'Google', undefined)
    })

    it('should finalize the login if submitting the flow was successful', async () => {
      const finalizeLogin = jest.fn()
      mockUseFinalizeLogin.mockReturnValue(finalizeLogin)
      mockSubmitLoginFlow.mockResolvedValue({ data: sessionData } as AxiosResponse)
      const { result } = renderHook(() => useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn() }))

      // Await flow initialization
      await act(() => jest.runAllTimersAsync())

      await act(() => result.current.performLogin(submitPayload))

      expect(finalizeLogin).toHaveBeenCalledWith(sessionData)
    })

    describe('error handling', () => {
      const error = new Error('Test')
      const handleFlowSubmitError = jest.fn()

      beforeEach(() => {
        mockSubmitLoginFlow.mockRejectedValue(error)
        handleFlowSubmitError.mockReturnValue(undefined)
        mockUseFlowErrorHandling.mockReturnValue({ handleFlowSubmitError })
      })

      const simulateFlowErrorHandling = async (options: Partial<UseLoginFlowProps> = {}) => {
        const { result } = renderHook(() =>
          useLoginFlow({ resetFlowId: jest.fn(), onFlowUpdate: jest.fn(), ...options })
        )

        // Await flow initialization
        await act(() => jest.runAllTimersAsync())

        await act(async () => {
          await result.current.performLogin(submitPayload)
        })

        const callbacks = handleFlowSubmitError.mock.calls[0][1] as HandleFlowErrorProps<LoginFlow>

        return { result, callbacks }
      }

      it('should handle error during submit', async () => {
        await simulateFlowErrorHandling()

        expect(handleFlowSubmitError).toHaveBeenCalledWith(error, expect.any(Object))
      })

      it('should handle flow reset during error handling', async () => {
        const { callbacks } = await simulateFlowErrorHandling()

        mockInitLoginFlow.mockClear()

        await act(async () => {
          callbacks.resetFlow()
          await jest.runAllTimersAsync()
        })

        expect(mockInitLoginFlow).toHaveBeenCalled()
      })

      it('should handle browser login during error handling', async () => {
        mockDoBrowserLogin.mockResolvedValue(sessionData)
        const finalizeLogin = jest.fn()
        mockUseFinalizeLogin.mockReturnValue(finalizeLogin)

        const { callbacks } = await simulateFlowErrorHandling()

        await callbacks.handleBrowserLogin('some url')

        expect(doBrowserLogin).toHaveBeenCalledWith('some url', loginFlow)
        expect(finalizeLogin).toHaveBeenCalledWith(sessionData)
      })

      it('should handle email verification during error handling', async () => {
        const { callbacks } = await simulateFlowErrorHandling()

        callbacks.handleEmailVerification()

        expect(mockSetVerificationFlowData).toHaveBeenCalledWith(submitPayload)
        expect(mockStoreOnboardingState).toHaveBeenCalledWith('emailVerification')
      })

      it('should update flow during error handling', async () => {
        const updatedFlow = {
          ...loginFlow,
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
