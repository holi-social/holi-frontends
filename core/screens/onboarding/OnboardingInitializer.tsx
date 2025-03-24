import { withProfiler } from '@sentry/react'
import { memo } from 'react'

import { useOnboardingInitialization, useOnboardingRedirect } from './hooks/onboardingState'

const OnboardingInitializer = ({ children }: React.PropsWithChildren) => {
  const { isLoading } = useOnboardingInitialization()
  const { showOnboardingOnStartup } = useOnboardingRedirect()

  if (isLoading || showOnboardingOnStartup) {
    return null
  }

  return children
}

export default withProfiler(memo(OnboardingInitializer), { name: 'OnboardingInitializer' })
