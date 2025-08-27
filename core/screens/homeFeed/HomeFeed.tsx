import { withProfiler } from '@sentry/react'
import React, { memo, useState } from 'react'
import BadgeMessage from '@holi/core/screens/individualPosts/components/BadgeMessage'
import { mockedBadges } from '@holi/core/screens/userprofile/__tests__/helpers/testDataBadges'
import type { Badge } from '@holi/core/screens/userprofile/hooks/useBadges'
import useRouting from '@holi/core/navigation/hooks/useRouting'

const HomeFeed = () => {
  const { navigate } = useRouting()
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0)

  const newlyUnlockedBadges = mockedBadges?.filter((badge: Badge) => badge.unlockedAt && !badge.seenAt)

  const handleClaimBadge = () => {
    const nextIndex = currentBadgeIndex + 1

    if (nextIndex < newlyUnlockedBadges.length) {
      setCurrentBadgeIndex(nextIndex)
    } else {
      navigate('/')
    }
  }

  return (
    <BadgeMessage
      key={newlyUnlockedBadges[currentBadgeIndex].localazyKey}
      badge={newlyUnlockedBadges[currentBadgeIndex]}
      onClaim={handleClaimBadge}
    />
  )
  // return <Feed />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
