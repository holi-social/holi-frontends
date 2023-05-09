import React, { useCallback, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
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

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, { HoliButtonType } from '@holi/ui/components/molecules/HoliButton'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import { colors, vars } from '@holi/ui/styles/globalVars'

export interface UseConfirmation {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  props: UseConfirmationProps
}

export interface UseConfirmationProps {
  show: boolean
  onConfirm: () => void
  onDismiss: () => void
}

export interface HoliConfirmationProps extends ModalProps {
  show: boolean
  label: string
  title: string
  description: string
  confirmationButtonType?: HoliButtonType
  onConfirm?: () => boolean | void
  onDismiss?: () => boolean | void
  confirmText?: string
  dismissText?: string
  testID?: string
}

export const useConfirmationState = ({
  show = false,
  onConfirm,
  onDismiss,
}: Partial<Pick<HoliConfirmationProps, 'show' | 'onConfirm' | 'onDismiss'>> = {}) => {
  const [visible, setVisible] = useState(show)

  const confirmHandler = useCallback(() => {
    const confirmPropagation = onConfirm?.()
    if (confirmPropagation !== false) {
      setVisible(false)
    }
  }, [onConfirm])

  const dismissHandler = useCallback(() => {
    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) {
      setVisible(false)
    }
  }, [onDismiss])

  return {
    show: visible,
    setShow: setVisible,
    props: {
      show: visible,
      onConfirm: confirmHandler,
      onDismiss: dismissHandler,
    },
  }
}

const HoliConfirmation: React.VFC<HoliConfirmationProps> = ({
  show = false,
  label,
  title,
  description,
  confirmationButtonType = 'primary',
  onConfirm,
  onDismiss,
  confirmText,
  dismissText,
  testID = 'holi',
}) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const smallDeviceWidth = parseInt(vars.breakpointXs, 10) + 50
  const isSmallDevice = screenWidth <= smallDeviceWidth

  const styles = createStyles(screenWidth, smallDeviceWidth, isSmallDevice)

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { accessibilityModal: true } : {}),
    accessibilityLabel: label,
  }

  return (
    <ModalBasic
      label=""
      {...accessibilityProps}
      show={show}
      transparent
      animationType="fade"
      testID={`${testID}-confirmation-dialog`}
    >
      <View style={styles.modalContainer}>
        <Pressable onPress={onDismiss} style={styles.backdrop} testID={`${testID}-confirmation-backdrop`} />

        <View style={styles.modalView}>
          <HoliHeading level="4" size="small">
            {title}
          </HoliHeading>
          <HoliText style={styles.description}>{description}</HoliText>
          <View style={styles.buttonContainer}>
            {onDismiss && (
              <HoliButton
                inline
                type="secondary"
                label={dismissText || t('confirmation.dismiss')}
                onPress={onDismiss}
                style={styles.button}
                testID={`${testID}-confirmation-dismiss`}
              >
                {dismissText || t('confirmation.dismiss')}
              </HoliButton>
            )}
            {onConfirm && (
              <HoliButton
                inline
                label={confirmText || t('confirmation.confirm')}
                onPress={onConfirm}
                type={confirmationButtonType}
                style={styles.button}
                testID={`${testID}-confirmation-confirm`}
              >
                {confirmText || t('confirmation.confirm')}
              </HoliButton>
            )}
          </View>
        </View>
      </View>
    </ModalBasic>
  )
}

export default HoliConfirmation

const createStyles = (screenWidth: number, smallDeviceWidth: number, isSmallDevice: boolean) =>
  StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      flex: 1,
    },
    backdrop: {
      opacity: 0.4,
      backgroundColor: colors.foreground30,
      ...StyleSheet.absoluteFillObject,
    },
    modalView: {
      maxWidth: 460,
      padding: 24,
      margin: 25,
      alignSelf: 'center',
      backgroundColor: colors.background10,
      borderWidth: 2,
      borderRadius: 24,
      borderColor: colors.foreground30,
      shadowColor: colors.foreground30,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      ...(isSmallDevice ? { minWidth: screenWidth * 0.9 } : { minWidth: smallDeviceWidth }),
    },
    description: {
      marginTop: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginTop: 24,
      gap: 14,
    },
    button: {
      flex: 1,
      minWidth: 120,
      paddingHorizontal: 14,
    },
  })
