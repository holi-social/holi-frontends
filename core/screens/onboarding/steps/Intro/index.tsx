import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import { SMALL_DEVICE_HEIGHT } from '@holi/core/constants/constants'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import { TrackingEvent } from '@holi/core/tracking/events'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import AnimatedIntro from './AnimatedIntro'

interface Props {
  onContinue: () => void
}

export const Intro = ({ onContinue }: Props) => {
  const { t } = useTranslation()
  const mdStyle = useBreakpointMatcher([[dimensions.breakpointM, true]])
  const { height: screenHeight } = useClientWindowDimensions()

  usePreventBackNavigation(true)

  return (
    <View style={styles.wrapper}>
      <View>
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
          <HoliButton
            variant="default"
            style={[styles.forwardBtn]}
            label={t('onboarding.welcome.forward')}
            onPress={onContinue}
            testID="btn-to-onboarding"
          >
            {t('onboarding.welcome.forward')}
          </HoliButton>
          <AlreadyHaveAccountText trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
        </View>
        <HoliGap size="l" />
      </View>

      <DocumentsFooter displayImprint={true} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
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
})
