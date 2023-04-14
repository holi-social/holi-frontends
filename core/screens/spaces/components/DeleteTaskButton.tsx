import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { DeleteTaskResponse, deleteTaskMutation, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

export interface DeleteTaskButtonProps {
  taskId: string
  spaceIdOrName: string
  onDelete: () => void
  style?: StyleProp<ViewStyle>
}

export type AddDigitalToolParams = {
  spaceIdOrName: string
}

const DeleteTaskButton: React.VoidFunctionComponent<DeleteTaskButtonProps> = ({
  taskId,
  spaceIdOrName,
  onDelete,
  style,
}) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [deleteTask, { loading }] = useMutation<DeleteTaskResponse>(deleteTaskMutation, {
    variables: { id: taskId },
    onCompleted: () => {
      openToast(t('spaces.tasks.delete.success'), HoliToastType.SUCCESS)
      onDelete()
    },
    onError: (error) => displayError(error, t('spaces.tasks.delete.error')),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  const confirmationTitle = t('spaces.tasks.delete.confirmation.title')
  return (
    <>
      <MoreOptionItem
        icon="delete"
        label={t('global.delete')}
        onPress={() => setShowConfirmationModal(true)}
        tintColor={colors.error20}
        contentStyle={style}
        disabled={loading}
        testID="btn-to-delete-task"
      />
      <HoliConfirmation
        show={showConfirmationModal}
        label={confirmationTitle}
        title={confirmationTitle}
        confirmationButtonType="warning"
        description={t('spaces.tasks.delete.confirmation.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('confirmation.dismiss')}
        confirmText={t('global.yes')}
        testID="task-delete"
        onConfirm={() => {
          setShowConfirmationModal(false)
          deleteTask()
        }}
      />
    </>
  )
}

export default DeleteTaskButton
