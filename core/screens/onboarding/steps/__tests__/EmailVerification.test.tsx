import { MockedProvider } from '@apollo/client/testing/react'
import { getOrCreateVerificationFlow, hasIdentifier, login, submitVerificationFlow } from '@holi/core/auth/helpers/auth'
import { clearVerificationFlowData, useVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoginState, setLoginStateLoggedIn } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { EmailVerification } from '@holi/core/screens/onboarding/steps/EmailVerification'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { act, render, screen, userEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'

const mockClearVerificationFlowData = clearVerificationFlowData as jest.Mock
const mockUseVerificationFlowData = useVerificationFlowData as jest.Mock
jest.mock('@holi/core/auth/helpers/useVerificationFlowData', () => ({
  clearVerificationFlowData: jest.fn(),
  useVerificationFlowData: jest.fn(),
}))

const mockGetOrCreateVerificationFlow = getOrCreateVerificationFlow as jest.Mock
const mockSubmitVerificationFlow = submitVerificationFlow as jest.Mock
const mockLogin = login as jest.Mock
const mockHasIdentifier = hasIdentifier as unknown as jest.Mock
jest.mock('@holi/core/auth/helpers/auth', () => ({
  getOrCreateVerificationFlow: jest.fn(),
  submitVerificationFlow: jest.fn(),
  login: jest.fn(),
  hasIdentifier: jest.fn(),
}))

const mockUseErrorHandling = useErrorHandling as jest.Mock
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const mockUseLoginState = useLoginState as jest.Mock
const mockSetLoginStateLoggedIn = setLoginStateLoggedIn as jest.Mock
jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
  setLoginStateLoggedIn: jest.fn(),
}))

const mockUseLogout = useLogout as jest.Mock
jest.mock('@holi/core/helpers', () => ({
  useLogout: jest.fn(),
}))

const mockUseTracking = useTracking as jest.Mock
jest.mock('@holi/core/tracking/hooks/useTracking', () => jest.fn())

const mockStoreOnboardingState = storeOnboardingState as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  storeOnboardingState: jest.fn(),
}))

const mockStoreGuestMode = storeGuestMode as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/guestModeStorage', () => ({
  storeGuestMode: jest.fn(),
}))

describe('EmailVerification', () => {
  const verificationFlowData = { identifier: 'test@example.com' }
  const verificationFlow = { id: 'test', state: 'sent_email' }
  const codeLabel = 'registration.emailVerification.inputLabel'
  const displayError = jest.fn()
  const logout = jest.fn()
  const track = jest.fn()
  const accountActivationSuccessResponse = { ui: { messages: [] }, state: 'passed_challenge' }
  const validCode = '123456'

  const inputCode = async (code = validCode, onSuccess = jest.fn()) => {
    const user = userEvent.setup()

    render(
      <MockedProvider>
        <EmailVerification onSuccess={onSuccess} />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    await user.type(screen.getByLabelText('registration.emailVerification.inputLabel'), code)

    return user
  }

  const submitCode = async (code = validCode, onSuccess = jest.fn()) => {
    const user = await inputCode(code, onSuccess)

    await user.press(screen.getByLabelText('registration.emailVerification.activateAccount'))
  }

  const resendEmail = async () => {
    const user = userEvent.setup()

    render(
      <MockedProvider>
        <EmailVerification onSuccess={jest.fn()} />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    await user.press(screen.getByRole('link'))
  }

  const continueAsGuest = async (onDismiss = jest.fn()) => {
    const user = userEvent.setup()

    render(
      <MockedProvider>
        <EmailVerification onSuccess={jest.fn()} onDismiss={onDismiss} />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    await user.press(screen.getByLabelText('auth.loginProtection.continueAsGuest'))
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseVerificationFlowData.mockReturnValue(verificationFlowData)
    mockGetOrCreateVerificationFlow.mockResolvedValue(verificationFlow)
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseLoginState.mockReturnValue({ isLoggedIn: false })
    mockUseLogout.mockReturnValue({ logout })
    mockUseTracking.mockReturnValue({ track })
    mockHasIdentifier.mockReturnValue(true)
    mockSubmitVerificationFlow.mockResolvedValue(accountActivationSuccessResponse)
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('should skip verification if disabled', () => {
    mockUseVerificationFlowData.mockReturnValue('verification-disabled')
    const onSuccess = jest.fn()

    render(
      <MockedProvider>
        <EmailVerification onSuccess={onSuccess} />
      </MockedProvider>
    )

    expect(mockClearVerificationFlowData).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
  })

  describe('loading verification flow', () => {
    it('should show loader if verification flow data is missing', async () => {
      mockUseVerificationFlowData.mockReturnValue(undefined)

      render(
        <MockedProvider>
          <EmailVerification onSuccess={jest.fn()} />
        </MockedProvider>
      )

      expect(screen.getByTestId('loader')).toBeOnTheScreen()
    })

    it('should load verification flow', async () => {
      render(
        <MockedProvider>
          <EmailVerification onSuccess={jest.fn()} />
        </MockedProvider>
      )

      expect(screen.getByTestId('loader')).toBeOnTheScreen()

      expect(getOrCreateVerificationFlow).toHaveBeenCalledWith(verificationFlowData)

      await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeOnTheScreen())
    })

    it('should handle error and call onDismiss if loading verification flow fails', async () => {
      const onDismiss = jest.fn()
      mockGetOrCreateVerificationFlow.mockRejectedValue('test')

      render(
        <MockedProvider>
          <EmailVerification onSuccess={jest.fn()} onDismiss={onDismiss} />
        </MockedProvider>
      )

      await act(async () => {
        await jest.runAllTimersAsync()
      })

      expect(displayError).toHaveBeenCalledWith('test', 'Failed to retrieve email verification flow', {
        location: 'EmailVerification.getOrCreateVerificationFlow',
      })
      expect(onDismiss).toHaveBeenCalled()
    })

    it('should logout user if logged in and loading verification flow fails', async () => {
      mockUseLoginState.mockReturnValue({ isLoggedIn: true })
      mockGetOrCreateVerificationFlow.mockRejectedValue('Test')

      render(
        <MockedProvider>
          <EmailVerification onSuccess={jest.fn()} />
        </MockedProvider>
      )

      await act(async () => {
        await jest.runAllTimersAsync()
      })

      expect(logout).toHaveBeenCalled()
    })

    it('should display form after loading flow', async () => {
      render(
        <MockedProvider>
          <EmailVerification onSuccess={jest.fn()} />
        </MockedProvider>
      )

      await act(async () => {
        await jest.runAllTimersAsync()
      })

      expect(screen.getByText('registration.emailVerification.heading')).toBeOnTheScreen()
      expect(screen.getByText('registration.emailVerification.description')).toBeOnTheScreen()

      expect(screen.getByLabelText(codeLabel)).toBeOnTheScreen()

      // Resend e-mail link
      expect(screen.getByRole('link')).toBeOnTheScreen()

      // Buttons to activated account + continue as guests
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })
  })

  it('should disable submit button if code is too short', async () => {
    await inputCode('123')

    expect(screen.getByLabelText('registration.emailVerification.activateAccount')).toBeDisabled()
  })

  describe('successful verification', () => {
    it('should submit code input', async () => {
      await submitCode()

      expect(mockSubmitVerificationFlow).toHaveBeenCalledWith({ flow: verificationFlow, code: validCode })
    })

    it('should show loader while code is being processed', async () => {
      mockSubmitVerificationFlow.mockResolvedValue(
        new Promise((resolve) => setTimeout(() => resolve(accountActivationSuccessResponse), 100))
      )

      const submitPromise = submitCode()

      expect(screen.getByTestId('loader')).toBeOnTheScreen()

      await submitPromise

      await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeOnTheScreen())
    })

    it('should show success toast', async () => {
      await submitCode()

      expect(mockOpenToast).toHaveBeenCalledWith('registration.emailVerification.message.activated', 'SUCCESS')
    })

    it('should clear verification flow data', async () => {
      await submitCode()

      expect(mockClearVerificationFlowData).toHaveBeenCalled()
    })

    it('should update onboarding state', async () => {
      await submitCode()

      expect(mockStoreOnboardingState).toHaveBeenCalledWith('accountSetup')
    })

    it('should call onSuccess callback', async () => {
      const onSuccess = jest.fn()

      await submitCode(validCode, onSuccess)

      expect(onSuccess).toHaveBeenCalled()
    })

    it('should track account activation', async () => {
      await submitCode()

      expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.ActivateAccountButtonPressed)
    })

    it('should login after successful activation', async () => {
      const session = { foo: 'bar' }
      mockLogin.mockResolvedValue(session)

      await submitCode()

      expect(mockLogin).toHaveBeenCalledWith({ payload: verificationFlowData })
      expect(mockSetLoginStateLoggedIn).toHaveBeenCalledWith(session)
    })

    it('should only update onboarding state if user already is logged in', async () => {
      mockUseLoginState.mockReturnValue({ isLoggedIn: true })

      await submitCode()

      expect(mockLogin).not.toHaveBeenCalled()

      expect(mockStoreOnboardingState).toHaveBeenCalledWith('accountSetup')
    })
  })

  describe('failing verification', () => {
    it('should display error if submitting the code fails', async () => {
      mockSubmitVerificationFlow.mockRejectedValue('test')

      await submitCode()

      expect(displayError).toHaveBeenCalledWith('test', 'Failed to submit email verification flow', {
        location: 'EmailVerification.verifyEmail',
      })
    })

    const testCases = [
      {
        code: 4070001,
        expectedError: 'registration.emailVerification.message.cannotActivate',
      },
      {
        code: 4070003,
        expectedError: 'registration.emailVerification.message.cannotActivate',
      },
      {
        code: 4070005,
        expectedError: 'registration.emailVerification.message.flowExpired',
      },
      {
        code: 4070006,
        expectedError: 'registration.emailVerification.message.invalidCode',
      },
    ]
    it.each(testCases)('should handle error code $code', async ({ code, expectedError }) => {
      mockSubmitVerificationFlow.mockResolvedValue({
        state: 'sent_email',
        ui: { messages: [{ id: code }] },
      })

      await submitCode()

      expect(mockOpenToast).toHaveBeenCalledWith(expectedError, 'ERROR')

      // Expect input field to be cleared
      const inputField = screen.getByLabelText('registration.emailVerification.inputLabel')
      expect(inputField).toHaveProp('value', '')
    })

    it('should display success message if account was already activated', async () => {
      mockSubmitVerificationFlow.mockResolvedValue({
        state: 'sent_email',
        ui: { messages: [{ id: 4070002 }] },
      })

      await submitCode()

      expect(mockOpenToast).toHaveBeenCalledWith('registration.emailVerification.message.alreadyActivated', 'SUCCESS')
    })
  })

  describe('resending email', () => {
    it('should submit flow with identifier from flow data if present', async () => {
      await resendEmail()

      expect(mockSubmitVerificationFlow).toHaveBeenCalledWith({ flow: verificationFlow, email: 'test@example.com' })
    })

    it('should submit flow with verifiable address from flow data if present', async () => {
      mockHasIdentifier.mockReturnValue(false)
      mockUseVerificationFlowData.mockReturnValue({ verifiable_address: 'other@example.com' })

      await resendEmail()

      expect(mockSubmitVerificationFlow).toHaveBeenCalledWith({ flow: verificationFlow, email: 'other@example.com' })
    })

    it('should display success toast if request was successful', async () => {
      await resendEmail()

      expect(mockOpenToast).toHaveBeenCalledWith('registration.emailVerification.message.emailResent', 'SUCCESS')
    })

    it('should display error if request failed', async () => {
      mockSubmitVerificationFlow.mockRejectedValue('test')

      await resendEmail()

      expect(displayError).toHaveBeenCalledWith('test', 'Failed to resend email for verification flow', {
        displayMessage: 'registration.emailVerification.message.emailResent.error',
        location: 'EmailVerification.resendEmail',
      })
    })

    it('should track email request', async () => {
      await resendEmail()

      expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.ResendEmailButtonPressed)
    })
  })

  describe('continuing as guest', () => {
    it('should logout if logged in and continuing as guest', async () => {
      mockUseLoginState.mockReturnValue({ isLoggedIn: true })
      logout.mockResolvedValue({})

      await continueAsGuest()

      expect(logout).toHaveBeenCalled()
    })

    it('should clear verification flow data when continuing as guest', async () => {
      await continueAsGuest()

      expect(mockClearVerificationFlowData).toHaveBeenCalled()
    })

    it('should set guest mode when continuing as guest', async () => {
      await continueAsGuest()

      expect(mockStoreGuestMode).toHaveBeenCalledWith(true)
    })

    it('should call onDismiss callback when continuing as guest', async () => {
      const onDismiss = jest.fn()

      await continueAsGuest(onDismiss)

      expect(onDismiss).toHaveBeenCalled()
    })

    it('should track request to continue as guest', async () => {
      await continueAsGuest()

      expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.ContinueAsGuestButtonPressed)
    })
  })
})

// display loader if verflow data is missing
