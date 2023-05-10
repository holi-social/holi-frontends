import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'

export interface DeleteSpaceProps {
  confirmationDesc: string
  confirmationTitle: string
  confirmationTestID: string
  isLoading: boolean
  itemTestID: string
  handleDelete: () => void
}

export const Delete = ({
  confirmationDesc,
  confirmationTitle,
  confirmationTestID,
  isLoading,
  itemTestID,
  handleDelete,
}: DeleteSpaceProps) => {
  const { t } = useTranslation()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  return (
    <>
      <MoreOptionItem
        icon="delete"
        label={t('global.delete')}
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
        confirmText={t('confirmation.confirm')}
        testID={confirmationTestID}
        onConfirm={() => {
          setShowConfirmationModal(false)
          handleDelete()
        }}
      />
    </>
  )
}
