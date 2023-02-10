import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import { useLogout } from '@holi/core/helpers'
import {
  DeleteAuthenticatedUserResponse,
  deleteAuthenticatedUserMutation,
} from '@holi/core/screens/userprofile/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

export type DeleteAccountButtonProps = {
  style?: StyleProp<ViewStyle>
}

const DeleteAccountButton: React.VoidFunctionComponent<DeleteAccountButtonProps> = ({ style }) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { openToast } = useToast()
  const logout = useLogout()

  const [deleteAuthenticatedUser, { loading, error }] = useMutation<DeleteAuthenticatedUserResponse>(
    deleteAuthenticatedUserMutation,
    {
      onCompleted: () => logout({ skipLogoutFlow: true, message: t('profile.settings.account.delete.success') }),
      onError: () => openToast(t('global.technicalError'), HoliToastType.ERROR),
    }
  )
  if (error) {
    displayError(error, t('profile.settings.account.delete.error'))
  }
  const label = t('profile.settings.account.delete')
  const confirmationTitle = t('profile.settings.account.delete.confirmation.title')
  return (
    <>
      <HoliButton
        label={label}
        inline
        transparent
        style={style}
        disabled={loading}
        onPress={() => setShowConfirmationModal(true)}
      >
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
    </>
  )
}

export default DeleteAccountButton

const styles = StyleSheet.create({
  text: {
    color: colors.error30,
  },
})
