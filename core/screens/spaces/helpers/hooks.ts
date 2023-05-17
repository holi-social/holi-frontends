import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'

export const SPACE_ONBOARDING_STATE_STORAGE_NAME = 'space_onboarding_state_value'

const spaceOnboardingValues = ['space_requested', 'space_joined', 'space_editing', 'finished'] as const
export type SpaceOnboardingStateValue = (typeof spaceOnboardingValues)[number]

const isSpaceOnboardingStateValue = (value: string | null): value is SpaceOnboardingStateValue =>
  spaceOnboardingValues.some((v) => value === v)

const spaceOnboardingStateVar = makeVar<SpaceOnboardingStateValue>('finished')

export const useSpaceOnboarding = () => {
  const { userId } = useAuth()

  const onSpaceOnboardingStateChange = useCallback(async (value: SpaceOnboardingStateValue = 'finished') => {
    spaceOnboardingStateVar(value)
    await AsyncStore.setItem(SPACE_ONBOARDING_STATE_STORAGE_NAME, value)
  }, [])

  useEffect(() => {
    if (userId === undefined) return

    const isLoggedIn = !!userId

    AsyncStore.getItem(SPACE_ONBOARDING_STATE_STORAGE_NAME)?.then(async (storedValue) => {
      const value = isSpaceOnboardingStateValue(storedValue) ? storedValue : null

      switch (value) {
        case 'space_requested':
        case 'space_joined':
        case 'space_editing':
        case 'finished':
          spaceOnboardingStateVar(value)
          break

        case null:
          await onSpaceOnboardingStateChange(isLoggedIn ? 'finished' : 'space_requested')
          break

        default:
          throw new Error(`[SpaceOnboarding] does not support "${value}" value`)
      }
    })
  }, [userId, onSpaceOnboardingStateChange])

  return {
    spaceOnboardingState: useReactiveVar(spaceOnboardingStateVar),
    onSpaceOnboardingStateChange,
  }
}
