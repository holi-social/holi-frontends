import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import {
  UpdateConnectionWithUserResponse,
  updateConnectionWithUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { UpdateConnectionWithUserActions, User, UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

type UserConnectionButtonsProps = {
  user: User
  fullName: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const UserConnectionButtons: React.VFC<UserConnectionButtonsProps> = ({ user, fullName, style }) => {
  const [updateConnectionWithUser, { loading, error }] = useMutation<UpdateConnectionWithUserResponse>(
    updateConnectionWithUserMutation
  )
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { t } = useTranslation()

  if (error) {
    displayError(error, t('user.profileView.connection.error'))
  }

  // when not logged in, user has connectionStatusToMyself as null
  const connectionStatusToMyself = user.connectionStatusToMyself || UserConnectionStatus.NOT_LOGGED_IN

  const updateUserConnectionStatus = (action: UpdateConnectionWithUserActions) => {
    updateConnectionWithUser({
      variables: {
        input: {
          userId: user.id,
          action,
        },
      },
    })
  }

  const onPrimaryPress = () => {
    if (
      connectionStatusToMyself === UserConnectionStatus.NOT_CONNECTED ||
      connectionStatusToMyself === UserConnectionStatus.PENDING_CONFIRMATION
    ) {
      updateUserConnectionStatus(UpdateConnectionWithUserActions.CONNECT)
    } else {
      setShowConfirmationModal(true)
    }
  }

  return (
    <>
      <HoliButton
        inline
        label={t(`user.profileView.connection.button.${connectionStatusToMyself}`)}
        style={style}
        onPress={onPrimaryPress}
        disabled={loading}
        testID={`user-connection-button-${connectionStatusToMyself}`}
      >
        {t(`user.profileView.connection.button.${connectionStatusToMyself}`)}
      </HoliButton>

      {connectionStatusToMyself === UserConnectionStatus.PENDING_CONFIRMATION && (
        <HoliButton
          inline
          type="secondary"
          label={t('user.profileView.connection.button.IGNORE')}
          style={style}
          onPress={() => updateUserConnectionStatus(UpdateConnectionWithUserActions.DISCONNECT)}
          disabled={loading}
          testID={'user-connection-button-ignore'}
        >
          {t('user.profileView.connection.button.IGNORE')}
        </HoliButton>
      )}

      <HoliConfirmation
        show={showConfirmationModal}
        label={t(`user.profileView.connection.confirmation.title.${connectionStatusToMyself}`)}
        title={t(`user.profileView.connection.confirmation.title.${connectionStatusToMyself}`)}
        description={t(`user.profileView.connection.confirmation.description.${connectionStatusToMyself}`, {
          fullName,
        })}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t(`user.profileView.connection.confirmation.dismiss.${connectionStatusToMyself}`)}
        confirmText={t(`user.profileView.connection.confirmation.confirm.${connectionStatusToMyself}`)}
        testID="user-connection"
        // onConfirm needs to be null if not logged in to hide the confirm button inside the dialog
        {...(connectionStatusToMyself !== UserConnectionStatus.NOT_LOGGED_IN
          ? {
              onConfirm: () => {
                setShowConfirmationModal(false)
                updateUserConnectionStatus(UpdateConnectionWithUserActions.DISCONNECT)
              },
            }
          : {})}
      />
    </>
  )
}

export default UserConnectionButtons
