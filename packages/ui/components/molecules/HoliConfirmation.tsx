import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityProps, Modal, ModalProps, Platform, StyleSheet, View } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
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

  return (
    <Modal {...accessibilityProps} visible={visible} transparent animationType="fade" testID={testID}>
      <View style={styles.modalContainer}>
        <View style={styles.backdrop} {...(testID ? { testID: `${testID}-confirmation-backdrop` } : {})} />

        <View style={styles.modalView}>
          <HoliText bold>{title}</HoliText>
          <HoliText style={styles.description}>{description}</HoliText>
          <View style={styles.buttonContainer}>
            {onDismiss && (
              <HoliButton
                inline
                type="secondary"
                label={dismissText || t('confirmation.dismiss')}
                onPress={onDismiss}
                style={styles.button}
                {...(testID ? { testID: `${testID}-confirmation-dismiss` } : {})}
              >
                {dismissText || t('confirmation.dismiss')}
              </HoliButton>
            )}
            {onConfirm && (
              <HoliButton
                inline
                label={confirmText || t('confirmation.confirm')}
                onPress={onConfirm}
                style={styles.button}
                {...(testID ? { testID: `${testID}-confirmation-confirm` } : {})}
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
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    minWidth: 110,
  },
})
