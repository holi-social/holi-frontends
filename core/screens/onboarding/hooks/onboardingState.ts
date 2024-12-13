import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Platform } from 'react-native'
import { useVerificationFlowData, type VerificationFlowState } from '@holi/core/auth/helpers/useVerificationFlowData'

const ONBOARDING_STATE_STORAGE_NAME = 'onboarding_state_value'

/** @deprecated since v1.43: Clean up local state that is no longer needed */
export const cleanUpStoredOnboardingState = () => AsyncStore.removeItem(ONBOARDING_STATE_STORAGE_NAME)

const onboardingValues = ['onboarding', 'emailVerification', 'accountSetup', 'finished'] as const
export type OnboardingStateValue = (typeof onboardingValues)[number]

export const onboardingStateVar = makeVar<OnboardingStateValue | null>(null)

export const clearOnboardingState = () => {
  onboardingStateVar(null)
}

export const storeOnboardingState = (value: OnboardingStateValue) => {
  if (!value) return

  onboardingStateVar(value)
}

export const useOnboardingState = () => useReactiveVar(onboardingStateVar)

const determineTargetState = ({
  isLoggedIn,
  accountCompleted,
  emailVerificationState,
  value,
}: {
  isLoggedIn: boolean
  accountCompleted: boolean
  emailVerificationState: VerificationFlowState
  value: OnboardingStateValue | null
}): OnboardingStateValue | never => {
  if (emailVerificationState) {
    return 'emailVerification'
  }
  if (isLoggedIn && !accountCompleted) {
    return 'accountSetup'
  }
  if (isLoggedIn && value !== 'accountSetup') {
    return 'finished'
  }
  if (!isLoggedIn && value !== 'finished') {
    return 'onboarding'
  }
  return value || 'onboarding'
}

export const useOnboardingInitialization = () => {
  const loginState = useLoggedInUser()
  const currentOnboardingState = useOnboardingState()
  const emailVerificationState = useVerificationFlowData()

  useEffect(() => {
    if (loginState.isLoading) return

    const accountCompleted = !!loginState.user?.identity && !!loginState.user?.firstName

    const targetState = determineTargetState({
      isLoggedIn: loginState.isLoggedIn,
      accountCompleted,
      emailVerificationState,
      value: currentOnboardingState,
    })
    if (currentOnboardingState !== targetState) {
      storeOnboardingState(targetState)
    }
  }, [
    emailVerificationState,
    loginState.isLoading,
    loginState.isLoggedIn,
    loginState.user?.firstName,
    loginState.user?.identity,
    currentOnboardingState,
  ])
}

export const useOnboardingRedirect = () => {
  const onboardingState = useOnboardingState()
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
    const isOnboarding = onboardingState === 'onboarding'
    const isEmailVerification = onboardingState === 'emailVerification'
    const isAccountSetup = onboardingState === 'accountSetup'

    if ((isAccountSetup || isEmailVerification) && pathname !== '/onboarding') {
      navigateWithTimeout('/onboarding')
    } else if (isOnboarding && pathname === '/') {
      navigateWithTimeout('/onboarding')
    }
  }, [navigateWithTimeout, onboardingState, pathname])
}
