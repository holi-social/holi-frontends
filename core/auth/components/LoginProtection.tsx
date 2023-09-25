import React from 'react'
import { Platform } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn, isLoading: isUserIDLoading } = useAuth()
  const { isLoading: isUserLoading } = useLoggedInUser()

  const { storedOnboardingState } = useStoredOnboardingState()
  const isOnboardingFinished = storedOnboardingState === 'finished'
  const { navigate } = useRouting()

  if (isUserIDLoading || isUserLoading) return <HoliLoader />
  if (!isLoggedIn || !isOnboardingFinished) {
    navigate(Platform.OS === 'web' ? '/' : '/onboarding')
    return null
  }

  return <>{children}</>
}

export default LoginProtection
