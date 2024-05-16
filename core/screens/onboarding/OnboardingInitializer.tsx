import { withProfiler } from '@sentry/react'
import { memo, useEffect } from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useOnboardingInitialization, useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'

const OnboardingInitializer = () => {
  const { navigate } = useRouting()
  const onboardingState = useStoredOnboardingState()

  const finished = onboardingState === 'finished'

  useOnboardingInitialization()

  useEffect(() => {
    if (onboardingState === undefined || finished) {
      return
    } else if (onboardingState === 'onboarding') {
      navigate('/onboarding')
    } else {
      navigate('/onboarding/registration')
    }
  }, [finished, navigate, onboardingState])

  return null
}

export default withProfiler(memo(OnboardingInitializer), { name: 'OnboardingInitializer' })
