import { withProfiler } from '@sentry/react'
import { memo, useEffect } from 'react'
import { BackHandler, Platform } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  useOnboardingInitialization,
  useStoredOnboardingState,
} from '@holi/core/screens/onboarding/hooks/onboardingState'

const OnboardingInitializer = () => {
  const { navigate } = useRouting()
  const onboardingState = useStoredOnboardingState()

  const finished = onboardingState === 'finished'
  const forceOnboarding = onboardingState !== undefined && !finished

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

  // Prevent back navigation on android
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return
    }
    const listener = () => {
      return forceOnboarding
    }
    BackHandler.addEventListener('hardwareBackPress', listener)

    return () => BackHandler.removeEventListener('hardwareBackPress', listener)
  }, [forceOnboarding])

  return null
}

export default withProfiler(memo(OnboardingInitializer), { name: 'OnboardingInitializer' })
