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

type UserConnectionButtonProps = {
  user: User
  fullName: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const UserConnectionButton: React.VFC<UserConnectionButtonProps> = ({ user, fullName, style }) => {
  const [updateConnectionWithUser, { loading, error }] = useMutation<UpdateConnectionWithUserResponse>(
    updateConnectionWithUserMutation,
    { onCompleted: () => setShowConfirmation(false) }
  )
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { t } = useTranslation()

  if (error) {
    displayError(error, t('user.profileView.connection.error'))
  }

  // when not logged in, user has connectionStatusToMyself as null
  const connectionStatusToMyself = user.connectionStatusToMyself || UserConnectionStatus.NOT_LOGGED_IN

  const updateUserConnectionStatus = () => {
    updateConnectionWithUser({
      variables: {
        input: {
          userId: user.id,
          action:
            connectionStatusToMyself === UserConnectionStatus.NOT_CONNECTED ||
            connectionStatusToMyself === UserConnectionStatus.PENDING_CONFIRMATION
              ? UpdateConnectionWithUserActions.CONNECT
              : UpdateConnectionWithUserActions.DISCONNECT,
        },
      },
    })
  }

  const onPress = () => {
    if (
      connectionStatusToMyself !== UserConnectionStatus.NOT_CONNECTED &&
      connectionStatusToMyself !== UserConnectionStatus.PENDING_CONFIRMATION
    ) {
      setShowConfirmation(true)
    } else {
      updateUserConnectionStatus()
    }
  }

  return (
    <>
      <HoliButton
        inline
        label={t(`user.profileView.connection.button.${connectionStatusToMyself}`)}
        style={style}
        onPress={onPress}
        disabled={loading}
      >
        {t(`user.profileView.connection.button.${connectionStatusToMyself}`)}
      </HoliButton>
      <HoliConfirmation
        show={showConfirmation}
        label={t(`user.profileView.connection.confirmation.title.${connectionStatusToMyself}`)}
        title={t(`user.profileView.connection.confirmation.title.${connectionStatusToMyself}`)}
        description={t(`user.profileView.connection.confirmation.description.${connectionStatusToMyself}`, {
          fullName,
        })}
        onDismiss={() => setShowConfirmation(false)}
        dismissText={t(`user.profileView.connection.confirmation.dismiss.${connectionStatusToMyself}`)}
        confirmText={t(`user.profileView.connection.confirmation.confirm.${connectionStatusToMyself}`)}
        {...(connectionStatusToMyself !== 'NOT_LOGGED_IN' ? { onConfirm: updateUserConnectionStatus } : {})}
      />
    </>
  )
}

export default UserConnectionButton
