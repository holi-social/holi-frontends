import AsyncStore from '@react-native-async-storage/async-storage'
import { logError } from '@holi/core/errors/helpers'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'

const ONBOARDING_USER_DATA_KEY = 'onboardingUserData'
export const storeOnboardingUserDataAsyncStore = async (userData: OnboardingUserData): Promise<void> => {
  try {
    await AsyncStore.setItem(ONBOARDING_USER_DATA_KEY, JSON.stringify(userData))
  } catch (error) {
    logError(error, 'Failed to store onboarding user data', {
      location: 'onboarding.storeOnboardingUserDataAsyncStore',
    })
  }
}
export const getOnboardingUserDataAsyncStore = async (): Promise<OnboardingUserData | null> => {
  try {
    const userData = await AsyncStore.getItem(ONBOARDING_USER_DATA_KEY)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    logError(error, 'Failed to get onboarding user data', {
      location: 'onboarding.getOnboardingUserDataAsyncStore',
    })
    return null
  }
}
export const clearOnboardingUserDataAsyncStore = async (): Promise<void> => {
  try {
    await AsyncStore.removeItem(ONBOARDING_USER_DATA_KEY)
  } catch (error) {
    logError(error, 'Failed to remove onboarding user data', {
      location: 'onboarding.clearOnboardingUserDataAsyncStore',
    })
  }
}
