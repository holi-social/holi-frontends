import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliConfirmation, { HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'

export interface LoginGuardModalProps extends Partial<HoliConfirmationProps> {
  onConfirm?: () => boolean | void
  onDismiss?: () => boolean | void
}

export const useLoginGuardModalState = ({ onConfirm, onDismiss, ...otherProps }: LoginGuardModalProps = {}) => {
  const { navigate } = useRouting()
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  const confirmHandler = useCallback(() => {
    const confirmPropagation = onConfirm?.()
    if (confirmPropagation !== false) {
      setDialogIsOpen(false)
      navigate?.('/login')
    }
  }, [navigate, onConfirm])

  const dismissHandler = useCallback(() => {
    const confirmPropagation = onDismiss?.()
    if (confirmPropagation !== false) {
      setDialogIsOpen(false)
    }
  }, [onDismiss])

  return {
    setShow: setDialogIsOpen,
    props: {
      ...otherProps,
      show: dialogIsOpen,
      onConfirm: confirmHandler,
      onDismiss: dismissHandler,
    },
  }
}

export const LoginGuardModal: React.VFC<LoginGuardModalProps> = ({
  show = false,
  title,
  description,
  confirmText,
  dismissText,
  onConfirm,
  onDismiss,
  testID = 'login-guard-modal',
}) => {
  const { t } = useTranslation()

  return (
    <HoliConfirmation
      show={show}
      label={title || t('loginRedirect.title')}
      title={title || t('loginRedirect.title')}
      description={description || t('loginRedirect.text')}
      confirmText={confirmText || t('loginRedirect.btnConfirm')}
      dismissText={dismissText || t('global.decline')}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
      testID={testID}
    />
  )
}
