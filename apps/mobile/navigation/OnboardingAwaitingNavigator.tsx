import React, { useEffect, useState, type PropsWithChildren } from 'react'
import { Redirect } from 'expo-router'
import { useOnboardingInitialization, useOnboardingRedirect } from '@holi/core/screens/onboarding/hooks/onboardingState'
interface OnboardingAwaitingNavigatorProps {
  onReady?: () => Promise<boolean> | void
}

// TODO: IMPORTANT move notification init inside Onboarding
export const OnboardingAwaitingNavigator = ({
  onReady,
  children,
}: PropsWithChildren<OnboardingAwaitingNavigatorProps>) => {
  const { isLoading } = useOnboardingInitialization()
  const [isInitialized, setIsInitialized] = useState(false)
  const { showOnboardingOnStartup } = useOnboardingRedirect()

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      onReady?.()
      setIsInitialized(true)
    }
  }, [isInitialized, isLoading, onReady])

  if (isLoading && !isInitialized) return null

  if (showOnboardingOnStartup) {
    return <Redirect href="/onboarding" />
  }

  return children
}
