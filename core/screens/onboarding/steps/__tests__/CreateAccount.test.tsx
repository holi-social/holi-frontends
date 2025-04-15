import { MockedProvider } from '@apollo/client/testing'
import {
  doBrowserLogin,
  doLogin,
  getVerificationFlowFromRegistration,
  initRegistrationFlow,
} from '@holi/core/auth/helpers/auth'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { CreateAccount, type CreateAccountProps } from '@holi/core/screens/onboarding/steps/CreateAccount'
import { act, render, screen, userEvent, within } from '@testing-library/react-native'
import { Button } from 'holi-bricks/components/button'
import React from 'react'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ApolloClient } from '@apollo/client'

const mockUseErrorHandling = useErrorHandling as jest.Mock
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const mockUseTracking = useTracking as jest.Mock
jest.mock('@holi/core/tracking/hooks/useTracking', () => jest.fn())

const mockUseRouting = useRouting as jest.Mock
jest.mock('@holi/core/navigation/hooks/useRouting', () => jest.fn())

const mockUseLoginState = useLoginState as jest.Mock
const mockSetLoginStateLoggedIn = setLoginStateLoggedIn as jest.Mock
jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
  setLoginStateLoggedIn: jest.fn(),
}))

const mockInitRegistrationFlow = initRegistrationFlow as jest.Mock
const mockGetVerificationFlowFromRegistration = getVerificationFlowFromRegistration as jest.Mock
const mockDoBrowserLogin = doBrowserLogin as jest.Mock
const mockDoLogin = doLogin as jest.Mock
jest.mock('@holi/core/auth/helpers/auth', () => ({
  initRegistrationFlow: jest.fn(),
  getVerificationFlowFromRegistration: jest.fn(),
  doBrowserLogin: jest.fn(),
  doLogin: jest.fn(),
}))

const mockSetVerificationFlowData = setVerificationFlowData as unknown as jest.Mock
jest.mock('@holi/core/auth/helpers/useVerificationFlowData', () => ({
  setVerificationFlowData: jest.fn(),
}))

const mockNewKratosSdk = newKratosSdk as jest.Mock
jest.mock('@holi/core/auth/helpers/sdk', () => ({
  newKratosSdk: jest.fn(),
}))

const mockStoreGuestMode = storeGuestMode as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/guestModeStorage', () => ({
  clearGuestMode: jest.fn(),
  storeGuestMode: jest.fn(),
}))

const formValues = { method: 'password', password: 'p455w0rd' }

const RegistrationForm = ({ onSubmit }: { onSubmit: (payload: object) => Promise<void> }) => {
  return <Button onPress={() => onSubmit(formValues)} label={'submit-button'} />
}

jest.mock('@holi/core/auth/components/FormBuilder', () => RegistrationForm)

describe('CreateAccount', () => {
  const registrationFlow = { id: 'test' }
  const displayError = jest.fn()
  const track = jest.fn()
  const navigate = jest.fn()
  const updateRegistrationFlow = jest.fn()
  const verificationFlowData = { id: 'test' }
  const registrationResponse = { session: { id: 'test' }, session_token: 'some_token' }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseLoginState.mockReturnValue({ isLoggedOut: true })
    mockInitRegistrationFlow.mockResolvedValue({ data: registrationFlow })
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseTracking.mockReturnValue({ track })
    mockUseRouting.mockReturnValue({ navigate })
    mockNewKratosSdk.mockReturnValue({ updateRegistrationFlow })
    updateRegistrationFlow.mockResolvedValue({ data: registrationResponse })
    mockGetVerificationFlowFromRegistration.mockReturnValue(verificationFlowData)
    mockSetLoginStateLoggedIn.mockResolvedValue({})
    mockDoBrowserLogin.mockResolvedValue({})
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  const renderScreen = async ({ onRegister, onContinueAsGuest, onLogin }: Partial<CreateAccountProps> = {}) => {
    render(
      <MockedProvider>
        <CreateAccount
          onRegister={onRegister ?? jest.fn()}
          onContinueAsGuest={onContinueAsGuest ?? jest.fn()}
          onLogin={onLogin ?? jest.fn()}
        />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })
  }

  const submitForm = async ({ onRegister }: Partial<CreateAccountProps> = {}) => {
    const user = userEvent.setup()

    await renderScreen({ onRegister })

    await user.press(screen.getByLabelText('submit-button'))
  }

  describe('flow initialization', () => {
    it('should initialize registration flow', async () => {
      await renderScreen()

      expect(mockInitRegistrationFlow).toHaveBeenCalled()
    })

    it('should display error if initializing registration flow fails', async () => {
      mockInitRegistrationFlow.mockRejectedValue('test')

      await renderScreen()

      expect(displayError).toHaveBeenCalledWith('test', 'Failed to initialize registration flow', {
        displayMessage: 'auth.registration.error.initialization',
        location: 'CreateAccount.initRegistrationFlow',
      })
    })

    it('should render text and form after initializing flow', async () => {
      await renderScreen()

      expect(screen.getByText('registration.signUp.heading')).toBeOnTheScreen()
      expect(screen.getByText('registration.signUp.description')).toBeOnTheScreen()

      expect(screen.getByLabelText('submit-button')).toBeOnTheScreen()

      expect(screen.getByLabelText('auth.loginProtection.continueAsGuest')).toBeOnTheScreen()

      // Links to privacy policy, terms of use + login
      expect(screen.getAllByRole('link')).toHaveLength(3)
    })
  })

  describe('account creation', () => {
    it('should submit the form', async () => {
      await submitForm()

      expect(updateRegistrationFlow).toHaveBeenCalledWith({
        flow: registrationFlow.id,
        updateRegistrationFlowBody: formValues,
      })
    })

    it('should track registration', async () => {
      await submitForm()

      expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.RegisterButtonPressed)
    })

    it('should clear guest mode', async () => {
      await submitForm()

      expect(mockDoLogin).toHaveBeenCalled()
    })

    it('should handle misconfiguration', async () => {
      updateRegistrationFlow.mockResolvedValue({ data: {} })

      await submitForm()

      expect(displayError).toHaveBeenCalledWith(expect.any(Error), 'Failed to submit form', {
        displayMessage: 'auth.registration.error.registration',
        location: 'CreateAccount.onSubmit',
      })
    })

    it('should display error when updating the registration flow fails', async () => {
      updateRegistrationFlow.mockRejectedValue('test')

      await submitForm()

      expect(displayError).toHaveBeenCalledWith('test', 'Failed to submit form', {
        displayMessage: 'auth.registration.error.registration',
        location: 'CreateAccount.onSubmit',
      })
    })

    it('should follow a redirect, when Ory sends a request', async () => {
      updateRegistrationFlow.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            error: { id: 'browser_location_change_required' },
            redirect_browser_to: 'someUrl',
          },
        },
      })

      await submitForm()

      expect(mockDoBrowserLogin).toHaveBeenCalledWith('someUrl', registrationFlow)
    })

    it('should display error when a browser login fails', async () => {
      updateRegistrationFlow.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            error: { id: 'browser_location_change_required' },
            redirect_browser_to: 'someUrl',
          },
        },
      })
      mockDoBrowserLogin.mockRejectedValue('test')

      await submitForm()

      expect(mockDoBrowserLogin).toHaveBeenCalledWith('someUrl', registrationFlow)
      expect(displayError).toHaveBeenCalledWith('test', 'Failed to login user', {
        displayMessage: 'auth.login.error.login',
        location: 'CreateAccount.doBrowserLogin',
      })
    })

    it('should set verification flow data', async () => {
      await submitForm()

      expect(mockSetVerificationFlowData).toHaveBeenCalledWith(verificationFlowData)
    })

    it('should set the login state', async () => {
      await submitForm()

      expect(mockDoLogin).toHaveBeenCalledWith(expect.any(ApolloClient), registrationResponse)
    })

    it('should call onRegister callback', async () => {
      const onRegister = jest.fn()

      await submitForm({ onRegister })

      expect(onRegister).toHaveBeenCalled()
    })
  })

  describe('continuing as guest', () => {
    const continueAsGuest = async ({ onContinueAsGuest }: Partial<CreateAccountProps> = {}) => {
      const user = userEvent.setup()

      await renderScreen({ onContinueAsGuest })

      await user.press(screen.getByLabelText('auth.loginProtection.continueAsGuest'))
    }

    it('should track request to continue as guest', async () => {
      await continueAsGuest()

      expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.ContinueAsGuestButtonPressed)
    })

    it('should store guest mode', async () => {
      await continueAsGuest()

      expect(mockStoreGuestMode).toHaveBeenCalledWith(true)
    })

    it('should call onContinueAsGuest callback', async () => {
      const onContinueAsGuest = jest.fn()

      await continueAsGuest({ onContinueAsGuest })

      expect(onContinueAsGuest).toHaveBeenCalled()
    })
  })

  describe('login with existing account', () => {
    const login = async ({ onLogin }: Partial<CreateAccountProps> = {}) => {
      const user = userEvent.setup()

      await renderScreen({ onLogin })

      await user.press(within(screen.getByTestId('already-have-account-text')).getByRole('link'))
    }

    it('should track request to login', async () => {
      await login()

      expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.LoginButtonPressed)
    })

    it('should call onLogin callback', async () => {
      const onLogin = jest.fn()

      await login({ onLogin })

      expect(onLogin).toHaveBeenCalled()
    })
  })
})
