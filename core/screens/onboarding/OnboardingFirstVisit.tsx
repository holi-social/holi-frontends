import { withProfiler } from '@sentry/react'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { FirstVisitOnboardingStepper } from '@holi/core/screens/onboarding/components/FirstVisitOnboardingStepper'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { useFirstVisitContentSelection } from '@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection'
import SafeArea from '@holi/ui/components/atoms/SafeArea'

const OnboardingFirstVisit = () => {
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()
  const { selectedContentType, selectContentType } = useFirstVisitContentSelection()
  const { isLoggedIn } = useLoggedInUser()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  useEffect(() => {
    if (isLoggedIn) {
      return navigate('/')
    }
    if (selectedContentType) {
      storeOnboardingState('finished').then(() => {
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
      })
    }
  }, [selectedContentType, navigate, isLoggedIn])

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
