import React from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import RewardMessage from '@holi/core/screens/individualPosts/components/RewardMessage'
import { useGetRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'

export const VolunteeringFinishedModal = (props: HoliModalProps) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()

  const { data } = useGetRewardsCounterQuery({
    fetchPolicy: 'no-cache',
  })
  const count = data?.rewards_counter?.counter ?? 0

  return (
    <HoliModal {...props} label={t('goodDeedsRewards.modal')} autoHeight={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottom, flex: 1 }}>
        <RewardMessage onClaim={props.onDismiss} deedCount={count + 1} />
      </ScrollView>
    </HoliModal>
  )
}
