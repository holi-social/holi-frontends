import { renderHook, waitFor } from '@testing-library/react-native'

import {
  ONBOARDING_STATE_STORAGE_NAME,
  type OnboardingStateValue,
  clearOnboardingState,
  onboardingStateVar,
  useOnboardingInitialization,
  useOnboardingRedirect,
} from '@holi/core/screens/onboardingV2/hooks/onboardingState'
import { MockedProvider } from '@apollo/client/testing'

jest.useFakeTimers()

const mockUsePathname = jest.fn()
jest.mock('@holi/core/navigation/hooks/usePathname', () => ({
  usePathname: () => mockUsePathname(),
  setPathname: jest.fn(),
}))
const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))
const mockVerificationFlowDataVar = jest.fn()
jest.mock('@holi/core/auth/helpers/useVerificationFlowData', () => ({
  verificationFlowDataVar: () => mockVerificationFlowDataVar(),
}))
const mockUseLoggout = jest.fn()
jest.mock('@holi/core/helpers/useLogout', () => ({
  useLogout: () => ({
    logout: () => mockUseLoggout(),
  }),
}))
const mockGetStorage = jest.fn()
const mockWriteStorage = jest.fn()
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (key: string) => mockGetStorage(key),
  setItem: (key: string, value: string) => mockWriteStorage(key, value),
  removeItem: jest.fn(),
}))

const renderOnboardingInitialization = () =>
  renderHook(() => useOnboardingInitialization(), { wrapper: MockedProvider })

describe('useOnboardingInitialization', () => {
  beforeEach(() => {
    clearOnboardingState()
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: false,
    })
    mockWriteStorage.mockResolvedValue({})
  })

  it('should do nothing while logged in user is loading', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: true,
    })

    renderOnboardingInitialization()

    expect(mockGetStorage).not.toHaveBeenCalled()
    expect(mockWriteStorage).not.toHaveBeenCalled()
  })

  it('should read onboarding state from storage', () => {
    renderOnboardingInitialization()

    expect(mockGetStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME)
  })

  const onboardingStates = [null, 'invalid', 'onboarding', 'accountSetup', 'finished']
  it.each(onboardingStates)(
    'should force account completion if logged in with incomplete profile and state is %s',
    async (state) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: true,
        user: {},
      })
      mockGetStorage.mockResolvedValue(state)

      renderOnboardingInitialization()

      await waitFor(() => expect(onboardingStateVar()).toEqual('accountSetup'))
      if (state === 'accountSetup') {
        expect(mockWriteStorage).not.toHaveBeenCalled()
      } else {
        expect(mockWriteStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME, 'accountSetup')
      }
    }
  )

  it.each(onboardingStates)(
    'should force email verification if logged in with verification flow data and state is not emailVerification',
    async (state) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: true,
        user: {},
      })
      mockGetStorage.mockResolvedValue(state)
      mockVerificationFlowDataVar.mockReturnValue({})

      renderOnboardingInitialization()

      await waitFor(() => expect(onboardingStateVar()).toEqual('emailVerification'))
      expect(mockWriteStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME, 'emailVerification')
    }
  )

  it('should force force logout if logged in without verification flow data and state is emailVerification', async () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: true,
      user: {},
    })
    mockGetStorage.mockResolvedValue('emailVerification')
    mockVerificationFlowDataVar.mockReturnValue(undefined)

    renderOnboardingInitialization()

    await waitFor(() => expect(onboardingStateVar()).toEqual('finished'))
    expect(mockWriteStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME, 'finished')
  })

  const testCasesLoggedIn = [
    {
      state: null,
      expectedState: 'finished',
    },
    {
      state: 'invalid',
      expectedState: 'finished',
    },
    {
      state: 'onboarding',
      expectedState: 'finished',
    },
    {
      state: 'emailVerification',
      expectedState: 'finished',
    },
    {
      state: 'accountSetup',
      expectedState: 'accountSetup',
    },
    {
      state: 'finished',
      expectedState: 'finished',
    },
  ]
  it.each(testCasesLoggedIn)(
    'should set state to $expectedState for logged in user with complete account if state is $state',
    async ({ state, expectedState }) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: true,
        user: {
          firstName: 'Test User',
          identity: 'test-identity',
        },
      })
      mockGetStorage.mockResolvedValue(state)

      renderOnboardingInitialization()

      await waitFor(() => expect(onboardingStateVar()).toEqual(expectedState))
      if (state === expectedState) {
        expect(mockWriteStorage).not.toHaveBeenCalled()
      } else {
        expect(mockWriteStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME, expectedState)
      }
    }
  )

  const testCasesLoggedOut = [
    {
      state: null,
      expectedState: 'onboarding',
    },
    {
      state: 'invalid',
      expectedState: 'onboarding',
    },
    {
      state: 'onboarding',
      expectedState: 'onboarding',
    },
    {
      state: 'emailVerification',
      expectedState: 'finished',
      verificationFlow: undefined,
    },
    {
      state: 'emailVerification',
      expectedState: 'emailVerification',
      verificationFlow: {},
    },
    {
      state: 'accountSetup',
      expectedState: 'accountSetup',
    },
    {
      state: 'finished',
      expectedState: 'finished',
    },
  ]
  it.each(testCasesLoggedOut)(
    'should set state to $expectedState for logged out user if state is $state',
    async ({ state, expectedState, verificationFlow }) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: false,
      })
      mockGetStorage.mockResolvedValue(state)
      if (verificationFlow !== undefined) mockVerificationFlowDataVar.mockReturnValue(verificationFlow)

      renderOnboardingInitialization()

      await waitFor(() => expect(onboardingStateVar()).toEqual(expectedState))
      if (state === expectedState) {
        expect(mockWriteStorage).not.toHaveBeenCalled()
      } else {
        expect(mockWriteStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME, expectedState)
      }
    }
  )
})

describe('useOnboardingRedirect', () => {
  beforeEach(() => {
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: false,
    })
  })

  const testCasesRedirects: { state: OnboardingStateValue; expectedRoute: string }[] = [
    {
      state: 'onboarding',
      expectedRoute: '/onboarding',
    },
    {
      state: 'accountSetup',
      expectedRoute: '/onboarding',
    },
    {
      state: 'emailVerification',
      expectedRoute: '/onboarding',
    },
  ]
  it.each(testCasesRedirects)('should redirect to $expectedRoute if state is $state', ({ state, expectedRoute }) => {
    onboardingStateVar(state)
    mockUsePathname.mockReturnValue('/')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).toHaveBeenCalledWith(expectedRoute)
  })

  it('should not navigate to onboarding if current screen is not home', () => {
    onboardingStateVar('onboarding')
    mockUsePathname.mockReturnValue('/volunteering')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not navigate to onboarding registration if already there', () => {
    onboardingStateVar('emailVerification')
    mockUsePathname.mockReturnValue('/onboarding')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not redirect if state is finished', () => {
    onboardingStateVar('finished')
    mockUsePathname.mockReturnValue('/')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
