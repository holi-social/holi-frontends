import React, { useEffect, useState, type PropsWithChildren } from 'react'
import { Redirect } from 'expo-router'
import { useOnboardingInitialization, useOnboardingRedirect } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { RootNavigator } from '@holi/mobile/navigation/RootNavigator'

interface OnboardingAwaitingNavigatorProps {
  onReady?: () => Promise<boolean> | void
}

export const OnboardingAwaitingNavigator = ({ onReady }: OnboardingAwaitingNavigatorProps) => {
  const { isLoading } = useOnboardingInitialization()
  const [isInitialized, setIsInitialized] = useState(false)
  const { showOnboardingOnStartup } = useOnboardingRedirect()

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      onReady?.()
      setIsInitialized(true)
    }
  }, [isInitialized, isLoading, onReady])

  if (isLoading && !isInitialized) {
    return null
  }

  return children
}

// TODO: IMPORTANT move notification init inside Onboarding
// export const OnboardingAwaitingNavigator = ({ onReady }: OnboardingAwaitingNavigatorProps) => {
//   const { isLoading, onboardingState } = useOnboardingInitialization()
//   const [isInitialized, setIsInitialized] = useState(false)
//   const [notificationsInitialized, setNotificationsInitialized] = useState(false)
//   const { showOnboardingOnStartup } = useOnboardingRedirect()

//   useEffect(() => {
//     if (!isInitialized && !isLoading) {
//       onReady?.()
//       setIsInitialized(true)
//     }
//   }, [isInitialized, isLoading, onReady])

//   useEffect(() => {
//     if (!notificationsInitialized && onboardingState === 'finished') {
//       initNotifications().then(() => {
//         setNotificationsInitialized(true)
//       })
//     }
//   }, [onboardingState, notificationsInitialized])

//   if (isLoading && !isInitialized) {
//     return null
//   }

//   return children
// }
