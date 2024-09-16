import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useEffect, useRef } from 'react'

import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

export const ONBOARDING_STATE_STORAGE_NAME = 'onboarding_state_value'

const onboardingValues = ['onboarding', 'emailVerification', 'accountSetup', 'finished'] as const
export type OnboardingStateValue = (typeof onboardingValues)[number]

const isOnboardingStateValue = (value: string | null): value is OnboardingStateValue =>
  onboardingValues.some((v) => value === v)

export const onboardingStateVar = makeVar<OnboardingStateValue | undefined>(undefined)

export const clearOnboardingState = async () => {
  await AsyncStore.removeItem(ONBOARDING_STATE_STORAGE_NAME)
  onboardingStateVar(undefined)
}

export const storeOnboardingState = async (value: OnboardingStateValue) => {
  if (!value) return

  await AsyncStore.setItem(ONBOARDING_STATE_STORAGE_NAME, value)
  onboardingStateVar(value)
}

export const useStoredOnboardingState = () => useReactiveVar(onboardingStateVar)

export const useOnboardingInitialization = () => {
  const loginState = useLoggedInUser()
  const finishedOnce = useRef(false)

  useEffect(() => {
    if (loginState.isLoading || finishedOnce.current) return

    AsyncStore.getItem(ONBOARDING_STATE_STORAGE_NAME)
      ?.then(async (storedValue) => {
        const value = isOnboardingStateValue(storedValue) ? storedValue : null

        const userHasIdentity = loginState.isLoggedIn && loginState.user.identity
        const onboardingNotFinished = value !== 'finished'
        if (onboardingNotFinished && userHasIdentity) {
          await storeOnboardingState('finished')
          return
        }

        switch (value) {
          // First app load or when user reseted app data
          case null:
            await storeOnboardingState(loginState.isLoggedIn ? 'finished' : 'onboarding')
            break

          case 'onboarding':
          case 'emailVerification':
          case 'finished':
          case 'accountSetup':
            onboardingStateVar(value)
            break

          default:
            throw new HoliOnboardingError(`Onboarding does not support "${value}" value`)
        }
      })
      .then(() => (finishedOnce.current = true))
  }, [loginState])
}
