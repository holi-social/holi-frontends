import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AccessibilityProps,
  ModalProps,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'

import { connectionTypes } from '@holi/core/screens/notifications/connectionTypes'
import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type Type = 'default' | 'challenges' | 'connection' | 'spaces'

interface NotificationOptInModalProps extends ModalProps {
  isVisible: boolean
  description: string
  type: Type
  image?: HoliImageInfo | null
  onConfirm?: () => void
  onDismiss?: () => void
  confirmText?: string
  dismissText?: string
  testID?: string
}

const NotificationOptInModal: React.FC<NotificationOptInModalProps> = ({
  isVisible,
  image,
  description,
  type,
  onConfirm,
  onDismiss,
  confirmText,
  dismissText,
  testID = 'notification-opt-in',
}) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const smallDeviceWidth = dimensions.breakpointXs + 50
  const isSmallDevice = screenWidth <= smallDeviceWidth
  const { theme } = useTheme()
  const styles = useMemo(
    () => getStyles(screenWidth, smallDeviceWidth, isSmallDevice, theme),
    [screenWidth, smallDeviceWidth, isSmallDevice, theme]
  )

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { 'aria-modal': true } : {}),
    'aria-label': description,
  }

  const currentConnection = connectionTypes.find((conn) => conn.type === type)

  return (
    <ModalBasic
      label=""
      {...accessibilityProps}
      show={isVisible}
      transparent
      animationType="fade"
      testID={`${testID}-modal`}
    >
      <View style={styles.modalContainer}>
        <Pressable onPress={onDismiss} style={styles.backdrop} testID={`${testID}-backdrop`} />
        <View style={styles.modalView}>
          <View style={styles.topContent}>
            {image ? (
              <HoliImage source={image} resizeMode="contain" style={styles.image} label={''} />
            ) : (
              <HoliLocalImage
                imageSource={currentConnection?.imagePath}
                resizeMode="contain"
                width={72}
                height={72}
                label={t(`notifications.permission.${type}.headline`)}
              />
            )}
            <HoliText style={styles.description} align="center" size="large" testID={`${testID}-description`}>
              {description}
            </HoliText>
          </View>
          <View style={styles.buttonContainer}>
            {onConfirm && (
              <HoliButton
                inline
                label={confirmText || t('notifications.permission.button.confirm')}
                onPress={onConfirm}
                type="primary"
                style={[styles.button, { backgroundColor: theme.colors.brandColorA20 }]}
                testID={`${testID}-confirm`}
              >
                <HoliText>{confirmText || t('notifications.permission.button.confirm')}</HoliText>
              </HoliButton>
            )}
            {onDismiss && (
              <HoliButton
                inline
                type="secondary"
                label={dismissText || t('notifications.permission.button.dismiss')}
                onPress={onDismiss}
                style={styles.button}
                testID={`${testID}-dismiss`}
              >
                <HoliText>{dismissText || t('notifications.permission.button.dismiss')}</HoliText>
              </HoliButton>
            )}
          </View>
        </View>
      </View>
    </ModalBasic>
  )
}

export default NotificationOptInModal

const getStyles = (screenWidth: number, smallDeviceWidth: number, isSmallDevice: boolean, theme: HoliTheme) =>
  StyleSheet.create({
    topContent: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
    },
    modalContainer: {
      justifyContent: 'center',
      flex: 1,
    },
    backdrop: {
      opacity: 0.4,
      backgroundColor: theme.colors.backdropBackground,
      ...StyleSheet.absoluteFillObject,
    },
    modalView: {
      maxWidth: 400,
      margin: Spacing.md,
      alignSelf: 'center',
      backgroundColor: theme.colors.background10,
      borderWidth: 1,
      borderRadius: Spacing.md,
      borderColor: theme.colors.foreground30,
      ...(isSmallDevice ? { minWidth: screenWidth * 0.7 } : { minWidth: smallDeviceWidth }),
    },
    description: {
      marginTop: 12,
    },
    buttonContainer: {
      padding: Spacing.md,
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 14,
    },
    button: {
      minWidth: 120,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
    },
    image: {
      width: 72,
      height: 72,
    },
  })
