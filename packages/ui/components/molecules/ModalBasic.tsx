import React, { useEffect, useRef } from 'react'
import { Modal, ModalProps, Platform } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { useTheme } from '@holi/ui/styles/theme'

export type ModalBasicProps = ModalProps & {
  show: boolean
  onDismiss?: () => void
  testID?: string
  label: string
}

const ModalBasic: React.FC<ModalBasicProps> = ({ show, onDismiss, testID, label, children, ...nativeModalProps }) => {
  const { setModalIsOpen } = useTheme()
  const { current: modalId } = useRef(Math.random().toString())

  useEffect(() => {
    setModalIsOpen(modalId, show)
  }, [show, setModalIsOpen, modalId])

  const accessibilityProps: AccessibilityPropsWeb = {
    ...(Platform.OS === 'web'
      ? {
          role: 'dialog',
          'aria-modal': true,
          'aria-label': label,
        }
      : {
          accessibilityViewIsModal: true,
          accessibilityLabel: label,
        }),
  }

  return (
    <Modal
      {...accessibilityProps}
      visible={show}
      animationType="none"
      onRequestClose={onDismiss}
      testID={testID}
      {...nativeModalProps}
    >
      {children}
    </Modal>
  )
}

export default ModalBasic
