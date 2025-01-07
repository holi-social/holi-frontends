import type React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import type { User } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useUserConnection } from '@holi/core/helpers'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import { Time } from '@holi/icons/src/generated'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { Button } from 'holi-bricks/components/button'

type UserConnectionButtonsProps = {
  user: User
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const UserConnectionButtons: React.FC<UserConnectionButtonsProps> = ({ user }) => {
  const { connect, disconnect, error, loading } = useUserConnection()
  const { isLoggedIn } = useLoggedInUser()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const { openSignupModal } = useSignupModal()

  useEffect(() => {
    if (error) {
      displayError(error, 'Failed to update user connection', {
        location: 'UserConnectionButtons.useEffect',
      })
    }
  }, [error, displayError])

  const connectionStatusToMyself = user.connectionStatusToMyself || UserConnectionStatus.NOT_CONNECTED
  const connectionRequested = connectionStatusToMyself === UserConnectionStatus.REQUESTED

  const onPrimaryPress = () => {
    if (!isLoggedIn) {
      return openSignupModal({
        description: t('user.profileView.connection.loginRedirect.text', { firstName: user.firstName }),
        trackTrigger: 'CONNECT_TO_USER',
      })
    }

    if (
      connectionStatusToMyself === UserConnectionStatus.NOT_CONNECTED ||
      connectionStatusToMyself === UserConnectionStatus.PENDING_CONFIRMATION
    ) {
      connect(user.id)
    } else {
      setShowConfirmationModal(true)
    }
  }

  return (
    <>
      <Button
        variant={connectionRequested ? 'secondary' : 'primary'}
        inline
        label={t(`user.profileView.connection.button.${connectionStatusToMyself}`)}
        onPress={onPrimaryPress}
        disabled={loading}
        testID={`user-connection-button-${connectionStatusToMyself}`}
        icon={connectionRequested ? Time : undefined}
      />

      {connectionStatusToMyself === UserConnectionStatus.PENDING_CONFIRMATION && (
        <Button
          inline
          variant="secondary"
          label={t('user.profileView.connection.button.IGNORE')}
          onPress={() => disconnect(user.id)}
          disabled={loading}
          testID={'user-connection-button-ignore'}
        />
      )}

      <HoliConfirmation
        show={showConfirmationModal}
        label={t(`user.profileView.connection.confirmation.title.${connectionStatusToMyself}`)}
        title={t(`user.profileView.connection.confirmation.title.${connectionStatusToMyself}`)}
        description={t(`user.profileView.connection.confirmation.description.${connectionStatusToMyself}`, {
          name: user.fullName,
        })}
        onDismiss={() => setShowConfirmationModal(false)}
        secondaryText={t(`user.profileView.connection.confirmation.dismiss.${connectionStatusToMyself}`)}
        primaryText={t(`user.profileView.connection.confirmation.confirm.${connectionStatusToMyself}`)}
        primaryButtonVariant="danger"
        testID="user-connection"
        // onConfirm needs to be undefined if not logged in to hide the confirm button inside the dialog
        onPrimary={
          isLoggedIn
            ? () => {
                setShowConfirmationModal(false)
                disconnect(user.id)
              }
            : undefined
        }
      />
    </>
  )
}

export default UserConnectionButtons
