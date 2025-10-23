import { type ApolloClient, useApolloClient } from '@apollo/client'
import { getSessionFromStorage, submitLogoutFlow, submitSocialLogout } from '@holi/core/auth/helpers/auth'
import { setLoginStateLoggedOut } from '@holi/core/auth/loginState'
import { isLoggingOutVar, useLogout } from '@holi/core/helpers/useLogout'
import { clearOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { AccountType } from '@holi/api/graphql/graphql-codegen'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

const mockSetLoginStateLoggedOut = jest.mocked(setLoginStateLoggedOut)
jest.mock('@holi/core/auth/loginState', () => ({
  setLoginStateLoggedOut: jest.fn(),
}))

const mockGetSessionFromStorage = jest.mocked(getSessionFromStorage)
const mockSubmitLogoutFlow = jest.mocked(submitLogoutFlow)
const mockSubmitSocialLogout = jest.mocked(submitSocialLogout)
jest.mock('@holi/core/auth/helpers/auth', () => ({
  getSessionFromStorage: jest.fn(),
  submitLogoutFlow: jest.fn(),
  submitSocialLogout: jest.fn(),
}))

const mockClearOnboardingState = jest.mocked(clearOnboardingState)
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  clearOnboardingState: jest.fn(),
}))

const mockUseApolloClient = jest.mocked(useApolloClient)
jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client')
  return {
    ...actual,
    useApolloClient: jest.fn(),
  }
})

const mockUseLoggedInUser = jest.mocked(useLoggedInUser)
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

const user: AuthenticatedUser = {
  id: 'test-user-id',
  identity: '',
  avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
  avatarBlurhash: '',
  avatarDefaultColor: '#7571EC',
  avatarLabel: 'EV',
  fullName: 'EE. Visited',
  firstName: 'EE.',
  lastName: 'Visited',
  aboutMe: '',
  pronouns: '',
  location: '',
  geolocationId: '',
  engagementLevel: '',
  interestsV2: [],
  skillsV2: [],
  trackingConsentAnalytics: false,
  trackingConsentPersonalization: false,
  trackingConsentAdPartners: false,
  isEmployee: false,
  email: '',
  isOidc: false,
  accountType: AccountType.Email,
  connectionStatusToSpace: [],
}

describe('useLogout', () => {
  const mockSession = {
    session_token: 'some_token',
    session: { id: '123' },
  }
  const mockClient = {
    clearStore: jest.fn(),
  } as unknown as ApolloClient<object>

  beforeEach(() => {
    jest.useFakeTimers()
    mockGetSessionFromStorage.mockResolvedValue(mockSession)
    mockSubmitLogoutFlow.mockResolvedValue(undefined)
    mockUseApolloClient.mockReturnValue(mockClient)
    mockUseLoggedInUser.mockReturnValue({
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user,
      state: 'loggedIn',
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('already logged out', () => {
    beforeEach(() => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: false,
        isLoggedOut: true,
        isLoading: false,
        state: 'loggedOut',
        user: undefined,
      })
    })
    it('should redirect', async () => {
      const { result } = renderHook(useLogout)

      await result.current.logout()
      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })

    it('should not redirect if redirect should be skipped', async () => {
      const { result } = renderHook(useLogout)

      await result.current.logout({ skipRedirect: true })
      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should redirect to given path', async () => {
      const { result } = renderHook(useLogout)

      await result.current.logout({ redirectPath: '/act' })
      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).toHaveBeenCalledWith('/act')
    })
  })

  describe('already logging out', () => {
    beforeEach(async () => {
      isLoggingOutVar(true)
    })

    afterEach(async () => {
      act(() => {
        isLoggingOutVar(false)
      })
    })

    it('should not perform logout', async () => {
      const { result } = renderHook(useLogout)

      await result.current.logout()
      await jest.runOnlyPendingTimersAsync()

      expect(mockGetSessionFromStorage).not.toHaveBeenCalled()
      expect(mockSubmitLogoutFlow).not.toHaveBeenCalled()
      expect(mockClearOnboardingState).not.toHaveBeenCalled()
      expect(mockSetLoginStateLoggedOut).not.toHaveBeenCalled()
      expect(mockClient.clearStore).not.toHaveBeenCalled()
    })

    it('should redirect', async () => {
      const { result } = renderHook(useLogout)

      await result.current.logout()
      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })

    it('should not redirect if redirect should be skipped', async () => {
      const { result } = renderHook(useLogout)

      await result.current.logout({ skipRedirect: true })
      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should redirect to given path', async () => {
      const { result } = renderHook(useLogout)

      await result.current.logout({ redirectPath: '/act' })
      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).toHaveBeenCalledWith('/act')
    })
  })

  describe('successful logout', () => {
    it('should submit logout flow with session', async () => {
      const { result } = renderHook(useLogout)

      await act(async () => {
        await result.current.logout()
        await jest.runOnlyPendingTimersAsync()
      })

      expect(mockGetSessionFromStorage).toHaveBeenCalled()
      expect(mockSubmitLogoutFlow).toHaveBeenCalledWith({ sessionToken: 'some_token' })
      expect(mockSubmitSocialLogout).toHaveBeenCalledWith(AccountType.Email)
    })

    it('should not submit logout flow if it should be skipped', async () => {
      const { result } = renderHook(useLogout)

      await act(async () => {
        await result.current.logout({ skipLogoutFlow: true })
        await jest.runOnlyPendingTimersAsync()
      })

      expect(mockGetSessionFromStorage).not.toHaveBeenCalled()
      expect(mockSubmitLogoutFlow).not.toHaveBeenCalled()
      expect(mockSubmitSocialLogout).toHaveBeenCalledWith(AccountType.Email)
    })

    it('should return flag while logging out', async () => {
      const { result } = renderHook(useLogout)

      await act(async () => {
        const promise = result.current.logout()

        await waitFor(() => expect(isLoggingOutVar()).toBeTruthy())
        expect(result.current.isLoggingOut).toBeTruthy()

        await promise
        await jest.runOnlyPendingTimersAsync()
      })

      expect(result.current.isLoggingOut).toBeFalsy()
      expect(isLoggingOutVar()).toBeFalsy()
    })

    it('should clear onboarding state, logging state and store', async () => {
      const { result } = renderHook(useLogout)

      await act(async () => {
        await result.current.logout()
        await jest.runOnlyPendingTimersAsync()
      })

      expect(mockClearOnboardingState).toHaveBeenCalled()
      expect(mockSetLoginStateLoggedOut).toHaveBeenCalled()
      expect(mockClient.clearStore).toHaveBeenCalled()
    })

    it('should show success toast', async () => {
      const { result } = renderHook(useLogout)

      await act(async () => {
        await result.current.logout()
        await jest.runOnlyPendingTimersAsync()
      })

      expect(mockOpenToast).toHaveBeenCalledWith('auth.logout.success', HoliToastType.SUCCESS, {
        testID: 'logout-success',
      })
    })

    it('should show success toast with custom message', async () => {
      const { result } = renderHook(useLogout)

      await act(async () => {
        await result.current.logout({ message: 'custom message' })
        await jest.runOnlyPendingTimersAsync()
      })

      expect(mockOpenToast).toHaveBeenCalledWith('custom message', HoliToastType.SUCCESS, { testID: 'logout-success' })
    })

    it('should not show success toast if it should be skipped', async () => {
      const { result } = renderHook(useLogout)

      await act(async () => {
        await result.current.logout({ skipToast: true })
        await jest.runOnlyPendingTimersAsync()
      })

      expect(mockOpenToast).not.toHaveBeenCalled()
    })
  })

  describe('failed logout', () => {
    const testError = new Error('Test')
    it('should handle error when retrieving the session from storage', async () => {
      mockGetSessionFromStorage.mockRejectedValue(testError)

      const { result } = renderHook(useLogout)

      await expect(() => act(result.current.logout)).rejects.toThrow(testError)

      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).toHaveBeenCalledWith('/profile')
      expect(mockClearOnboardingState).toHaveBeenCalled()
      expect(mockSetLoginStateLoggedOut).toHaveBeenCalled()
    })

    it('should handle error when submitting the logout flow', async () => {
      mockSubmitLogoutFlow.mockRejectedValue(testError)

      const { result } = renderHook(useLogout)

      await expect(() => act(result.current.logout)).rejects.toThrow(testError)

      await jest.runOnlyPendingTimersAsync()

      expect(mockClearOnboardingState).toHaveBeenCalled()
      expect(mockSetLoginStateLoggedOut).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })

    it('should handle error during clean up', async () => {
      mockSubmitLogoutFlow.mockRejectedValue(testError)
      mockSetLoginStateLoggedOut.mockRejectedValue('Test')

      const { result } = renderHook(useLogout)

      await expect(() => act(result.current.logout)).rejects.toThrow(testError)

      await jest.runOnlyPendingTimersAsync()

      expect(mockOpenToast).toHaveBeenCalledWith('auth.logout.error', HoliToastType.ERROR, { testID: 'logout-failed' })
      expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })

    it('should redirect to given path after error', async () => {
      mockSubmitLogoutFlow.mockRejectedValue(testError)

      const { result } = renderHook(useLogout)

      await expect(() => act(() => result.current.logout({ redirectPath: '/act' }))).rejects.toThrow(testError)

      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).toHaveBeenCalledWith('/act')
    })

    it('should not redirect after error if it should be skipped', async () => {
      mockSubmitLogoutFlow.mockRejectedValue(testError)

      const { result } = renderHook(useLogout)

      await expect(() => act(() => result.current.logout({ skipRedirect: true }))).rejects.toThrow(testError)

      await jest.runOnlyPendingTimersAsync()

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
