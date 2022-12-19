import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, ViewStyle } from 'react-native'

import HoliIcon from '@holi//ui/components/atoms/HoliIcon'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { displayError } from '@holi/core/errors/helpers'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import {
  UpdateConnectionWithUserResponse,
  updateConnectionWithUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { UpdateConnectionWithUserActions, User, UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

type UserConnectionButtonsProps = {
  user: User
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const UserConnectionButtons: React.VFC<UserConnectionButtonsProps> = ({ user, style }) => {
  const { isLoggedIn } = useContext(AuthContext)
  const { openLoginDialog } = useLoginRedirect()
  const [updateConnectionWithUser, { loading, error }] = useMutation<UpdateConnectionWithUserResponse>(
    updateConnectionWithUserMutation
  )
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { t } = useTranslation()

  if (error) {
    displayError(error, t('user.profileView.connection.error'))
  }

  const connectionStatusToMyself = user.connectionStatusToMyself || UserConnectionStatus.NOT_CONNECTED
  const connectionRequested = connectionStatusToMyself === UserConnectionStatus.REQUESTED

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
    if (!isLoggedIn)
      return openLoginDialog({
        text: t('user.profileView.connection.notLoggedIn.message'),
      })

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
        type={connectionRequested ? 'secondary' : 'primary'}
        inline
        label={t(`user.profileView.connection.button.${connectionStatusToMyself}`)}
        style={style}
        onPress={onPrimaryPress}
        disabled={loading}
        testID={`user-connection-button-${connectionStatusToMyself}`}
      >
        <HoliText>{t(`user.profileView.connection.button.${connectionStatusToMyself}`)}</HoliText>
        {connectionRequested && <HoliIcon icon="time" size={19} style={styles.requestedStatusButtonIcon} />}
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
          name: user.fullName,
        })}
        onConfirm={() => {
          setShowConfirmationModal(false)
          updateUserConnectionStatus(UpdateConnectionWithUserActions.DISCONNECT)
        }}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t(`user.profileView.connection.confirmation.dismiss.${connectionStatusToMyself}`)}
        confirmText={t(`user.profileView.connection.confirmation.confirm.${connectionStatusToMyself}`)}
        testID="user-connection"
      />
    </>
  )
}

export default UserConnectionButtons

const styles = StyleSheet.create({
  requestedStatusButtonIcon: {
    marginLeft: 4,
  },
})
