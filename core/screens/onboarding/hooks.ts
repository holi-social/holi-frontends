import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'

export const ONBOARDING_STATE_STORAGE_NAME = 'onboarding_state_value'

const onboardingValues = ['onboarding', 'emailVerification', 'accountSetup', 'finished'] as const
export type OnboardingStateValue = (typeof onboardingValues)[number]

const isOnboardingStateValue = (value: string | null): value is OnboardingStateValue =>
  onboardingValues.some((v) => value === v)

const onboardingStateVar = makeVar<OnboardingStateValue>('finished')

export const useStoredOnboardingState = () => {
  const { userId } = useAuth()

  const storeOnboardingState = useCallback(async (value: OnboardingStateValue = 'finished') => {
    await AsyncStore.setItem(ONBOARDING_STATE_STORAGE_NAME, value)
    onboardingStateVar(value)
  }, [])

  useEffect(() => {
    // prevent race condition if `usedId` has not been read from the AsyncStorage yet
    if (userId === undefined) return

    const isLoggedIn = !!userId

    AsyncStore.getItem(ONBOARDING_STATE_STORAGE_NAME)?.then(async (storedValue) => {
      const value = isOnboardingStateValue(storedValue) ? storedValue : null

      switch (value) {
        case 'onboarding':
          if (isLoggedIn) {
            await storeOnboardingState('finished')
          } else {
            onboardingStateVar(value)
          }
          break
        case 'emailVerification':
        case 'finished':
          onboardingStateVar(value)
          break

        case 'accountSetup':
          await storeOnboardingState(isLoggedIn ? 'accountSetup' : 'finished')
          break

        case null:
          await storeOnboardingState(isLoggedIn ? 'finished' : 'onboarding')
          break

        default:
          throw new HoliOnboardingError(`Does not support "${value}" value`)
      }
    })
  }, [userId, storeOnboardingState])

  return {
    storedOnboardingState: useReactiveVar(onboardingStateVar),
    storeOnboardingState,
  }
}
