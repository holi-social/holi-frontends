import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'

export const ONBOARDING_STATE_STORAGE_NAME = 'onboarding_state_value'

export type OnboardingStateValue = 'onboarding' | 'accountSetup' | 'finished'
const onboardingStateVar = makeVar<OnboardingStateValue>('finished')

export const useOnboarding = () => {
  const { userId } = useAuth()

  const onOnboardingStateChange = useCallback(async (value: OnboardingStateValue = 'finished') => {
    onboardingStateVar(value)
    await AsyncStore.setItem(ONBOARDING_STATE_STORAGE_NAME, value)
  }, [])

  useEffect(() => {
    // prevent race condition if `usedId` has not been read from the AsyncStorage yet
    if (userId === undefined) return

    const isLoggedIn = !!userId

    AsyncStore.getItem(ONBOARDING_STATE_STORAGE_NAME)?.then(async (storedValue) => {
// Bind the values to a const assertion
const onboardingValues = <const>['onboarding', 'accountSetup', 'finished']
export type OnboardingStateValue = (typeof onboardingValues)[number]

// Create a type guard to validate the string
const isOnboardingStateValue = (value: string | null): value is OnboardingStateValue => !!onboardingValues.find(v => value === v)

....

const value = isOnboardingStateValue(storedValue) ? storedValue : null

      switch (value) {
        case 'onboarding':
        case 'finished':
          onboardingStateVar(value)
          break

        case 'accountSetup':
          await onOnboardingStateChange(isLoggedIn ? 'accountSetup' : 'finished')
          break

        default:
          await onOnboardingStateChange(isLoggedIn ? 'finished' : 'onboarding')
      }
    })
  }, [userId, onOnboardingStateChange])

  return {
    onboardingState: useReactiveVar(onboardingStateVar),
    onOnboardingStateChange,
  }
}
