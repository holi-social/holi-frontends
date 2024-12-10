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

const testLocation = {
  id: 'location1',
  label: 'Location name',
  coordinates: { latitude: 1, longitude: 2 },
  geolocation: {
    place_id: 'location1',
    properties: { formatted: 'Location name' },
    geometry: { type: '', coordinates: [] },
  },
}
const fullUserData: OnboardingUserData = {
  content: 'SPACES',
  location: testLocation,
  interests: ['topic-1', 'topic-2'],
  skills: ['skill-1'],
}
const initialUserData: OnboardingUserData = {
  content: undefined,
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

  it('should update content selection', () => {
    const { result } = renderHook(() => useUserData())

    expect(result.current.userData.content).toBeUndefined()

    act(() => {
      result.current.updateContent('SPACES')
    })

    expect(result.current.userData.content).toEqual('SPACES')
    expect(mockStoreOnboardingUserDataAsyncStore).toHaveBeenCalledWith({
      ...initialUserData,
      content: 'SPACES',
    })
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

  it('should filter interests', () => {
    const { result } = renderHook(() => useUserData())

    expect(result.current.interestsSearchProps.filterString).toEqual('')

    act(() => {
      result.current.interestsSearchProps.onFilterStringChange('foobar')
    })

    expect(result.current.interestsSearchProps.filterString).toEqual('foobar')
    expect(mockStoreOnboardingUserDataAsyncStore).not.toHaveBeenCalled()
  })

  it('should filter skills', () => {
    const { result } = renderHook(() => useUserData())

    expect(result.current.skillsSearchProps.filterString).toEqual('')

    act(() => {
      result.current.skillsSearchProps.onFilterStringChange('foobar')
    })

    expect(result.current.skillsSearchProps.filterString).toEqual('foobar')
    expect(mockStoreOnboardingUserDataAsyncStore).not.toHaveBeenCalled()
  })
})
