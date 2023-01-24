import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'

export type DeleteAccountButtonProps = {
  style?: StyleProp<ViewStyle>
}

const DeleteAccountButton: React.VoidFunctionComponent<DeleteAccountButtonProps> = ({ style }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()
  const { t } = useTranslation()
  const label = t('profile.settings.account.delete')
  const confirmationTitle = t('profile.settings.account.delete.confirmation.title')
  return (
    <>
      <HoliButton label={label} inline transparent style={style} onPress={() => setShowConfirmationModal(true)}>
        <HoliText style={[styles.text]}>{label}</HoliText>
      </HoliButton>
      <HoliConfirmation
        show={showConfirmationModal}
        label={confirmationTitle}
        title={confirmationTitle}
        confirmationType="danger"
        description={t('profile.settings.account.delete.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('profile.settings.account.delete.confirmation.dismiss')}
        confirmText={t('profile.settings.account.delete.confirmation.confirm')}
        testID="account-deletion-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          showFeatureNotImplementedToast()
        }}
      />
    </>
  )
}

export default DeleteAccountButton

const styles = StyleSheet.create({
  text: {
    color: colors.errorRed,
  },
})
