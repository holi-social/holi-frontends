import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import {
  DeleteAuthenticatedUserResponse,
  deleteAuthenticatedUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'

export type DeleteAccountButtonProps = {
  style?: StyleProp<ViewStyle>
}

const DeleteAccountButton: React.VoidFunctionComponent<DeleteAccountButtonProps> = ({ style }) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { logout, isLoggingOut } = useLogout()
  const { displayError } = useErrorHandling()

  const [deleteAuthenticatedUser, { loading }] = useMutation<DeleteAuthenticatedUserResponse>(
    deleteAuthenticatedUserMutation,
    {
      onCompleted: () => logout({ skipLogoutFlow: true, message: t('profile.settings.account.delete.success') }),
      onError: (error) =>
        displayError(error, 'Failed to delete account', {
          displayMessage: t('profile.settings.account.delete.error'),
          location: 'DeleteAccountButton.deleteAuthenticatedUser',
        }),
    }
  )

  const label = t('profile.settings.account.delete')
  const confirmationTitle = t('profile.settings.account.delete.confirmation.title')
  return (
    <>
      <HoliButton
        label={label}
        inline
        transparent
        style={style}
        contentStyle={styles.buttonContent}
        disabled={loading}
        onPress={() => setShowConfirmationModal(true)}
        testID="btn-delete-account"
      >
        <HoliIcon icon={Delete} color={colors.error30} />
        <HoliText style={[styles.text]}>{label}</HoliText>
      </HoliButton>
      <HoliConfirmation
        show={showConfirmationModal}
        label={confirmationTitle}
        title={confirmationTitle}
        confirmationButtonType="warning"
        description={t('profile.settings.account.delete.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('profile.settings.account.delete.confirmation.dismiss')}
        confirmText={t('profile.settings.account.delete.confirmation.confirm')}
        testID="account-deletion-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          deleteAuthenticatedUser()
        }}
      />

      {isLoggingOut && <HoliLoader />}
    </>
  )
}

export default DeleteAccountButton

const styles = StyleSheet.create({
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    color: colors.error30,
  },
})
