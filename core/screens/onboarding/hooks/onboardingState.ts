import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useVerificationFlowData, type VerificationFlowState } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useGuestMode } from '@holi/core/screens/onboarding/hooks/useGuestMode'
import { isAccountComplete } from '@holi/core/screens/onboarding/helpers/isAccountComplete'
import { Platform } from 'react-native'

const onboardingValues = ['onboarding', 'emailVerification', 'accountSetup', 'finished'] as const // eslint-disable-line @typescript-eslint/no-unused-vars
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
  guestMode,
  value,
}: {
  isLoggedIn: boolean
  accountCompleted: boolean
  emailVerificationState: VerificationFlowState
  guestMode: boolean
  value: OnboardingStateValue | null
}): OnboardingStateValue | never => {
  if (emailVerificationState) {
    return 'emailVerification'
  }
  if (!isLoggedIn && guestMode) {
    return 'finished'
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
  const { isLoading: isLoadingGuestMode, guestMode } = useGuestMode()
  const [, forceUpdate] = useState(false)

  useEffect(() => {
    if (loginState.isLoading || isLoadingGuestMode) return

    const targetState = determineTargetState({
      isLoggedIn: loginState.isLoggedIn,
      accountCompleted: isAccountComplete(loginState.user),
      emailVerificationState,
      guestMode,
      value: currentOnboardingState,
    })
    if (currentOnboardingState !== targetState) {
      storeOnboardingState(targetState)
      // FIXME Workaround for storeOnboardingState not always triggering a re-render
      forceUpdate((prev) => !prev)
    }
  }, [
    emailVerificationState,
    loginState.isLoading,
    loginState.isLoggedIn,
    loginState.user,
    currentOnboardingState,
    isLoadingGuestMode,
    guestMode,
  ])

  const isLoading = useMemo(
    () => loginState.isLoading || isLoadingGuestMode || !currentOnboardingState,
    [currentOnboardingState, isLoadingGuestMode, loginState.isLoading]
  )

  return {
    isLoading,
    onboardingState: currentOnboardingState,
  }
}

export const useOnboardingRedirect = () => {
  const { isLoading } = useOnboardingInitialization()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onboardingState = useOnboardingState()
  const pathname = usePathname()
  const { navigate } = useRouting()

  // This is needed to avoid glitching on android while navigating to the onboarding screen
  const navigateWithTimeout = useCallback(
    (path: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      if (Platform.OS !== 'web') {
        timerRef.current = setTimeout(() => {
          navigate(path)
        }, 200)
      } else {
        navigate(path)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (isLoading) return

    const isOnboarding = onboardingState === 'onboarding'
    const isEmailVerification = onboardingState === 'emailVerification'
    const isAccountSetup = onboardingState === 'accountSetup'

    if ((isAccountSetup || isEmailVerification) && pathname !== '/onboarding') {
      navigateWithTimeout('/onboarding')
    } else if (isOnboarding && pathname === '/') {
      navigateWithTimeout('/onboarding')
    }
  }, [isLoading, navigate, navigateWithTimeout, onboardingState, pathname])

  useEffect(() => {
    return () => {
      const timer = timerRef.current
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  return {
    showOnboardingOnStartup: onboardingState !== 'finished' && pathname === '/',
  }
}
