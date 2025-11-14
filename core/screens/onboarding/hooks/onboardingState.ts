import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import { useEffect, useMemo, useState } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useVerificationFlowData, type VerificationFlowState } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useGuestMode } from '@holi/core/screens/onboarding/hooks/useGuestMode'
import { isAccountComplete } from '@holi/core/screens/onboarding/helpers/isAccountComplete'

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
  const onboardingState = useOnboardingState()
  const pathname = usePathname()
  const { navigate } = useRouting()

  useEffect(() => {
    if (isLoading) {
      return
    }

    const isOnboarding = onboardingState === 'onboarding'
    const isEmailVerification = onboardingState === 'emailVerification'
    const isAccountSetup = onboardingState === 'accountSetup'

    // Skip redirect to onboarding if user is on TaskCompletionFlow screen
    const isOnTaskCompletionFlow =
      pathname?.includes('/complete') || pathname?.includes('/callback') || pathname?.includes('/act')

    if ((isAccountSetup || isEmailVerification) && pathname !== '/onboarding' && !isOnTaskCompletionFlow) {
      navigate('/onboarding')
    } else if (isOnboarding && pathname === '/') {
      navigate('/onboarding')
    }
  }, [isLoading, navigate, onboardingState, pathname])

  return {
    showOnboardingOnStartup: onboardingState !== 'finished' && pathname === '/',
  }
}
