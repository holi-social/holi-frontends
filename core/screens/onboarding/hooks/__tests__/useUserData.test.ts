import {
  getOnboardingUserDataAsyncStore,
  storeOnboardingUserDataAsyncStore,
} from '@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore'
import { useUserData } from '@holi/core/screens/onboarding/hooks/useUserData'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'
import { act, renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'

const mockGetOnboardingUserDataAsyncStore = getOnboardingUserDataAsyncStore as jest.Mock
const mockStoreOnboardingUserDataAsyncStore = storeOnboardingUserDataAsyncStore as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore', () => {
  return {
    getOnboardingUserDataAsyncStore: jest.fn(),
    storeOnboardingUserDataAsyncStore: jest.fn(),
  }
})

export const testLocation = {
  id: 'location1',
  label: 'Hamburg, Germany',
  coordinates: { latitude: 1, longitude: 2 },
  geolocation: {
    place_id: 'location1',
    properties: { formatted: 'Hamburg, Germany', lat: 1, lon: 2 },
    geometry: { type: '', coordinates: [] },
  },
}
const fullUserData: OnboardingUserData = {
  location: testLocation,
  interests: ['migration-refugees', 'youth-development'],
  skills: ['legal-assistance'],
}
const initialUserData: OnboardingUserData = {
  location: undefined,
  interests: [],
  skills: [],
}

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

  it('should migrate topics & skills V1 in existing user data when loading from storage', async () => {
    mockGetOnboardingUserDataAsyncStore.mockResolvedValue({
      ...fullUserData,
      interests: ['migration-integration', 'children-youth'],
      skills: ['law-regulations'],
    })
    const { result } = renderHook(() => useUserData())

    expect(result.current.userData).toEqual(initialUserData)

    await waitFor(() => expect(result.current.userData).toEqual(fullUserData))
  })

  it('should update location', () => {
    const { result } = renderHook(() => useUserData())

    expect(result.current.userData.location).toBeUndefined()

    act(() => {
      result.current.updateLocation(testLocation)
    })

    expect(result.current.userData.location).toEqual(testLocation)
    expect(mockStoreOnboardingUserDataAsyncStore).toHaveBeenCalledWith({
      ...initialUserData,
      location: testLocation,
    })
  })

  it('should toggle interests', () => {
    const { result } = renderHook(() => useUserData())

    expect(result.current.userData.interests).toEqual([])

    act(() => {
      result.current.updateInterests('topic-1')
    })
    act(() => {
      result.current.updateInterests('topic-2')
    })

    expect(result.current.userData.interests).toEqual(['topic-1', 'topic-2'])

    act(() => {
      result.current.updateInterests('topic-1')
    })

    expect(result.current.userData.interests).toEqual(['topic-2'])

    expect(mockStoreOnboardingUserDataAsyncStore).toHaveBeenCalledWith({
      ...initialUserData,
      interests: ['topic-2'],
    })
  })

  it('should toggle skills', () => {
    const { result } = renderHook(() => useUserData())

    expect(result.current.userData.skills).toEqual([])

    act(() => {
      result.current.updateSkills('skill-1')
    })
    act(() => {
      result.current.updateSkills('skill-2')
    })

    expect(result.current.userData.skills).toEqual(['skill-1', 'skill-2'])

    act(() => {
      result.current.updateSkills('skill-1')
    })

    expect(result.current.userData.skills).toEqual(['skill-2'])
    expect(mockStoreOnboardingUserDataAsyncStore).toHaveBeenCalledWith({
      ...initialUserData,
      skills: ['skill-2'],
    })
  })
})
