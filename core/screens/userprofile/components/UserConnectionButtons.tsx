import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, ViewStyle } from 'react-native'

import HoliIcon from '@holi//ui/components/atoms/HoliIcon'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { displayError } from '@holi/core/errors/helpers'
import { useUserConnection } from '@holi/core/helpers'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { User, UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

type UserConnectionButtonsProps = {
  user: User
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const UserConnectionButtons: React.VFC<UserConnectionButtonsProps> = ({ user, style }) => {
  const { connect, disconnect, error, loading } = useUserConnection()
  const { isLoggedIn } = useContext(AuthContext)
  const { openLoginDialog } = useLoginRedirect()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { t } = useTranslation()

  if (error) {
    displayError(error, t('user.profileView.connection.error'))
  }

  const connectionStatusToMyself = user.connectionStatusToMyself || UserConnectionStatus.NOT_CONNECTED
  const connectionRequested = connectionStatusToMyself === UserConnectionStatus.REQUESTED

  const onPrimaryPress = () => {
    if (!isLoggedIn)
      return openLoginDialog({
        text: t('user.profileView.connection.notLoggedIn.message'),
      })

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
          onPress={() => disconnect(user.id)}
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
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t(`user.profileView.connection.confirmation.dismiss.${connectionStatusToMyself}`)}
        confirmText={t(`user.profileView.connection.confirmation.confirm.${connectionStatusToMyself}`)}
        testID="user-connection"
        // onConfirm needs to be undefined if not logged in to hide the confirm button inside the dialog
        onConfirm={
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

const styles = StyleSheet.create({
  requestedStatusButtonIcon: {
    marginLeft: 4,
  },
})
