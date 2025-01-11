import { renderHook, waitFor } from '@testing-library/react-native'

import {
  type OnboardingStateValue,
  cleanUpStoredOnboardingState,
  clearOnboardingState,
  onboardingStateVar,
  storeOnboardingState,
  useOnboardingInitialization,
  useOnboardingRedirect,
  useOnboardingState,
} from '@holi/core/screens/onboarding/hooks/onboardingState'
import { MockedProvider } from '@apollo/client/testing'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
const mockUseVerificationFlowData = jest.fn()
jest.mock('@holi/core/auth/helpers/useVerificationFlowData', () => ({
  useVerificationFlowData: () => mockUseVerificationFlowData(),
}))
const mockDeleteStorage = AsyncStorage.removeItem as jest.Mock
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }
})
const renderOnboardingInitialization = () =>
  renderHook(() => useOnboardingInitialization(), { wrapper: MockedProvider })

describe('cleanUpStoredOnboardingState', () => {
  it('should remove state from storage', async () => {
    await cleanUpStoredOnboardingState()

    expect(mockDeleteStorage).toHaveBeenCalledWith('onboarding_state_value')
    expect(mockDeleteStorage).toHaveBeenCalledWith('first_visit_content_value')
  })
})

describe('useOnboardingState', () => {
  it('should update onboarding state', async () => {
    const { result } = renderHook(() => useOnboardingState())

    storeOnboardingState('accountSetup')

    await waitFor(() => expect(result.current).toEqual('accountSetup'))
  })

  it('should clear onboarding state', async () => {
    const { result } = renderHook(() => useOnboardingState())

    clearOnboardingState()

    await waitFor(() => expect(result.current).toBeNull())
  })
})

describe('useOnboardingInitialization', () => {
  beforeEach(() => {
    clearOnboardingState()
    mockUseVerificationFlowData.mockReturnValue(undefined)
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: false,
    })
  })

  it('should do nothing while logged in user is loading', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: true,
    })

    renderOnboardingInitialization()

    expect(onboardingStateVar()).toBeNull()
  })

  const onboardingStates: (OnboardingStateValue | null)[] = [
    null,
    'onboarding',
    'emailVerification',
    'accountSetup',
    'finished',
  ]
  it.each(onboardingStates)(
    'should force account completion if logged in with incomplete profile and state is %s',
    async (state) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: true,
        user: {},
      })
      if (state) storeOnboardingState(state)

      renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual('accountSetup')
    }
  )

  it.each(onboardingStates)(
    'should force email verification if logged in with verification flow data and state is %s',
    async (state) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: true,
        user: {},
      })
      if (state) storeOnboardingState(state)
      mockUseVerificationFlowData.mockReturnValue({})

      renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual('emailVerification')
    }
  )

  it.each(onboardingStates)(
    'should force email verification if logged out with verification flow data and state is %s',
    async (state) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: false,
      })
      if (state) storeOnboardingState(state)
      mockUseVerificationFlowData.mockReturnValue({})

      renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual('emailVerification')
    }
  )

  const testCasesLoggedIn: { state: OnboardingStateValue | null; expectedState: OnboardingStateValue }[] = [
    {
      state: null,
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
      if (state) storeOnboardingState(state)

      renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual(expectedState)
    }
  )

  const testCasesLoggedOut: { state: OnboardingStateValue | null; expectedState: OnboardingStateValue }[] = [
    {
      state: null,
      expectedState: 'onboarding',
    },
    {
      state: 'onboarding',
      expectedState: 'onboarding',
    },
    {
      state: 'emailVerification',
      expectedState: 'onboarding',
    },
    {
      state: 'accountSetup',
      expectedState: 'onboarding',
    },
    {
      state: 'finished',
      expectedState: 'finished',
    },
  ]
  it.each(testCasesLoggedOut)(
    'should set state to $expectedState for logged out user if state is $state',
    async ({ state, expectedState }) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: false,
      })
      if (state) storeOnboardingState(state)

      renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual(expectedState)
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
