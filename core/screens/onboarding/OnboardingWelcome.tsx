import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import { HoliButtonTracked } from '@holi/core/components/HoliButtonTracked'
import { SMALL_DEVICE_HEIGHT } from '@holi/core/constants/constants'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AnimatedIntro from '@holi/core/screens/onboarding/components/AnimatedIntro'
import DocumentsFooter from '@holi/core/screens/onboarding/components/DocumentsFooter'
import { TrackingEvent } from '@holi/core/tracking/events'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

const OnboardingWelcome = () => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate, replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mdStyle = useBreakpointMatcher([[dimensions.breakpointM, true]])
  const { height: screenHeight } = useClientWindowDimensions()

  useEffect(() => {
    if (isLoggedIn) {
      replaceRoute('/')
    }
  }, [replaceRoute, isLoggedIn])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  usePreventBackNavigation(true)

  return (
    <SafeArea style={styles.container}>
      <CenteredContentLayout append={<DocumentsFooter />}>
        <AnimatedIntro />
        <View
          style={[
            styles.ctasContainer,
            {
              gap: mdStyle ? Spacing.md : Spacing.xs,
              marginTop: screenHeight > SMALL_DEVICE_HEIGHT ? Spacing.xxl : Spacing.xxs,
            },
          ]}
        >
          <HoliButtonTracked
            variant="default"
            style={[styles.forwardBtn]}
            label={t('onboarding.welcome.forward')}
            onPress={() => navigate('/onboarding/first-visit')}
            testID="btn-to-onboarding"
            trackingEvent={TrackingEvent.OnboardingPressed('WELCOME', 'CONTINUE')}
          >
            {t('onboarding.welcome.forward')}
          </HoliButtonTracked>
          <AlreadyHaveAccountText trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
        </View>
        <HoliGap size="xl" />
      </CenteredContentLayout>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  forwardBtn: {
    width: '100%',
  },
  ctasContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default OnboardingWelcome
