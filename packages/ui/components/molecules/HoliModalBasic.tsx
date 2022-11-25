import React, { useEffect } from 'react'
import { AccessibilityProps, Modal, ModalProps, Platform } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliModalBasicProps = ModalProps & {
  show: boolean
  onDismiss: () => void
  testID?: string
  label: string
}

const HoliModalBasic: React.FC<HoliModalBasicProps> = ({
  show,
  onDismiss,
  testID,
  label,
  children,
  ...nativeModalProps
}) => {
  const { setModalIsOpen } = useTheme()

  useEffect(() => {
    setModalIsOpen(show)
  }, [show, setModalIsOpen])

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { accessibilityModal: true } : {}),
    accessibilityLabel: label,
  }

  return (
    <>
      <Modal
        {...accessibilityProps}
        visible={show}
        animationType="fade"
        onRequestClose={onDismiss}
        testID={testID}
        {...nativeModalProps}
      >
        {children}
      </Modal>
    </>
  )
}

export default HoliModalBasic
