import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliConfirmation, { HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'

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
  redirectPath,
  testID = 'login-guard-modal',
}: LoginGuardModalProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { props } = useConfirmationState()
  const pathname = usePathname()

  const confirmHandler = useCallback(() => {
    setPathToRedirect(redirectPath ?? pathname)
    navigate('/login')

    const confirmPropagation = onConfirm?.()
    if (confirmPropagation !== false) props.onConfirm?.()
  }, [navigate, onConfirm, pathname, props, redirectPath])

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
