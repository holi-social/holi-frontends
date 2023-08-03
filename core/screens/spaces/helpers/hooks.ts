import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { FEATURE_TOGGLES_STORAGE_NAME } from '@holi/core/components/FeatureTogglesFetcher'

export const SPACE_ONBOARDING_STATE_STORAGE_NAME = 'space_onboarding_state_value'

enum spaceOnboardingValues {
  SpaceJoinIsOnboarded = 'space_join_is_onboarded',
  SpaceEditing = 'space_is_edited',
  SpaceCreation = 'space_is_created',
}
export type SpaceOnboardingStateValue = (typeof spaceOnboardingValues)[keyof typeof spaceOnboardingValues]

// null is loading state (AsyncStorage.getItem is async)
const spaceOnboardingStateVar = makeVar<boolean | null>(null)

export const useSpaceOnboarding = (onboarding_type: string) => {
  const { userId } = useAuth()

  useEffect(() => {
    if (userId === undefined) return
    AsyncStore.getItem(onboarding_type)?.then(async (storedValue) => {
      spaceOnboardingStateVar(!!storedValue)
    })
  }, [userId, onboarding_type])

  return {
    // null is loading state (AsyncStorage.getItem is async), false is not onboarded, true is onboarded
    isOnboarded: useReactiveVar(spaceOnboardingStateVar) !== false,
    setIsOnboarded: async () => {
      spaceOnboardingStateVar(true)
      await AsyncStore.setItem(onboarding_type, 'true')
    },
  }
}

export const getFeatureToggleStatusByName = async (toggleName: string): Promise<string | null> => {
  const storedData = await AsyncStore.getItem(FEATURE_TOGGLES_STORAGE_NAME)
  if (storedData) {
    const parsedData = JSON.parse(storedData)
    if (Array.isArray(parsedData)) {
      const foundToggle = parsedData.find((toggle: { name: string }) => toggle.name === toggleName)
      return foundToggle ? foundToggle.status : null
    }
  }
  return null
}
