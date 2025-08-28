import React from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import RewardMessage from '@holi/core/screens/individualPosts/components/RewardMessage'
import { useGetRewardsCounterLazyQuery } from '@holi/api/graphql/graphql-codegen'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'

export const VolunteeringFinishedModal = (props: HoliModalProps) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()

  const [fetchRewardsCounter, { data: rewardsCounterResponse }] = useGetRewardsCounterLazyQuery()
  const rewardsCounter = rewardsCounterResponse?.rewards_counter?.counter ?? 0

  return (
    <HoliModal {...props} label={t('goodDeedsRewards.modal')} autoHeight={false}>
      <ScrollView
        onLayout={() => fetchRewardsCounter()}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottom, flex: 1 }}
      >
        <RewardMessage onClaim={props.onDismiss} deedCount={rewardsCounter + 1} />
      </ScrollView>
    </HoliModal>
  )
}
