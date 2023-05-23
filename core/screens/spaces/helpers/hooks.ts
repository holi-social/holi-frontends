import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'

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
