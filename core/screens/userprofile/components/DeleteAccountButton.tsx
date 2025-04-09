import { useMutation } from '@apollo/client'
import type React from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import {
  type DeleteAuthenticatedUserResponse,
  deleteAuthenticatedUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type DeleteAccountButtonProps = {
  style?: StyleProp<ViewStyle>
}

const DeleteAccountButton: React.VoidFunctionComponent<DeleteAccountButtonProps> = ({ style }) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { logout, isLoggingOut } = useLogout()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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
        <HoliIcon icon={Delete} colorOverride={colors.error30} />
        <HoliText style={[styles.text]}>{label}</HoliText>
      </HoliButton>
      <HoliConfirmation
        show={showConfirmationModal}
        label={confirmationTitle}
        title={confirmationTitle}
        primaryButtonVariant="danger"
        description={t('profile.settings.account.delete.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        secondaryText={t('profile.settings.account.delete.confirmation.dismiss')}
        primaryText={t('profile.settings.account.delete.confirmation.confirm')}
        testID="account-deletion-confirmation"
        onPrimary={() => {
          setShowConfirmationModal(false)
          deleteAuthenticatedUser()
        }}
      />

      {isLoggingOut && <HoliLoader />}
    </>
  )
}

export default DeleteAccountButton

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    buttonContent: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    text: {
      color: theme.colors.error30,
    },
  })
