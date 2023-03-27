import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  DeleteCollaborationToolResponse,
  deleteCollaborationToolMutation,
  spaceByIdQuery,
} from '@holi/core/screens/spaces/queries'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

export interface DeleteCollaborationToolButtonProps {
  toolId: string
  spaceIdOrName: string
  onDelete: () => void
  style?: StyleProp<ViewStyle>
}

export type AddDigitalToolParams = {
  spaceIdOrName: string
}

const DeleteCollaborationToolButton: React.VoidFunctionComponent<DeleteCollaborationToolButtonProps> = ({
  toolId,
  spaceIdOrName,
  onDelete,
  style,
}) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [deleteTool, { loading }] = useMutation<DeleteCollaborationToolResponse>(deleteCollaborationToolMutation, {
    variables: { id: toolId },
    onCompleted: () => {
      openToast(t('spaces.digitalTool.delete.success'), HoliToastType.SUCCESS)
      onDelete()
    },
    onError: (error) => displayError(error, t('spaces.digitalTool.delete.error')),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  const confirmationTitle = t('spaces.digitalTool.delete.confirmation.title')
  return (
    <>
      <MoreOptionItem
        icon="delete"
        label={t('spaces.digitalTool.delete.label')}
        onPress={() => setShowConfirmationModal(true)}
        tintColor={colors.error20}
        contentStyle={style}
        disabled={loading}
        testID="tool-delete-btn"
      />
      <HoliConfirmation
        show={showConfirmationModal}
        label={confirmationTitle}
        title={confirmationTitle}
        confirmationButtonType="warning"
        description={t('spaces.digitalTool.delete.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('confirmation.dismiss')}
        confirmText={t('spaces.digitalTool.delete.confirmation.confirm')}
        testID="tool-delete"
        onConfirm={() => {
          setShowConfirmationModal(false)
          deleteTool()
        }}
      />
    </>
  )
}

export default DeleteCollaborationToolButton
