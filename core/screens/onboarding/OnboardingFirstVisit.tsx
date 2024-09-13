import { withProfiler } from '@sentry/react'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { FirstVisitOnboardingStepper } from '@holi/core/screens/onboarding/components/FirstVisitOnboardingStepper'
import { useFirstVisitContentSelection } from '@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection'
import SafeArea from '@holi/ui/components/atoms/SafeArea'

const OnboardingFirstVisit = () => {
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()
  const { selectedContentType, selectContentType } = useFirstVisitContentSelection()

  // HOLI-9831: Check if user is already logged in?

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  useEffect(() => {
    if (selectedContentType) {
      switch (selectedContentType) {
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
  }, [selectedContentType, navigate])

  return (
    <SafeArea style={styles.container}>
      <FirstVisitOnboardingStepper onContentSelection={selectContentType} />
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default withProfiler(OnboardingFirstVisit, { name: 'OnboardingFirstVisit' })
