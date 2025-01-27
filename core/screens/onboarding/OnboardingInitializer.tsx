import { withProfiler } from '@sentry/react'
import { memo } from 'react'

import {
  cleanUpStoredOnboardingState,
  useOnboardingInitialization,
  useOnboardingRedirect,
} from './hooks/onboardingState'
import { isSSR } from '@holi/core/helpers/isSSR'

const OnboardingInitializer = () => {
  useOnboardingInitialization()
  useOnboardingRedirect()
  // Clean up of old storage, as it's not used anymore
  if (!isSSR) {
    cleanUpStoredOnboardingState()
  }

  return null
}

export default withProfiler(memo(OnboardingInitializer), { name: 'OnboardingInitializer' })
