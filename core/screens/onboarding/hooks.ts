import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'

export const ONBOARDING_STATE_STORAGE_NAME = 'onboarding_state_value'

const onboardingValues = ['onboarding', 'emailVerification', 'accountSetup', 'finished'] as const
export type OnboardingStateValue = (typeof onboardingValues)[number]

const isOnboardingStateValue = (value: string | null): value is OnboardingStateValue =>
  onboardingValues.some((v) => value === v)

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
      const value = isOnboardingStateValue(storedValue) ? storedValue : null

      switch (value) {
        case 'onboarding':
        case 'emailVerification':
        case 'finished':
          onboardingStateVar(value)
          break

        case 'accountSetup':
          await onOnboardingStateChange(isLoggedIn ? 'accountSetup' : 'finished')
          break

        case null:
          await onOnboardingStateChange(isLoggedIn ? 'finished' : 'onboarding')
          break

        default:
          throw new Error(`[Onboarding] does not support "${value}" value`)
      }
    })
  }, [userId, onOnboardingStateChange])

  return {
    onboardingState: useReactiveVar(onboardingStateVar),
    onOnboardingStateChange,
  }
}
