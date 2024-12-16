import React from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { SignupGuardModal } from '@holi/core/components/SignupGuardModal'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

import { useActionContext } from './Action'
import { useActionDrawerContext } from './Drawer'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import type { ButtonVariant } from 'holi-bricks/components/button'

interface Props {
  description: string
  title: string
  handleConfirmation: () => void
  hasDismissBtn?: boolean
  dismissText?: string
  confirmText?: string
  testID?: string
  buttonVariant?: ButtonVariant
  requireLogin?: boolean
}

export const Confirmation = ({
  confirmText,
  description,
  hasDismissBtn,
  dismissText,
  handleConfirmation,
  title,
  testID,
  buttonVariant = 'primary',
  requireLogin,
}: Props) => {
  const { t } = useTranslation()

  const { isLoggedIn } = useLoggedInUser()
  const { hideDrawer } = useActionDrawerContext()
  const { isVisibleConfirmation, setShowConfirmation, confirmationProps } = useActionContext()
  const pathname = usePathname()

  const enableRedirect = () => setPathToRedirect(pathname)

  const handleAction = () => {
    handleConfirmation()
    setShowConfirmation(false)
    hideDrawer()
  }

  const handleDismiss = hasDismissBtn ? () => setShowConfirmation(false) : undefined

  return (
    <>
      {requireLogin && !isLoggedIn ? (
        <SignupGuardModal enableRedirect={enableRedirect} {...confirmationProps} />
      ) : (
        <HoliConfirmation
          show={isVisibleConfirmation}
          label={title}
          title={title}
          description={description}
          onDismiss={handleDismiss}
          secondaryText={dismissText ?? t('confirmation.dismiss')}
          primaryText={confirmText ?? t('confirmation.confirm')}
          testID={testID}
          onPrimary={handleAction}
          primaryButtonVariant={buttonVariant}
        />
      )}
    </>
  )
}
