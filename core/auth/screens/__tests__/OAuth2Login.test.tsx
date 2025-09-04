import React from 'react'
import { useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { doLogin, hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { act, render, screen, userEvent } from '@testing-library/react-native'
import { Button } from 'holi-bricks/components/button'
import { TrackingEvent } from '@holi/core/tracking'
import { type ApolloClient, useApolloClient } from '@apollo/client'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import type { SuccessfulNativeLogin } from '@ory/kratos-client'
import type { AxiosResponse } from 'axios'
import { confirmOAuth2Login } from '@holi/core/auth/helpers/oauth2'
import { OAuth2Login } from '@holi/core/auth/screens/OAuth2Login'

const mockUseLoginState = jest.mocked(useLoginState)
jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const mockUseApolloClient = jest.mocked(useApolloClient)
jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client')
  return {
    ...actual,
    useApolloClient: jest.fn(),
  }
})

const mockDoLogin = jest.mocked(doLogin)
const mockHasIdentifier = jest.mocked(hasIdentifier)
const mockInitLoginFlow = jest.mocked(initLoginFlow)
const mockSubmitLoginFlow = jest.mocked(submitLoginFlow)
jest.mock('@holi/core/auth/helpers/auth', () => ({
  doLogin: jest.fn(),
  hasIdentifier: jest.fn(),
  initLoginFlow: jest.fn(),
  submitLoginFlow: jest.fn(),
}))

const mockConfirmOAuth2Login = jest.mocked(confirmOAuth2Login)
jest.mock('@holi/core/auth/helpers/oauth2', () => ({
  confirmOAuth2Login: jest.fn(),
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

const mockSetHref = jest.fn()
Object.defineProperty(window, 'location', {
  value: {
    get href() {
      return '/'
    },
    set href(href) {
      mockSetHref(href)
    },
  },
})

jest.useFakeTimers()

describe('OAuth2Login', () => {
  const mockClient: ApolloClient<object> = {} as ApolloClient<object>
  const displayError = jest.fn()
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
    mockUseApolloClient.mockReturnValue(mockClient)
  })

  const submitForm = async () => {
    const user = userEvent.setup()

    render(<OAuth2Login returnTo="/redirect?some=param" />)

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

    it('should render redirecting message', () => {
      render(<OAuth2Login />)

      expect(screen.getByText('oauth2.redirecting')).toBeOnTheScreen()
    })

    it('should not initialize login flow', () => {
      render(<OAuth2Login />)

      expect(mockInitLoginFlow).not.toHaveBeenCalled()
    })

    it('should confirm oauth2 login and redirect', () => {
      render(<OAuth2Login returnTo="/redirect-somewhere" />)

      expect(mockConfirmOAuth2Login).toHaveBeenCalled()
      expect(mockSetHref).toHaveBeenCalledWith('/redirect-somewhere')
    })
  })

  describe('flow initialization', () => {
    it('should initialize login flow', async () => {
      render(<OAuth2Login />)

      expect(mockInitLoginFlow).toHaveBeenCalled()

      await act(() => jest.runOnlyPendingTimersAsync())
    })

    it('should display error if initializing login flow fails', async () => {
      mockInitLoginFlow.mockRejectedValue('Test')

      render(<OAuth2Login />)

      await act(() => jest.runOnlyPendingTimersAsync())

      expect(displayError).toHaveBeenCalledWith('Test', 'Failed to initialize login flow', {
        displayMessage: 'auth.login.error.initialization',
        location: 'OAuth2Login.initializeFlow',
      })
    })

    it('should render login form after initializing flow', async () => {
      render(<OAuth2Login />)

      await act(() => jest.runOnlyPendingTimersAsync())

      expect(screen.getByLabelText('submit-button'))
      expect(screen.getByLabelText('social-submit-button'))
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

      render(<OAuth2Login />)

      await act(() => jest.runOnlyPendingTimersAsync())

      await user.press(screen.getByLabelText('social-submit-button'))

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.SocialLoginButtonPressed({ provider: 'Google', screen: 'oauth2Login' })
      )
    })

    it('should perform login', async () => {
      await submitForm()

      expect(mockDoLogin).toHaveBeenCalledWith(mockClient, mockSession)
      expect(confirmOAuth2Login).toHaveBeenCalled()
      expect(mockSetHref).toHaveBeenCalledWith('/redirect?some=param')
    })

    it('should display error when login fails', async () => {
      mockSubmitLoginFlow.mockRejectedValue('Test')

      await submitForm()

      expect(displayError).toHaveBeenCalledWith('Test', 'Failed to login user', {
        displayMessage: 'auth.login.error.login',
        location: 'OAuth2Login.performLogin',
      })
    })

    it('should treat e-mail verification as error', async () => {
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

      expect(mockSetHref).toHaveBeenCalledWith('/redirect?some=param&error=Account+not+verified+yet')
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

      expect(mockSetHref).toHaveBeenCalledWith('/redirect')
    })
  })

  it('should render and display error', async () => {
    render(<OAuth2Login error="test" />)

    await act(async () => {
      await jest.runOnlyPendingTimersAsync()
    })

    expect(screen.getByText('oauth2.redirect.error')).toBeOnTheScreen()
    expect(displayError).toHaveBeenCalled()
  })
})
