import { act, renderHook, waitFor } from '@testing-library/react-native'

import {
  type OnboardingStateValue,
  clearOnboardingState,
  onboardingStateVar,
  storeOnboardingState,
  useOnboardingInitialization,
  useOnboardingRedirect,
  useOnboardingState,
} from '@holi/core/screens/onboarding/hooks/onboardingState'
import { MockedProvider } from '@apollo/client/testing'
import { useGuestMode } from '@holi/core/screens/onboarding/hooks/useGuestMode'

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
const renderOnboardingInitialization = () =>
  renderHook(() => useOnboardingInitialization(), { wrapper: MockedProvider })

const mockUseGuestMode = jest.mocked(useGuestMode)
jest.mock('@holi/core/screens/onboarding/hooks/useGuestMode', () => ({
  useGuestMode: jest.fn(),
}))

describe('useOnboardingState', () => {
  it('should update onboarding state', async () => {
    const { result } = renderHook(() => useOnboardingState())

    act(() => {
      storeOnboardingState('accountSetup')
    })

    await waitFor(() => expect(result.current).toEqual('accountSetup'))
  })

  it('should clear onboarding state', async () => {
    const { result } = renderHook(() => useOnboardingState())

    act(() => {
      clearOnboardingState()
    })

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
    mockUseGuestMode.mockReturnValue({
      guestMode: false,
      isLoading: false,
    })
  })

  it('should do nothing while logged in user is loading', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: true,
    })

    const { result } = renderOnboardingInitialization()

    expect(onboardingStateVar()).toBeNull()
    expect(result.current.onboardingState).toBeNull()
  })

  it('should do nothing while guest mode is loading', () => {
    mockUseGuestMode.mockReturnValue({
      isLoading: true,
      guestMode: false,
    })

    const { result } = renderOnboardingInitialization()

    expect(onboardingStateVar()).toBeNull()
    expect(result.current.onboardingState).toBeNull()
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

      const { result } = renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual('accountSetup')
      expect(result.current.onboardingState).toEqual('accountSetup')
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

      const { result } = renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual('emailVerification')
      expect(result.current.onboardingState).toEqual('emailVerification')
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

      const { result } = renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual('emailVerification')
      expect(result.current.onboardingState).toEqual('emailVerification')
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

      const { result } = renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual(expectedState)
      expect(result.current.onboardingState).toEqual(expectedState)
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

      const { result } = renderOnboardingInitialization()

      expect(onboardingStateVar()).toEqual(expectedState)
      expect(result.current.onboardingState).toEqual(expectedState)
    }
  )

  it('should return isLoading as true if login state is loading', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: true,
    })

    const { result } = renderOnboardingInitialization()

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should return isLoading as true if guest mode is loading', () => {
    mockUseGuestMode.mockReturnValue({
      isLoading: true,
      guestMode: false,
    })

    const { result } = renderOnboardingInitialization()

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should return isLoading as false if everything is initialized', () => {
    const { result } = renderOnboardingInitialization()

    expect(result.current.isLoading).toBeFalsy()
  })

  describe('in guest mode', () => {
    beforeEach(() => {
      mockUseGuestMode.mockReturnValue({
        guestMode: true,
        isLoading: false,
      })
    })

    it.each(onboardingStates)(
      'should ignore guest mode and force account completion if logged in with incomplete profile and state is %s',
      async (state) => {
        mockUseLoggedInUser.mockReturnValue({
          isLoggedIn: true,
          user: {},
        })
        if (state) storeOnboardingState(state)

        const { result } = renderOnboardingInitialization()

        expect(onboardingStateVar()).toEqual('accountSetup')
        expect(result.current.onboardingState).toEqual('accountSetup')
      }
    )

    it.each(onboardingStates)(
      'should ignore guest mode and force email verification if logged in with verification flow data and state is %s',
      async (state) => {
        mockUseLoggedInUser.mockReturnValue({
          isLoggedIn: true,
          user: {},
        })
        if (state) storeOnboardingState(state)
        mockUseVerificationFlowData.mockReturnValue({})

        const { result } = renderOnboardingInitialization()

        expect(onboardingStateVar()).toEqual('emailVerification')
        expect(result.current.onboardingState).toEqual('emailVerification')
      }
    )

    it.each(onboardingStates)(
      'should ignore guest mode and force email verification if logged out with verification flow data and state is %s',
      async (state) => {
        mockUseLoggedInUser.mockReturnValue({
          isLoggedIn: false,
        })
        if (state) storeOnboardingState(state)
        mockUseVerificationFlowData.mockReturnValue({})

        const { result } = renderOnboardingInitialization()

        expect(onboardingStateVar()).toEqual('emailVerification')
        expect(result.current.onboardingState).toEqual('emailVerification')
      }
    )

    it.each(onboardingStates)(
      'should set state to "finished" for logged out user in guest mode if state is %s',
      async (state) => {
        mockUseLoggedInUser.mockReturnValue({
          isLoggedIn: false,
        })
        if (state) storeOnboardingState(state)

        const { result } = renderOnboardingInitialization()

        expect(onboardingStateVar()).toEqual('finished')
        expect(result.current.onboardingState).toEqual('finished')
      }
    )
  })
})

describe('useOnboardingRedirect', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: false,
    })
    mockUseGuestMode.mockReturnValue({
      isLoading: false,
      guestMode: false,
    })
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
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

  it.each(testCasesRedirects)('should require onboarding on startup for state $state', ({ state }) => {
    onboardingStateVar(state)
    mockUsePathname.mockReturnValue('/')

    const { result } = renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(result.current.showOnboardingOnStartup).toBeTruthy()
  })

  it('should not require onboarding on startup for state "finished"', () => {
    onboardingStateVar('finished')
    mockUsePathname.mockReturnValue('/')

    const { result } = renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(result.current.showOnboardingOnStartup).toBeFalsy()
  })

  it('should not navigate if onboarding state is initializing', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: true,
    })
    onboardingStateVar('onboarding')
    mockUsePathname.mockReturnValue('/')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
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

  it('should not redirect to onboarding if user is on TaskCompletionFlow screen', () => {
    onboardingStateVar('accountSetup')
    mockUsePathname.mockReturnValue('/spaces/123/tasks/456/complete')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not redirect to onboarding if user is on TaskCompletionFlow screen with different path format', () => {
    onboardingStateVar('emailVerification')
    mockUsePathname.mockReturnValue('/spaces/my-space/tasks/task-123/complete')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
