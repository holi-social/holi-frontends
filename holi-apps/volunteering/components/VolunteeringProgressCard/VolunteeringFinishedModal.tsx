import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import RewardMessage from '@holi/core/screens/individualPosts/components/RewardMessage'

export const VolunteeringFinishedModal = (props: HoliModalProps) => {
  const { t } = useTranslation()

  return (
    <HoliModal {...props} label={t('goodDeedsRewards.modal')}>
      <SafeArea>
        <RewardMessage onClaim={props.onDismiss} />
      </SafeArea>
    </HoliModal>
  )
}
