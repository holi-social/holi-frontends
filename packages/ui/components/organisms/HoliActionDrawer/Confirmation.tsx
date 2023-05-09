import React from 'react'
import { useTranslation } from 'react-i18next'

import { LoginGuardModal } from '@holi/core/components/LoginGuardModal'
import type { HoliButtonType } from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

import { useActionContext } from './Action'
import { useActionDrawerContext } from './Drawer'

interface Props {
  description: string
  title: string
  handleConfirmation: () => void
  hasDismissBtn?: boolean
  confirmText?: string
  testID?: string
  buttonType?: HoliButtonType
}

export const Confirmation = ({
  confirmText,
  description,
  hasDismissBtn,
  handleConfirmation,
  title,
  testID,
  buttonType = 'primary',
}: Props) => {
  const { t } = useTranslation()

  const { isLoggedIn, hideDrawer } = useActionDrawerContext()
  const { isVisibleConfirmation, setShowConfirmation, confirmationProps } = useActionContext()

  const handleAction = () => {
    handleConfirmation()
    setShowConfirmation(false)
    hideDrawer()
  }

  const handleDismiss = hasDismissBtn ? () => setShowConfirmation(false) : undefined

  return (
    <>
      {isLoggedIn ? (
        <HoliConfirmation
          show={isVisibleConfirmation}
          label={title}
          title={title}
          description={description}
          onDismiss={handleDismiss}
          dismissText={t('confirmation.dismiss')}
          confirmText={confirmText ?? t('confirmation.confirm')}
          testID={testID}
          onConfirm={handleAction}
          confirmationButtonType={buttonType}
        />
      ) : (
        <LoginGuardModal {...confirmationProps} />
      )}
    </>
  )
}
