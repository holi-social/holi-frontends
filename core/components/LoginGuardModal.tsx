import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliConfirmation, { HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type LoginGuardModalProps = Partial<HoliConfirmationProps>

export const LoginGuardModal = ({
  show = false,
  label,
  title,
  description,
  confirmText,
  dismissText,
  onConfirm,
  onDismiss,
  confirmationButtonType,
  testID = 'login-guard-modal',
}: LoginGuardModalProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { props } = useConfirmationState()
  const pathname = usePathname()
  const { track } = useTracking()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const confirmHandler = useCallback(() => {
    track(TrackingEvent.Auth.LoginButtonPressed)
    setPathToRedirect(pathname)
    navigate('/onboarding/registration')

    const confirmPropagation = onConfirm?.()
    if (confirmPropagation !== false) props.onConfirm?.()
  }, [navigate, onConfirm, pathname, props, track])

  const dismissHandler = useCallback(() => {
    track(TrackingEvent.Auth.CloseLoginModalButtonPressed)

    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) props.onDismiss?.()
  }, [onDismiss, props, track])

  return (
    <HoliConfirmation
      show={show}
      label={label || t('loginRedirect.title')}
      title={title || t('loginRedirect.title')}
      description={description || t('loginRedirect.text')}
      confirmText={confirmText || t('loginRedirect.btnConfirm')}
      dismissText={dismissText || t('loginRedirect.btnCancel')}
      onConfirm={confirmHandler}
      onDismiss={dismissHandler}
      confirmationButtonType={confirmationButtonType}
      testID={testID}
      footerComponent={
        <View style={styles.footerContainer}>
          <AlreadyHaveAccountText onPress={dismissHandler} trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
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
