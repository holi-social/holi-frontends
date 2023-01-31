import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliConfirmation, { HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'

export interface LoginGuardModalProps extends Partial<HoliConfirmationProps> {
  onConfirm?: () => boolean | void
  onDismiss?: () => boolean | void
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
  const { navigate } = useRouting()

  const confirmHandler = useCallback(() => {
    navigate('/login')
    return onConfirm?.()
  }, [navigate, onConfirm])

  return (
    <HoliConfirmation
      show={show}
      label={title || t('loginRedirect.title')}
      title={title || t('loginRedirect.title')}
      description={description || t('loginRedirect.text')}
      confirmText={confirmText || t('loginRedirect.btnConfirm')}
      dismissText={dismissText || t('global.decline')}
      onConfirm={confirmHandler}
      onDismiss={onDismiss}
      testID={testID}
    />
  )
}
