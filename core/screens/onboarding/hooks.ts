import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'

export const ONBOARDING_STATE_STORAGE_NAME = 'onboarding_state_value'

export type OnboardingStateValue = 'onboarding' | 'accountSetup' | 'finished'
const onboardingStateVar = makeVar<OnboardingStateValue>('finished')

export const useOnboarding = () => {
  const { userId } = useAuth()
  const isLoggedIn = !!userId

  const onOnboardingStateChange = useCallback(async (value: OnboardingStateValue = 'finished') => {
    onboardingStateVar(value)
    await AsyncStore.setItem(ONBOARDING_STATE_STORAGE_NAME, value)
  }, [])

  useEffect(() => {
    AsyncStore.getItem(ONBOARDING_STATE_STORAGE_NAME)?.then(async (storedValue) => {
      // if user is not logged in and there is no onboarding state is AsyncStore, then it is freshly installed app, so show Onboarding
      if (!storedValue) {
        await onOnboardingStateChange(isLoggedIn ? 'finished' : 'onboarding')
        return
      }

      onboardingStateVar(storedValue as OnboardingStateValue)
    })
  }, [isLoggedIn, onOnboardingStateChange])

  return {
    onboardingState: useReactiveVar(onboardingStateVar),
    onOnboardingStateChange,
  }
}
