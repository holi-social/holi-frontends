import React from 'react'
import { Pressable } from 'react-native'
import { useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { doBrowserLogin, doLogin, hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { act, renderRouter, screen, userEvent, waitFor } from 'expo-router/testing-library'
import Login from '@holi/core/auth/screens/Login'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'react-native'
import { TrackingEvent } from '@holi/core/tracking'
import { Link } from 'expo-router'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { type ApolloClient, useApolloClient } from '@apollo/client'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import type { SuccessfulNativeLogin } from '@ory/kratos-client'
import type { AxiosResponse } from 'axios'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'

jest.mock('@holi/core/navigation/hooks/useParam')

const mockUseLoginState = jest.mocked(useLoginState)
jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const mockUseRedirect = jest.mocked(useRedirect)
jest.mock('@holi/core/navigation/hooks/useRedirect', () => ({
  useRedirect: jest.fn(),
  usePathToRedirect: jest.fn(),
}))

const mockUseApolloClient = jest.mocked(useApolloClient)
jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client')
  return {
    ...actual,
    useApolloClient: jest.fn(),
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

const mockDoBrowserLogin = jest.mocked(doBrowserLogin)
const mockDoLogin = jest.mocked(doLogin)
const mockHasIdentifier = jest.mocked(hasIdentifier)
const mockInitLoginFlow = jest.mocked(initLoginFlow)
const mockSubmitLoginFlow = jest.mocked(submitLoginFlow)
jest.mock('@holi/core/auth/helpers/auth', () => ({
  doBrowserLogin: jest.fn(),
  doLogin: jest.fn(),
  hasIdentifier: jest.fn(),
  initLoginFlow: jest.fn(),
  submitLoginFlow: jest.fn(),
}))

const formValues = { method: 'password', identifier: 'test@example.com', password: 'p455w0rd' }
const LoginForm = ({ onSubmit }: { onSubmit: (payload: object, provider?: string) => Promise<void> }) => {
  return (
    <>
      <Button onPress={() => onSubmit(formValues, 'Google')} label={'social-submit-button'} />
      <Button onPress={() => onSubmit(formValues)} label={'submit-button'} />
    </>
  )
}
jest.mock('@holi/core/auth/components/FormBuilder', () => LoginForm)

jest.useFakeTimers()

describe('Login', () => {
  const mockClient: ApolloClient<object> = {} as ApolloClient<object>
  const displayError = jest.fn()
  const redirect = jest.fn()
  const mockFlow = {
    id: '123',
    expires_at: '',
    issued_at: '',
    request_url: '',
    state: '',
    type: 'api',
    ui: {
      action: '',
      method: '',
      nodes: [],
    },
  }
  const mockSession: OrySessionContext = {
    session_token: 'some_token',
    session: { id: '123' },
  }

  beforeEach(() => {
    mockUseLoginState.mockReturnValue({
      isLoggedIn: false,
      isLoggedOut: true,
      isUnknown: false,
    })
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockInitLoginFlow.mockResolvedValue(mockFlow)
    mockSubmitLoginFlow.mockResolvedValue({
      data: mockSession,
    } as AxiosResponse<SuccessfulNativeLogin>)
    mockHasIdentifier.mockReturnValue(false)
    mockDoBrowserLogin.mockResolvedValue(mockSession)
    mockUseRedirect.mockReturnValue(redirect)
    mockUseApolloClient.mockReturnValue(mockClient)
    mockParameters()
  })

  const submitForm = async () => {
    const user = userEvent.setup()

    renderRouter(
      {
        '/login': () => <Login />,
        '/': () => <Text>home</Text>,
        '/onboarding': () => <Text>onboarding</Text>,
        '/forgotPassword': () => <Text>forgotPassword</Text>,
      },
      { initialUrl: '/login' }
    )

    await act(() => jest.runOnlyPendingTimersAsync())

    await user.press(screen.getByLabelText('submit-button'))
  }

  describe('already logged in', () => {
    beforeEach(() => {
      mockUseLoginState.mockReturnValue({
        isLoggedIn: true,
        isLoggedOut: false,
        isUnknown: false,
        userId: '123',
      })
    })

    it('should not initialize login flow', async () => {
      const user = userEvent.setup()

      const context = renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => (
            <Link href="/login" asChild>
              <Pressable>
                <Text>Go to login</Text>
              </Pressable>
            </Link>
          ),
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/onboarding' }
      )

      // we do this because otherwise the tests fails as
      // inside <Login>, if someone is logged in we try to navigate
      // in the useEffect, but in the env seems to not work as the screen didn't finish rendering
      await user.press(screen.getByText('Go to login'))

      await waitFor(() => {
        expect(context).toHavePathname('/')
      })

      expect(mockInitLoginFlow).not.toHaveBeenCalled()
    })

    it('should navigate to home', async () => {
      const user = userEvent.setup()

      const context = renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => (
            <Link href="/login" asChild>
              <Pressable>
                <Text>Go to login</Text>
              </Pressable>
            </Link>
          ),
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/onboarding' }
      )

      await user.press(screen.getByText('Go to login'))

      await waitFor(() => {
        expect(context).toHavePathname('/')
      })
    })
  })

  describe('flow initialization', () => {
    it('should initialize login flow', async () => {
      renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => <Text>onboarding</Text>,
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/login' }
      )

      await act(() => jest.runOnlyPendingTimersAsync())

      expect(mockInitLoginFlow).toHaveBeenCalled()
    })

    it('should display error if initializing login flow fails', async () => {
      mockInitLoginFlow.mockRejectedValue('Test')

      renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => <Text>onboarding</Text>,
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/login' }
      )

      await act(() => jest.runOnlyPendingTimersAsync())

      expect(displayError).toHaveBeenCalledWith('Test', 'Failed to initialize login flow', {
        displayMessage: 'auth.login.error.initialization',
        location: 'Login.initializeFlow',
      })
    })

    it('should render text and form after initializing flow', async () => {
      renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => <Text>onboarding</Text>,
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/login' }
      )

      await act(() => jest.runOnlyPendingTimersAsync())

      expect(screen.getByLabelText('submit-button'))
      expect(screen.getByText('auth.login.signUp.link.headline'))
    })

    it('should initialize login flow with id if given', async () => {
      mockParameters({ flow: '123' })

      renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => <Text>onboarding</Text>,
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/login' }
      )

      await act(() => jest.runOnlyPendingTimersAsync())

      expect(mockInitLoginFlow).toHaveBeenCalledWith('123')
    })
  })

  describe('login', () => {
    it('should submit the form', async () => {
      await submitForm()

      expect(mockSubmitLoginFlow).toHaveBeenCalledWith(mockFlow, formValues, undefined, undefined)
    })

    it('should track login', async () => {
      await submitForm()

      expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Auth.LoginButtonPressed)
    })

    it('should track social login', async () => {
      const user = userEvent.setup()

      renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => <Text>onboarding</Text>,
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/login' }
      )

      await act(() => jest.runOnlyPendingTimersAsync())

      await user.press(screen.getByLabelText('social-submit-button'))

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.SocialLoginButtonPressed({ provider: 'Google', screen: 'mainLogin' })
      )
    })

    it('should perform login', async () => {
      await submitForm()

      expect(mockDoLogin).toHaveBeenCalledWith(mockClient, mockSession)
    })

    it('should display error when login fails', async () => {
      mockSubmitLoginFlow.mockRejectedValue('Test')

      await submitForm()

      expect(displayError).toHaveBeenCalledWith('Test', 'Failed to login user', {
        displayMessage: 'auth.login.error.login',
        location: 'Login.performLogin',
      })
    })

    it('should handle e-mail verification', async () => {
      mockHasIdentifier.mockReturnValue(true)
      mockSubmitLoginFlow.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            ui: { messages: [{ id: 4000010 }] },
            type: '',
          },
        },
      })

      await submitForm()

      expect(mockSetVerificationFlowData).toHaveBeenCalledWith(formValues)
      expect(mockStoreOnboardingState).toHaveBeenCalledWith('emailVerification')
    })

    it('should follow a redirect, when Ory sends a request', async () => {
      mockSubmitLoginFlow.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            error: { id: 'browser_location_change_required' },
            redirect_browser_to: '/redirect',
          },
        },
      })

      await submitForm()

      expect(mockDoBrowserLogin).toHaveBeenCalledWith('/redirect', mockFlow)
    })

    it('should display error when a browser login fails', async () => {
      mockSubmitLoginFlow.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            error: { id: 'browser_location_change_required' },
            redirect_browser_to: '/redirect',
          },
        },
      })
      mockDoBrowserLogin.mockRejectedValue('Test')

      await submitForm()

      expect(displayError).toHaveBeenCalledWith('Test', 'Failed to login user', {
        displayMessage: 'auth.login.error.login',
        location: 'Login.doBrowserLogin',
      })
    })

    it('should not display an error when social login is cancelled', async () => {
      mockSubmitLoginFlow.mockRejectedValue(new HoliLoginCancelledError('Test'))

      await submitForm()

      expect(displayError).not.toHaveBeenCalled()
    })

    it('should perform login on successful browser login', async () => {
      mockSubmitLoginFlow.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            error: { id: 'browser_location_change_required' },
            redirect_browser_to: '/redirect',
          },
        },
      })

      await submitForm()

      expect(mockDoLogin).toHaveBeenCalledWith(mockClient, mockSession)
      expect(mockStoreOnboardingState).toHaveBeenCalledWith('finished')
      expect(mockUseRedirect).toHaveBeenCalledWith('/')
      expect(redirect).toHaveBeenCalledWith(true)
    })
  })

  describe('registration', () => {
    it('should navigate to registration screen', async () => {
      const user = userEvent.setup()

      const context = renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => <Text>onboarding</Text>,
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/login' }
      )

      await act(() => jest.runOnlyPendingTimersAsync())

      await user.press(screen.getByLabelText('auth.loginProtection.registration'))

      expect(context).toHavePathname('/onboarding')
    })

    it('should track click on registration', async () => {
      const user = userEvent.setup()

      renderRouter(
        {
          '/login': () => <Login />,
          '/': () => <Text>home</Text>,
          '/onboarding': () => <Text>onboarding</Text>,
          '/forgotPassword': () => <Text>forgotPassword</Text>,
        },
        { initialUrl: '/login' }
      )

      await act(() => jest.runOnlyPendingTimersAsync())

      await user.press(screen.getByLabelText('auth.loginProtection.registration'))

      expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Auth.RegisterButtonPressed)
    })
  })
})
