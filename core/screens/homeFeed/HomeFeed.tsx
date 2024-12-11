import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import FeedLegacy from '@holi/core/screens/homeFeed/FeedLegacy'
import Feed from '@holi/core/screens/homeFeed/Feed'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagAB } from '@holi/core/featureFlags/hooks/useFeatureFlagAB'

const HomeFeed = () => {
  const featureFlag = useFeatureFlagAB(FeatureFlagKey.NEW_HOME_FEED)
  const newFeedEnabled = featureFlag === 'test'

  if (newFeedEnabled) return <Feed />
  return <FeedLegacy />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
