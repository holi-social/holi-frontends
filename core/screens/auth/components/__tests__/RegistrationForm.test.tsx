import { MockedProvider } from '@apollo/client/testing'
import {
  doBrowserLogin,
  doLogin,
  getVerificationFlowFromRegistration,
  initRegistrationFlow,
  submitRegistrationFlow,
} from '@holi/core/auth/helpers/auth'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { act, render, screen, userEvent } from '@testing-library/react-native'
import { Button } from 'holi-bricks/components/button'
import React from 'react'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ApolloClient } from '@apollo/client'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { RegistrationForm, type RegistrationProps } from '@holi/core/screens/auth/components/RegistrationForm'

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
const mockSubmitRegistrationFlow = submitRegistrationFlow as jest.Mock
jest.mock('@holi/core/auth/helpers/auth', () => ({
  initRegistrationFlow: jest.fn(),
  getVerificationFlowFromRegistration: jest.fn(),
  doBrowserLogin: jest.fn(),
  doLogin: jest.fn(),
  submitRegistrationFlow: jest.fn(),
}))

const mockSetVerificationFlowData = setVerificationFlowData as unknown as jest.Mock
jest.mock('@holi/core/auth/helpers/useVerificationFlowData', () => ({
  setVerificationFlowData: jest.fn(),
}))

const formValues = { method: 'password', password: 'p455w0rd' }

const OryRegistrationForm = ({ onSubmit }: { onSubmit: (payload: object, provider?: string) => Promise<void> }) => {
  return (
    <>
      <Button onPress={() => onSubmit(formValues, 'Google')} label={'social-submit-button'} />
      <Button onPress={() => onSubmit(formValues)} label={'submit-button'} />
    </>
  )
}

jest.mock('@holi/core/auth/components/FormBuilder', () => OryRegistrationForm)

describe('RegistrationForm', () => {
  const registrationFlow = { id: 'test' }
  const displayError = jest.fn()
  const track = jest.fn()
  const navigate = jest.fn()
  const verificationFlowData = { id: 'test' }
  const registrationResponse = { session: { id: 'test' }, session_token: 'some_token' }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseLoginState.mockReturnValue({ isLoggedOut: true })
    mockInitRegistrationFlow.mockResolvedValue({ data: registrationFlow })
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseTracking.mockReturnValue({ track })
    mockUseRouting.mockReturnValue({ navigate })
    mockGetVerificationFlowFromRegistration.mockReturnValue(verificationFlowData)
    mockSetLoginStateLoggedIn.mockResolvedValue({})
    mockDoBrowserLogin.mockResolvedValue({})
    mockSubmitRegistrationFlow.mockResolvedValue({ data: registrationResponse })
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  const renderScreen = async ({ onRegister }: Partial<RegistrationProps> = {}) => {
    render(
      <MockedProvider>
        <RegistrationForm onRegister={onRegister ?? jest.fn()} step="oidc" setStep={jest.fn()} />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })
  }

  const submitForm = async ({ onRegister }: Partial<RegistrationProps> = {}) => {
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
        location: 'RegistrationForm.initRegistrationFlow',
      })
    })

    it('should render form after initializing flow', async () => {
      await renderScreen()

      expect(screen.getByLabelText('social-submit-button')).toBeOnTheScreen()
      expect(screen.getByLabelText('submit-button')).toBeOnTheScreen()
    })
  })

  describe('account creation', () => {
    it('should submit the form', async () => {
      await submitForm()

      expect(mockSubmitRegistrationFlow).toHaveBeenCalledWith(registrationFlow, formValues, undefined)
    })

    it('should track registration', async () => {
      await submitForm()

      expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.RegisterButtonPressed)
    })

    it('should track registration with social sign in', async () => {
      const user = userEvent.setup()

      await renderScreen()

      await user.press(screen.getByLabelText('social-submit-button'))

      expect(track).toHaveBeenCalledWith(
        TrackingEvent.Auth.SocialRegisterButtonPressed({ provider: 'Google', screen: 'mainRegistration' })
      )
    })

    it('should clear guest mode', async () => {
      await submitForm()

      expect(mockDoLogin).toHaveBeenCalled()
    })

    it('should display error when updating the registration flow fails', async () => {
      mockSubmitRegistrationFlow.mockRejectedValue('test')

      await submitForm()

      expect(displayError).toHaveBeenCalledWith('test', 'Failed to submit form', {
        displayMessage: 'auth.registration.error.registration',
        location: 'RegistrationForm.handleFormSubmitError',
      })
    })

    it('should follow a redirect, when Ory sends a request', async () => {
      mockSubmitRegistrationFlow.mockRejectedValue({
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
      mockSubmitRegistrationFlow.mockRejectedValue({
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
        location: 'RegistrationForm.doBrowserLogin',
      })
    })

    it('should not display an error when social login is cancelled', async () => {
      mockSubmitRegistrationFlow.mockRejectedValue(new HoliLoginCancelledError('Test'))

      await submitForm()

      expect(displayError).not.toHaveBeenCalled()
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
})
