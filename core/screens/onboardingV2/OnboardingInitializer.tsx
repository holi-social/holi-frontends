import { withProfiler } from '@sentry/react'
import { memo } from 'react'

import { useOnboardingInitialization, useOnboardingRedirect } from './hooks/onboardingState'

const OnboardingInitializer = () => {
  useOnboardingInitialization()
  useOnboardingRedirect()

  return null
}

export default withProfiler(memo(OnboardingInitializer), { name: 'OnboardingInitializer' })
