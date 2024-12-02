import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import type { SignupModalPressedTrigger } from '@holi/core/tracking/types'
import HoliConfirmation, { type HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SignupGuardModalProps extends Partial<HoliConfirmationProps> {
  trackTrigger?: SignupModalPressedTrigger
  enableRedirect: () => void
}

export const SignupGuardModal = ({
  show = false,
  label,
  title,
  description,
  primaryText,
  secondaryText,
  onPrimary,
  onDismiss,
  primaryButtonType,
  trackTrigger,
  enableRedirect,
  testID = 'login-guard-modal',
}: SignupGuardModalProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { props } = useConfirmationState()
  const { track } = useTracking()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const primaryHandler = useCallback(() => {
    if (trackTrigger) track(TrackingEvent.SignUpModalPressed(trackTrigger, 'signUp'))
    enableRedirect()
    navigate('/onboarding')

    const confirmPropagation = onPrimary?.()
    if (confirmPropagation !== false) {
      props.onPrimary?.()
    }
  }, [trackTrigger, track, enableRedirect, navigate, onPrimary, props])

  const dismissHandler = useCallback(() => {
    if (trackTrigger) track(TrackingEvent.SignUpModalPressed(trackTrigger, 'x'))
    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) props.onDismiss?.()
  }, [onDismiss, props, trackTrigger, track])

  const secondaryHandler = useCallback(() => {
    if (trackTrigger) track(TrackingEvent.SignUpModalPressed(trackTrigger, 'notNow'))
    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) props.onDismiss?.()
  }, [onDismiss, props, trackTrigger, track])

  return (
    <HoliConfirmation
      show={show}
      label={label || t('loginRedirect.title')}
      title={title || t('loginRedirect.title')}
      description={description || t('loginRedirect.text')}
      primaryText={primaryText || t('loginRedirect.btnConfirm')}
      secondaryText={secondaryText || t('loginRedirect.btnCancel')}
      onPrimary={primaryHandler}
      onDismiss={dismissHandler}
      onSecondary={secondaryHandler}
      primaryButtonType={primaryButtonType}
      testID={testID}
      footerComponent={
        <View style={styles.footerContainer}>
          <AlreadyHaveAccountText
            onPress={() => {
              enableRedirect()
              return dismissHandler()
            }}
            trackingEvent={
              trackTrigger
                ? TrackingEvent.SignUpModalPressed(trackTrigger, 'login')
                : TrackingEvent.Auth.LoginButtonPressed
            }
          />
        </View>
      }
    />
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    footerContainer: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: theme.colors.gray100,
    },
  })
