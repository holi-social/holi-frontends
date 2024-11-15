import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Platform } from 'react-native'

export const ONBOARDING_STATE_STORAGE_NAME = 'onboarding_state_value'

const onboardingValues = ['onboarding', 'emailVerification', 'accountSetup', 'finished'] as const
export type OnboardingStateValue = (typeof onboardingValues)[number]

const isOnboardingStateValue = (value: string | null): value is OnboardingStateValue =>
  onboardingValues.some((v) => value === v)

export const onboardingStateVar = makeVar<OnboardingStateValue | null>(null)

export const clearOnboardingState = async () => {
  await AsyncStore.removeItem(ONBOARDING_STATE_STORAGE_NAME)
  onboardingStateVar(null)
}

export const storeOnboardingState = async (value: OnboardingStateValue) => {
  if (!value) return

  await AsyncStore.setItem(ONBOARDING_STATE_STORAGE_NAME, value)
  onboardingStateVar(value)
}

export const useStoredOnboardingState = () => useReactiveVar(onboardingStateVar)

const determineTargetState = ({
  isLoggedIn,
  accountCompleted,
  value,
}: {
  isLoggedIn: boolean
  accountCompleted: boolean
  value: OnboardingStateValue | null
}): OnboardingStateValue => {
  if (isLoggedIn && !accountCompleted) {
    return 'accountSetup'
  }
  if (isLoggedIn && value !== 'accountSetup') {
    return 'finished'
  }
  return value || 'onboarding'
}

export const useOnboardingInitialization = () => {
  const loginState = useLoggedInUser()

  useEffect(() => {
    if (loginState.isLoading) return

    AsyncStore.getItem(ONBOARDING_STATE_STORAGE_NAME)?.then(async (storedValue) => {
      const value = isOnboardingStateValue(storedValue) ? storedValue : null
      const accountCompleted = !!loginState.user?.identity && !!loginState.user?.firstName
      const targetState = determineTargetState({ isLoggedIn: loginState.isLoggedIn, accountCompleted, value })

      if (value !== targetState) {
        await storeOnboardingState(targetState)
      } else {
        onboardingStateVar(value)
      }
    })
  }, [loginState])
}

export const useOnboardingRedirect = () => {
  const onboardingState = useStoredOnboardingState()
  const pathname = usePathname()
  const { navigate } = useRouting()
  // FIXME Using setTimeout as navigation might not be properly set up yet
  // and is only needed on mobile
  // Crude hack to workaround a react-navigation issue: https://github.com/react-navigation/react-navigation/issues/9170
  // Should be fixed with react-navigation v7
  const navigateWithTimeout = useCallback(
    (path: string) => {
      if (Platform.OS !== 'web') {
        setTimeout(() => {
          navigate(path)
        }, 100)
      } else {
        navigate(path)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (onboardingState === 'accountSetup' && pathname !== '/onboarding/registration') {
      navigateWithTimeout('/onboarding/registration')
    } else if (onboardingState === 'onboarding' && pathname === '/') {
      navigateWithTimeout('/onboarding')
    }
  }, [navigateWithTimeout, onboardingState, pathname])
}
