import { MockedProvider } from '@apollo/client/testing/react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import {
  getOnboardingUserDataAsyncStore,
  storeOnboardingUserDataAsyncStore,
} from '@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore'
import { useOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { renderRouter } from 'expo-router/testing-library'
import { screen } from '@testing-library/react-native'
import type React from 'react'

jest.useFakeTimers()

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => mockUseFeatureFlag(),
}))

const mockUseRedirect = useRedirect as jest.Mock
jest.mock('@holi/core/navigation/hooks/useRedirect', () => ({
  useRedirect: jest.fn(),
  pathToRedirect: jest.fn(),
}))

const mockUseTracking = useTracking as jest.Mock
jest.mock('@holi/core/tracking/hooks/useTracking', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockUseLoggedInUser = useLoggedInUser as jest.Mock
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

const mockUseOnboardingState = useOnboardingState as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  useOnboardingState: jest.fn(),
  storeOnboardingState: jest.fn(),
  useOnboardingInitialization: jest.fn(),
  useOnboardingRedirect: jest.fn(),
}))

const mockUseOnboardingCurrentStepKey = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/useOnboardingCurrentStepKey', () => ({
  useOnboardingCurrentStepKey: () => mockUseOnboardingCurrentStepKey(),
  onboardingSteps: [{ key: 'WELCOME_SCREEN' }, { key: 'CREATE_ACCOUNT' }, { key: 'USER_NAME_SELECTION' }],
}))

const mockGetOnboardingUserDataAsyncStore = getOnboardingUserDataAsyncStore as jest.Mock
const mockStoreOnboardingUserDataAsyncStore = storeOnboardingUserDataAsyncStore as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore', () => ({
  getOnboardingUserDataAsyncStore: jest.fn(),
  storeOnboardingUserDataAsyncStore: jest.fn(),
  clearOnboardingUserDataAsyncStore: jest.fn(),
}))

jest.mock('@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState', () => ({
  showOnboardingFinishModal: jest.fn(),
}))

jest.mock('@holi/core/screens/onboarding/hooks/useUserData', () => ({
  useUserData: () => ({ userData: {} }),
}))

jest.mock('@holi/core/navigation/hooks/usePreventBackNavigation', () => jest.fn())
jest.mock('@holi/core/helpers/useIsomorphicLayoutEffect', () => jest.fn())
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
jest.mock('@holi/core/navigation/hooks/useScreenOptions', () => ({
  useSetScreenOptions: () => jest.fn(),
}))
jest.mock('@holi/core/helpers/useSafeAreaInsets', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}))
jest.mock('@holi/core/auth/components/AlreadyHaveAccountText', () => {
  const React = require('react')
  const { View } = require('react-native')
  return function AlreadyHaveAccountText() {
    return React.createElement(View, { testID: 'already-have-account-text' })
  }
})
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Onboarding', () => {
  const track = jest.fn()
  const redirect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseOnboardingState.mockReturnValue('onboarding')
    mockUseTracking.mockReturnValue({ track })
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: false })
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue(undefined)
    mockStoreOnboardingUserDataAsyncStore.mockResolvedValue(undefined)
    mockUseRedirect.mockReturnValue(redirect)
    mockUseOnboardingCurrentStepKey.mockReturnValue(['WELCOME_SCREEN', jest.fn()])
    mockUseFeatureFlag.mockReturnValue([true])
  })

  it('should display loader until step is determined', () => {
    mockUseOnboardingState.mockReturnValue(null)
    mockUseOnboardingCurrentStepKey.mockReturnValue([null, jest.fn()])

    renderRouter({
      index: () => (
        <MockedProvider mocks={[]}>
          <Onboarding />
        </MockedProvider>
      ),
    })

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should render welcome screen initially', () => {
    mockUseOnboardingState.mockReturnValue('onboarding')

    renderRouter({
      index: () => (
        <MockedProvider mocks={[]}>
          <Onboarding />
        </MockedProvider>
      ),
    })

    // Check if the stepper is rendered
    expect(screen.getByTestId('onboarding-stepper')).toBeOnTheScreen()
  })

  it('should render create account step when onboarding state changes', () => {
    // When we have finished onboarding state, it should still show the stepper
    mockUseOnboardingState.mockReturnValue('finished')

    renderRouter({
      index: () => (
        <MockedProvider mocks={[]}>
          <Onboarding />
        </MockedProvider>
      ),
    })

    expect(screen.getByTestId('onboarding-stepper')).toBeOnTheScreen()
  })

  it('should handle logged in users with finished onboarding', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    mockUseOnboardingState.mockReturnValue('finished')

    renderRouter({
      index: () => (
        <MockedProvider mocks={[]}>
          <Onboarding />
        </MockedProvider>
      ),
    })

    // Should attempt to clean up and redirect
    expect(mockUseRedirect).toHaveBeenCalledWith('/act')
  })

  it('should render account setup for logged in users with incomplete accounts', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    mockUseOnboardingState.mockReturnValue('accountSetup')

    renderRouter({
      index: () => (
        <MockedProvider mocks={[]}>
          <Onboarding />
        </MockedProvider>
      ),
    })

    expect(screen.getByTestId('onboarding-stepper')).toBeOnTheScreen()
  })
})
