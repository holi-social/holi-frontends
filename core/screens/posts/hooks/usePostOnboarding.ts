import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'

import { useLoginState } from '@holi/core/auth/loginState'

export const POST_ONBOARDING_STATE_STORAGE_NAME = 'post_onboarding_state_value'

const postOnboardingStateValues = ['onboarding', 'finished'] as const // eslint-disable-line @typescript-eslint/no-unused-vars
export type PostOnboardingStateValue = (typeof postOnboardingStateValues)[number]

// null is loading state (AsyncStorage.getItem is async)
const postOnboardingStateVar = makeVar<boolean | null>(null)

export const usePostOnboarding = (onboarding_type: string) => {
  const loginState = useLoginState()

  useEffect(() => {
    if (loginState.isUnknown) return
    AsyncStore.getItem(onboarding_type)?.then(async (storedValue) => {
      postOnboardingStateVar(!!storedValue)
    })
  }, [loginState, onboarding_type])

  return {
    // null is loading state (AsyncStorage.getItem is async), false is not onboarded, true is onboarded
    isOnboarded: useReactiveVar(postOnboardingStateVar) !== false,
    setIsOnboarded: async () => {
      postOnboardingStateVar(true)
      await AsyncStore.setItem(onboarding_type, 'true')
    },
  }
}
