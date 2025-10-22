import type React from 'react'
import { useEffect } from 'react'
import { makeVar, useReactiveVar } from '@apollo/client'

import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { useBadges } from '@holi/core/screens/userprofile/hooks/useBadges'
import { EarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModal'

const refetchBadgesVar = makeVar(() => Promise.resolve())

export const EarnedBadgesGlobalModal = () => {
  const { badges, refetchBadges } = useBadges()

  const newBadges = badges.filter((badge) => badge.unlockedAt && !badge.seenAt)
  const haveNewBadgesToShow = newBadges.length > 0

  const { props: badgesModalProps } = useModalState({
    onDismiss: refetchBadges,
  })

  useEffect(() => {
    refetchBadgesVar(refetchBadges)
  }, [refetchBadges])

  return (
    haveNewBadgesToShow && (
      <EarnedBadgesModal
        {...badgesModalProps}
        shown={haveNewBadgesToShow}
        badge={newBadges[0]}
        label="Earned a badge"
      />
    )
  )
}

export const useEarnedBadgesModal = () => {
  const refetchBadges = useReactiveVar(refetchBadgesVar)
  return refetchBadges
}
