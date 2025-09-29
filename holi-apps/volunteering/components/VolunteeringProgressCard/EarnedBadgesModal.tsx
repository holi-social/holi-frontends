import React from 'react'
import { ScrollView } from 'react-native'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import BadgeMessage from '@holi/core/screens/individualPosts/components/BadgeMessage'
import type { Badge } from '@holi/core/screens/userprofile/hooks/useBadges'

interface EarnedBadgesModalProps extends HoliModalProps {
  badge: Badge
}

export const EarnedBadgesModal = (props: EarnedBadgesModalProps) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <HoliModal {...props} label="Scratch to reveal superpower" autoHeight={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottom, flex: 1 }}>
        <BadgeMessage key={props.badge.localazyKey} badge={props.badge} onClaim={props.onDismiss} />
      </ScrollView>
    </HoliModal>
  )
}
