import { renderHook } from '@testing-library/react-native'
import { useFinalizeLogin } from '@holi/core/screens/auth/form/hooks/useFinalizeLogin'
import { useApolloClient } from '@apollo/client/react'
import { doLogin } from '@holi/core/auth/helpers/auth'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
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
const mockStoreOnboardingState = jest.mocked(storeOnboardingState)
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  storeOnboardingState: jest.fn(),
}))

const sessionData: OrySessionContext = {
  session: {
    id: '123',
  },
}

describe('useFinalizeLogin', () => {
  beforeEach(() => {
    mockUseRedirect.mockReturnValue(jest.fn())
  })

  it('should perform login with session data', async () => {
    const mockClient = {} as ApolloClient
    mockUseApolloClient.mockReturnValue(mockClient)

    const { result } = renderHook(() => useFinalizeLogin())

    await result.current(sessionData, 'otp')

    expect(mockDoLogin).toHaveBeenCalledWith(mockClient, sessionData)
  })

  const methods = ['otp', 'password', 'apple', 'google'] as TrackingEvent.AuthMethod[]
  it.each(methods)('should track login with %s', async (method: TrackingEvent.AuthMethod) => {
    const { result } = renderHook(() => useFinalizeLogin())

    await result.current(sessionData, method)

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.Auth.LoginCompleted({
        method,
      })
    )
  })

  it('should finish onboarding', async () => {
    const { result } = renderHook(() => useFinalizeLogin())

    await result.current(sessionData, 'otp')

    expect(mockStoreOnboardingState).toHaveBeenCalledWith('finished')
  })

  it('should redirect', async () => {
    const mockRedirect = jest.fn()
    mockUseRedirect.mockReturnValue(mockRedirect)
    const { result } = renderHook(() => useFinalizeLogin())

    await result.current(sessionData, 'otp')

    expect(mockRedirect).toHaveBeenCalledWith(true)
  })
})
