import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliButtonType } from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'

export interface LoginGuardModalProps {
  show?: boolean
  label?: string
  title?: string
  description?: string
  confirmText?: string
  dismissText?: string
  onConfirm?: () => boolean | void
  onDismiss?: () => boolean | void
  confirmationButtonType?: HoliButtonType
  testID?: string
}

export const LoginGuardModal: React.VFC<LoginGuardModalProps> = ({
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
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { props } = useConfirmationState()

  const confirmHandler = useCallback(() => {
    navigate('/login', { redirectAfterLogin: true })
    const confirmPropagation = onConfirm?.()
    if (confirmPropagation !== false) props.onConfirm?.()
  }, [navigate, onConfirm, props])

  const dismissHandler = useCallback(() => {
    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) props.onDismiss?.()
  }, [onDismiss, props])

  return (
    <HoliConfirmation
      show={show}
      label={label || t('loginRedirect.title')}
      title={title || t('loginRedirect.title')}
      description={description || t('loginRedirect.text')}
      confirmText={confirmText || t('loginRedirect.btnConfirm')}
      dismissText={dismissText || t('global.decline')}
      onConfirm={confirmHandler}
      onDismiss={dismissHandler}
      confirmationButtonType={confirmationButtonType}
      testID={testID}
    />
  )
}
