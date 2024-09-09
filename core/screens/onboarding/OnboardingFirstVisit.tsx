import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleSheet } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import {
  ContentType,
  FirstVisitOnboardingStepper,
} from '@holi/core/screens/onboarding/components/FirstVisitOnboardingStepper'
import SafeArea from '@holi/ui/components/atoms/SafeArea'

const OnboardingFirstVisit = () => {
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()

  // HOLI-9752: Check if onboarding already finished
  // HOLI-9831: Check if user is already logged in?

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  const onContentSelection = (contentType: ContentType) => {
    // HOLI-9752: store onboarding state
    switch (contentType) {
      case 'CHALLENGES':
        return navigate('/act')
      case 'DONATIONS':
        return navigate('/act')
      case 'VOLUNTEERING':
        return navigate('/act')
      case 'SPACES':
        return navigate('/spaces')
      case 'HOME':
      default:
        return navigate('/')
    }
  }

  return (
    <SafeArea style={styles.container}>
      <FirstVisitOnboardingStepper onContentSelection={onContentSelection} />
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default withProfiler(OnboardingFirstVisit, { name: 'OnboardingFirstVisit' })
