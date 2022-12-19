import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AccessibilityProps,
  Modal,
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
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliConfirmationProps = ModalProps & {
  show: boolean
  label: string
  title: string
  description: string
  onConfirm?: () => void
  onDismiss?: () => void
  confirmText?: string
  dismissText?: string
  testID?: string
}

const HoliConfirmation: React.VFC<HoliConfirmationProps> = ({
  show = false,
  label,
  title,
  description,
  onConfirm,
  onDismiss,
  confirmText,
  dismissText,
  testID,
}) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(show)
  const { setModalIsOpen } = useTheme()
  const { width: screenWidth } = useWindowDimensions()

  const setModalOpen = useCallback(
    (isOpen: boolean) => {
      setVisible(isOpen)
      setModalIsOpen(isOpen)
    },
    [setVisible, setModalIsOpen]
  )

  useEffect(() => {
    setModalOpen(show)
  }, [show, setModalOpen])

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { accessibilityModal: true } : {}),
    accessibilityLabel: label,
  }

  const smallDevice = parseInt(vars.breakpointXs, 10) + 50

  return (
    <Modal
      {...accessibilityProps}
      visible={visible}
      transparent
      animationType="fade"
      {...(testID ? { testID: `${testID}-confirmation-dialog` } : {})}
    >
      <View style={styles.modalContainer}>
        <Pressable
          onPress={onDismiss}
          style={styles.backdrop}
          {...(testID ? { testID: `${testID}-confirmation-backdrop` } : {})}
        />

        <View style={styles.modalView}>
          <HoliHeading level="4" size="small">
            {title}
          </HoliHeading>
          <HoliText style={styles.description}>{description}</HoliText>
          <View style={[styles.buttonContainer, screenWidth <= smallDevice && styles.buttonContainerSmall]}>
            {onDismiss && (
              <HoliButton
                inline
                type="secondary"
                label={dismissText || t('confirmation.dismiss')}
                onPress={onDismiss}
                style={styles.button}
                testID={testID ?? `${testID}-confirmation-dismiss`}
              >
                {dismissText || t('confirmation.dismiss')}
              </HoliButton>
            )}
            {onConfirm && (
              <HoliButton
                inline
                label={confirmText || t('confirmation.confirm')}
                onPress={onConfirm}
                style={[styles.button, { marginLeft: screenWidth <= smallDevice ? 0 : 5 }]}
                testID={testID ?? `${testID}-confirmation-confirm`}
              >
                {confirmText || t('confirmation.confirm')}
              </HoliButton>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default HoliConfirmation

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  backdrop: {
    opacity: 0.4,
    backgroundColor: colors.backgroundColorBlack,
    ...StyleSheet.absoluteFillObject,
  },
  modalView: {
    maxWidth: 460,
    padding: 24,
    margin: 25,
    alignSelf: 'center',
    backgroundColor: colors.backgroundColor,
    borderWidth: 2,
    borderRadius: 24,
    borderColor: colors.shadowColorBlack,
    shadowColor: colors.shadowColorBlack,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  description: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  buttonContainerSmall: {
    marginLeft: -14,
    marginRight: -14,
  },
  button: {
    marginTop: 24,
  },
})
