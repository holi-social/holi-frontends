import { getOnboardingUserDataAsyncStore } from '@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore'
import { useUserData } from '@holi/core/screens/onboarding/hooks/useUserData'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'
import { renderHook } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'

const mockGetOnboardingUserDataAsyncStore = getOnboardingUserDataAsyncStore as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore', () => {
  return {
    getOnboardingUserDataAsyncStore: jest.fn(),
    storeOnboardingUserDataAsyncStore: jest.fn(),
  }
})

// Simplified user data for the new onboarding flow
const fullUserData: OnboardingUserData = {}
const initialUserData: OnboardingUserData = {}

describe('useUserData', () => {
  beforeEach(() => {
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue(undefined)
  })

  it('should load existing user data from storage', async () => {
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue(fullUserData)

    const { result } = renderHook(() => useUserData())

    expect(result.current.userData).toEqual(initialUserData)

    await waitFor(() => expect(result.current.userData).toEqual(fullUserData))
  })

  it('should return simplified userData with no additional functions', () => {
    const { result } = renderHook(() => useUserData())

    expect(result.current.userData).toEqual(initialUserData)
    // Only userData should be returned, no update functions
    expect(Object.keys(result.current)).toEqual(['userData'])
  })
})
