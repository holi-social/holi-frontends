import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import RewardMessage from '@holi/core/screens/individualPosts/components/RewardMessage'
import { useGetRewardsCounterLazyQuery } from '@holi/api/graphql/graphql-codegen'

export const VolunteeringFinishedModal = (props: HoliModalProps) => {
  const { t } = useTranslation()

  const [fetchRewardsCounter, { data: rewardsCounterResponse }] = useGetRewardsCounterLazyQuery()
  const rewardsCounter = rewardsCounterResponse?.rewards_counter?.counter ?? 0

  return (
    <HoliModal {...props} label={t('goodDeedsRewards.modal')}>
      <SafeArea onLayout={() => fetchRewardsCounter()}>
        <RewardMessage onClaim={props.onDismiss} deedCount={rewardsCounter + 1} />
      </SafeArea>
    </HoliModal>
  )
}
