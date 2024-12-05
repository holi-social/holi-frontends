import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import FeedLegacy from '@holi/core/screens/homeFeed/FeedLegacy'
import Feed from '@holi/core/screens/homeFeed/Feed'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

const HomeFeed = () => {
  const [newFeedEnabled] = useFeatureFlag(FeatureFlagKey.NEW_FEED)

  if (newFeedEnabled) return <Feed />
  return <FeedLegacy />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
