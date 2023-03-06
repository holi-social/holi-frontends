import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { DeleteSpaceResponse, deleteSpaceMutation, mySpaceQuery } from '@holi/core/screens/spaces/queries'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

export interface DeleteSpaceButtonProps {
  spaceId: string
  onDelete: () => void
  style?: StyleProp<ViewStyle>
}

const DeleteSpaceButton: React.VoidFunctionComponent<DeleteSpaceButtonProps> = ({ spaceId, onDelete, style }) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [deleteSpace, { loading }] = useMutation<DeleteSpaceResponse>(deleteSpaceMutation, {
    variables: { id: spaceId },
    onCompleted: () => {
      openToast(t('spaces.delete.success'), HoliToastType.SUCCESS)
      onDelete()
    },
    onError: (error) => displayError(error, t('spaces.delete.error')),
    refetchQueries: [{ query: mySpaceQuery }],
  })

  const confirmationTitle = t('spaces.delete.confirmation.title')
  return (
    <>
      <MoreOptionItem
        icon="delete"
        label={t('spaces.delete.label')}
        onPress={() => setShowConfirmationModal(true)}
        tintColor={colors.error20}
        contentStyle={style}
        disabled={loading}
        testID="space-delete-btn"
      />
      <HoliConfirmation
        show={showConfirmationModal}
        label={confirmationTitle}
        title={confirmationTitle}
        confirmationButtonType="warning"
        description={t('spaces.delete.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('spaces.delete.confirmation.dismiss')}
        confirmText={t('spaces.delete.confirmation.confirm')}
        testID="space-delete"
        onConfirm={() => {
          setShowConfirmationModal(false)
          deleteSpace()
        }}
      />
    </>
  )
}

export default DeleteSpaceButton
