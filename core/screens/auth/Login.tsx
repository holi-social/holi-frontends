import React from 'react'

import { Authentication } from '@holi/core/screens/auth/Authentication'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { clearOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'

export const Login = () => {
  const { navigateBack } = useRouting()

  return (
    <Authentication
      initialSelection="login"
      onContinueAsGuest={() => {
        clearOnboardingState()
        return navigateBack('/act')
      }}
    />
  )
}
