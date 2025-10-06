import React, { useCallback } from 'react'
import { ScrollView } from 'react-native'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import BadgeMessage from '@holi/core/screens/individualPosts/components/BadgeMessage'
import type { Badge } from '@holi/core/screens/userprofile/hooks/useBadges'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useMarkBadgeAsSeenMutation } from '@holi/api/graphql/graphql-codegen'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

interface EarnedBadgesModalProps extends HoliModalProps {
  badge: Badge
}

export const EarnedBadgesModal = (props: EarnedBadgesModalProps) => {
  const { bottom } = useSafeAreaInsets()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()
  const [markBadgeAsSeen] = useMarkBadgeAsSeenMutation()

  const { badge, onDismiss } = props

  const handleClaim = useCallback(async () => {
    try {
      if (badge?.id) {
        await markBadgeAsSeen({ variables: { unlockId: badge.id } })
      }
      track(TrackingEvent.Rewards.badgeEarned(badge.localazyKey))
    } catch (err) {
      displayError(err, 'Failed to update badge status', { location: 'scratchEffect.handleClaim' })
    } finally {
      onDismiss?.()
    }
  }, [badge, displayError, markBadgeAsSeen, onDismiss, track])

  return (
    <HoliModal {...props} label="Scratch to reveal superpower" autoHeight={false} onDismiss={handleClaim}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottom, flex: 1 }}>
        <BadgeMessage key={props.badge.localazyKey} badge={props.badge} onClaim={handleClaim} />
      </ScrollView>
    </HoliModal>
  )
}
