import { withProfiler } from '@sentry/react'
import { memo } from 'react'
import { Platform } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useOnboardingInitialization, useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'

const OnboardingInitializer = () => {
  const { replaceRoute, navigate } = useRouting()
  const onboardingState = useStoredOnboardingState()

  const navFunction = Platform.OS === 'web' ? replaceRoute : navigate

  const finished = onboardingState === 'finished'

  useOnboardingInitialization()

  useIsomorphicLayoutEffect(() => {
    if (onboardingState === undefined || finished) {
      return
    } else if (onboardingState === 'onboarding') {
      navFunction('/onboarding')
    } else {
      navFunction('/onboarding/registration')
    }
  }, [finished, navFunction, onboardingState])

  return null
}

export default withProfiler(memo(OnboardingInitializer), { name: 'OnboardingInitializer' })
