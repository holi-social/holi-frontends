import React, { useEffect, useState } from 'react'
import { useOnboardingInitialization, useOnboardingRedirect } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { RootNavigator } from '@holi/mobile/navigation/RootNavigator'

interface OnboardingAwaitingNavigatorProps {
  onReady: () => Promise<boolean>
}

export const OnboardingAwaitingNavigator = ({ onReady }: OnboardingAwaitingNavigatorProps) => {
  const { isLoading } = useOnboardingInitialization()
  const [isInitialized, setIsInitialized] = useState(false)
  const { showOnboardingOnStartup } = useOnboardingRedirect()

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      onReady()
      setIsInitialized(true)
    }
  }, [isInitialized, isLoading, onReady])

  if (isLoading && !isInitialized) {
    return null
  }

  // Overrides the "default route" of the app if onboarding should be shown.
  // This is based on the suggested way to handle authentication by react navigation: https://reactnavigation.org/docs/auth-flow/
  return <RootNavigator showOnboardingOnStartup={showOnboardingOnStartup} />
}
