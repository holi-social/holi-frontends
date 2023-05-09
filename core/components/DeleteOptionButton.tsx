import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'

interface DeleteSpaceButtonProps {
  confirmationDesc: string
  confirmationTitle: string
  isLoading: boolean
  onDelete: () => void
  itemTestID?: string
  confirmationTestID?: string
}

const DeleteOptionButton = ({
  confirmationDesc,
  confirmationTitle,
  confirmationTestID,
  isLoading,
  itemTestID,
  onDelete,
}: DeleteSpaceButtonProps) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleConfirmation = () => {
    setShowConfirmationModal(false)
    onDelete()
  }

  return (
    <>
      <MoreOptionItem
        icon="delete"
        label={t('confirmation.delete')}
        onPress={() => setShowConfirmationModal(true)}
        tintColor={colors.error20}
        disabled={isLoading}
        testID={itemTestID}
      />
      <HoliConfirmation
        show={showConfirmationModal}
        label={confirmationTitle}
        title={confirmationTitle}
        confirmationButtonType="warning"
        description={confirmationDesc}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('confirmation.dismiss')}
        confirmText={t('spaces.delete.confirmation.confirm')}
        testID={confirmationTestID}
        onConfirm={handleConfirmation}
      />
    </>
  )
}

export default DeleteOptionButton
