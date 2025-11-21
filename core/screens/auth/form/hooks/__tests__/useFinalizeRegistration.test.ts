import { renderHook } from '@testing-library/react-native'
import { useFinalizeRegistration } from '@holi/core/screens/auth/form/hooks/useFinalizeRegistration'
import { useApolloClient } from '@apollo/client/react'
import { doLogin } from '@holi/core/auth/helpers/auth'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import type { ApolloClient } from '@apollo/client'
import { TrackingEvent } from '@holi/core/tracking'

const mockUseApolloClient = jest.mocked(useApolloClient)
jest.mock('@apollo/client/react', () => ({
  useApolloClient: jest.fn(),
}))
const mockDoLogin = jest.mocked(doLogin)
jest.mock('@holi/core/auth/helpers/auth', () => ({
  doLogin: jest.fn(),
}))
const mockUseRedirect = jest.mocked(useRedirect)
jest.mock('@holi/core/navigation/hooks/useRedirect', () => ({
  useRedirect: jest.fn(),
}))
const mockTrackMetaSdkSignUp = jest.fn()
jest.mock('@holi/core/tracking/FacebookSdkCrossPlatform', () => ({
  metaSdk: {
    trackSignUp: () => mockTrackMetaSdkSignUp(),
  },
}))

const sessionData: OrySessionContext = {
  session: {
    id: '123',
  },
  session_token: 'some token',
}

describe('useFinalizeRegistration', () => {
  beforeEach(() => {
    mockUseRedirect.mockReturnValue(jest.fn())
  })

  it('should perform login with session data', async () => {
    const mockClient = {} as ApolloClient
    mockUseApolloClient.mockReturnValue(mockClient)

    const { result } = renderHook(() => useFinalizeRegistration())

    await result.current(sessionData, 'otp')

    expect(mockDoLogin).toHaveBeenCalledWith(mockClient, sessionData)
  })

  const methods = ['otp', 'password', 'apple', 'google'] as TrackingEvent.AuthMethod[]
  it.each(methods)('should track registration with %s', async (method: TrackingEvent.AuthMethod) => {
    const { result } = renderHook(() => useFinalizeRegistration())

    await result.current(sessionData, method)

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.Auth.RegistrationCompleted({
        method,
      })
    )
  })

  it('should call onRegister callback', async () => {
    const onRegister = jest.fn()
    const { result } = renderHook(() => useFinalizeRegistration(onRegister))

    await result.current(sessionData, 'otp')

    expect(onRegister).toHaveBeenCalled()
  })
})
