import { renderHook, waitFor } from '@testing-library/react-native'

import {
  ONBOARDING_STATE_STORAGE_NAME,
  OnboardingStateValue,
  clearOnboardingState,
  onboardingStateVar,
  useOnboardingInitialization,
  useOnboardingRedirect,
} from '@holi/core/screens/onboarding/hooks/onboardingState'

jest.useFakeTimers()

const mockUsePathname = jest.fn()
jest.mock('@holi/core/navigation/hooks/usePathname', () => ({
  usePathname: () => mockUsePathname(),
  setPathname: jest.fn(),
}))
const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))
const mockGetStorage = jest.fn()
const mockWriteStorage = jest.fn()
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (key: string) => mockGetStorage(key),
  setItem: (key: string, value: string) => mockWriteStorage(key, value),
  removeItem: jest.fn(),
}))

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

    renderHook(() => useOnboardingInitialization())

    expect(mockGetStorage).not.toHaveBeenCalled()
    expect(mockWriteStorage).not.toHaveBeenCalled()
  })

  it('should read onboarding state from storage', () => {
    renderHook(() => useOnboardingInitialization())

    expect(mockGetStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME)
  })

  const onboardingStates = [null, 'invalid', 'onboarding', 'emailVerification', 'accountSetup', 'finished']
  it.each(onboardingStates)(
    'should force account completion if logged in with incomplete profile and state is %s',
    async (state) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: true,
        user: {},
      })
      mockGetStorage.mockResolvedValue(state)

      renderHook(() => useOnboardingInitialization())

      await waitFor(() => expect(onboardingStateVar()).toEqual('accountSetup'))
      if (state === 'accountSetup') {
        expect(mockWriteStorage).not.toHaveBeenCalled()
      } else {
        expect(mockWriteStorage).toHaveBeenCalledWith(ONBOARDING_STATE_STORAGE_NAME, 'accountSetup')
      }
    }
  )

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

      renderHook(() => useOnboardingInitialization())

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
      expectedState: 'emailVerification',
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
    async ({ state, expectedState }) => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedIn: false,
      })
      mockGetStorage.mockResolvedValue(state)

      renderHook(() => useOnboardingInitialization())

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
      expectedRoute: '/onboarding/registration',
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
    mockUsePathname.mockReturnValue('/onboarding/registration')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  const testCasesNoRedirects: OnboardingStateValue[] = ['emailVerification', 'finished']
  it.each(testCasesNoRedirects)('should not redirect if state is %s', (state) => {
    onboardingStateVar(state)
    mockUsePathname.mockReturnValue('/')

    renderHook(() => useOnboardingRedirect())
    jest.runOnlyPendingTimers()

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
