import type React from 'react'
import { createContext, useContext, useEffect } from 'react'

import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { useBadges, type Badge } from '@holi/core/screens/userprofile/hooks/useBadges'
import { EarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModal'

const BadgesModalContext = createContext<() => Promise<Badge[]>>(() => Promise.resolve([]))

export const EarnedBadgesModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { badges, refetchBadges } = useBadges()

  const newBadges = badges.filter((badge) => badge.unlockedAt && !badge.seenAt)
  const haveNewBadgesToShow = newBadges.length > 0

  const { show: showBadgesModal, props: badgesModalProps } = useModalState({
    onDismiss: refetchBadges,
  })

  useEffect(() => {
    if (haveNewBadgesToShow) {
      showBadgesModal()
    }
  }, [haveNewBadgesToShow, showBadgesModal])

  return (
    <BadgesModalContext.Provider value={refetchBadges}>
      {children}

      {haveNewBadgesToShow && <EarnedBadgesModal {...badgesModalProps} badge={newBadges[0]} label="Earned a badge" />}
    </BadgesModalContext.Provider>
  )
}

export const useEarnedBadgesModal = () => {
  const ctx = useContext(BadgesModalContext)
  if (!ctx) {
    throw new Error('useEarnedBadgesModal must be used within EarnedBadgesModalProvider')
  }
  return ctx
}
