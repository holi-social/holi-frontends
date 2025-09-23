import type React from 'react'
import { createContext, useContext, useState } from 'react'

import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { useBadges, type Badge } from '@holi/core/screens/userprofile/hooks/useBadges'
import { EarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModal'

interface BadgesModalContextType {
  checkNewBadges: () => Promise<void>
}
const BadgesModalContext = createContext<BadgesModalContextType | undefined>(undefined)

export const EarnedBadgesModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { refetchBadges } = useBadges()
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([])
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0)

  const { show: showBadgesModal, props: badgesModalProps } = useModalState({
    onDismiss: () => {
      const nextIndex = currentBadgeIndex + 1

      if (nextIndex < unlockedBadges.length) {
        setCurrentBadgeIndex(nextIndex) // Show the next unlocked but unseen badge
        showBadgesModal()
      }
    },
  })

  const checkNewBadges = async () => {
    const updatedBadges = await refetchBadges()
    const newlyUnlockedBadges = updatedBadges.filter((badge) => badge.unlockedAt && !badge.seenAt) ?? []
    if (newlyUnlockedBadges.length > 0) {
      setUnlockedBadges(newlyUnlockedBadges)
      setCurrentBadgeIndex(0)
      showBadgesModal()
    }
  }

  return (
    <BadgesModalContext.Provider value={{ checkNewBadges }}>
      {children}

      {unlockedBadges.length > 0 && (
        <EarnedBadgesModal {...badgesModalProps} badge={unlockedBadges[currentBadgeIndex]} label="Earned a badge" />
      )}
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
