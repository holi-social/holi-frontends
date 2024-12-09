import AsyncStorage from '@react-native-async-storage/async-storage'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'
import {
  clearOnboardingUserDataAsyncStore,
  getOnboardingUserDataAsyncStore,
  storeOnboardingUserDataAsyncStore,
} from '@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore'
import { logError } from '@holi/core/errors/helpers'

jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

const mockGetStorage = AsyncStorage.getItem as jest.Mock
const mockWriteStorage = AsyncStorage.setItem as jest.Mock
const mockDeleteStorage = AsyncStorage.removeItem as jest.Mock
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }
})

describe('onboardingUserDataAsyncStore', () => {
  const fullUserData: OnboardingUserData = {
    content: 'SPACES',
    location: {
      id: 'location1',
      label: 'Location name',
      coordinates: { latitude: 1, longitude: 2 },
      geolocation: {
        place_id: 'location1',
        properties: { formatted: 'Location name' },
        geometry: { type: '', coordinates: [] },
      },
    },
    interests: ['topic-1', 'topic-2'],
    skills: ['skill-1'],
  }
  const fullUserDataJSON = JSON.stringify(fullUserData)
  const minimalUserData: OnboardingUserData = {
    content: undefined,
    location: undefined,
    interests: [],
    skills: [],
  }
  const testError = new Error('Test error')

  it('should store user data as JSON', async () => {
    await storeOnboardingUserDataAsyncStore(fullUserData)

    expect(mockWriteStorage).toHaveBeenCalledWith('onboardingUserData', fullUserDataJSON)
  })

  it('should catch and log error when storing user data fails', async () => {
    mockWriteStorage.mockRejectedValueOnce(testError)

    await storeOnboardingUserDataAsyncStore(fullUserData)

    expect(logError).toHaveBeenCalledWith(testError, 'Failed to store onboarding user data', {
      location: 'onboarding.storeOnboardingUserDataAsyncStore',
    })
  })

  it('should remove user data', async () => {
    await clearOnboardingUserDataAsyncStore()

    expect(mockDeleteStorage).toHaveBeenCalledWith('onboardingUserData')
  })

  it('should catch and log error when removing user data fails', async () => {
    mockDeleteStorage.mockRejectedValueOnce(testError)

    await clearOnboardingUserDataAsyncStore()

    expect(logError).toHaveBeenCalledWith(testError, 'Failed to remove onboarding user data', {
      location: 'onboarding.clearOnboardingUserDataAsyncStore',
    })
  })

  it('should load and parse full user data', async () => {
    mockGetStorage.mockResolvedValue(fullUserDataJSON)

    const userData = await getOnboardingUserDataAsyncStore()

    expect(userData).toEqual(fullUserData)
  })

  it('should load and parse minimal user data', async () => {
    mockGetStorage.mockResolvedValue(JSON.stringify(minimalUserData))

    const userData = await getOnboardingUserDataAsyncStore()

    expect(userData).toEqual(minimalUserData)
  })

  it('should return null and log error when loading user data fails', async () => {
    mockGetStorage.mockRejectedValueOnce(testError)

    const userData = await getOnboardingUserDataAsyncStore()

    expect(userData).toBeNull()
    expect(logError).toHaveBeenCalledWith(testError, 'Failed to get onboarding user data', {
      location: 'onboarding.getOnboardingUserDataAsyncStore',
    })
  })

  it('should return null and log error when parsing user data fails', async () => {
    mockGetStorage.mockResolvedValue('invalid json')

    const userData = await getOnboardingUserDataAsyncStore()

    expect(userData).toBeNull()
    expect(logError).toHaveBeenCalledWith(expect.any(Object), 'Failed to get onboarding user data', {
      location: 'onboarding.getOnboardingUserDataAsyncStore',
    })
  })
})
