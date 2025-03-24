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

  return <RootNavigator showOnboarding={showOnboardingOnStartup} />
}
