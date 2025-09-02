import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import RewardMessage from '@holi/core/screens/individualPosts/components/RewardMessage'
import { useGetRewardsCounterLazyQuery } from '@holi/api/graphql/graphql-codegen'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { type Badge, useBadges } from '@holi/core/screens/userprofile/hooks/useBadges'
import BadgeMessage from '@holi/core/screens/individualPosts/components/BadgeMessage'

export const VolunteeringFinishedModal = (props: HoliModalProps) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()

  const [fetchRewardsCounter, { data: rewardsCounterResponse }] = useGetRewardsCounterLazyQuery()
  const rewardsCounter = rewardsCounterResponse?.rewards_counter?.counter ?? 0
  const { badges, refetchBadges } = useBadges()

  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([])
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0)

  const handleClaimReward = () => {
    // track(TrackingEvent.Rewards.goodDeedClaimed('good_deed_post'))
    refetchBadges().then(() => {
      const newlyUnlockedBadges = badges?.filter((badge: Badge) => badge.unlockedAt && !badge.seenAt)
      if (newlyUnlockedBadges.length > 0) {
        // show badgeMessage
        setUnlockedBadges(newlyUnlockedBadges)
      } else {
        props.onDismiss?.()
      }
    })
  }

  const handleClaimBadge = () => {
    const nextIndex = currentBadgeIndex + 1

    if (nextIndex < unlockedBadges.length) {
      setCurrentBadgeIndex(nextIndex) // Show the next unlocked but unseen badge
    } else {
      props.onDismiss?.()
    }
  }

  if (unlockedBadges.length > 0) {
    return (
      <BadgeMessage
        key={unlockedBadges[currentBadgeIndex].localazyKey}
        badge={unlockedBadges[currentBadgeIndex]}
        onClaim={handleClaimBadge}
      />
    )
  }

  return (
    <HoliModal {...props} label={t('goodDeedsRewards.modal')} autoHeight={false}>
      <ScrollView
        onLayout={() => fetchRewardsCounter()}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottom, flex: 1 }}
      >
        <RewardMessage onClaim={handleClaimReward} deedCount={rewardsCounter + 1} />
      </ScrollView>
    </HoliModal>
  )
}
