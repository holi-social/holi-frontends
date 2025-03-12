import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import FeedLegacy from '@holi/core/screens/homeFeed/FeedLegacy'
import Feed from '@holi/core/screens/homeFeed/Feed'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagAB } from '@holi/core/featureFlags/hooks/useFeatureFlagAB'

const HomeFeed = () => {
  const displayNewHomeFeed = useFeatureFlagAB(FeatureFlagKey.NEW_HOME_FEED)

  if (displayNewHomeFeed === 'test') {
    return <Feed />
  } else {
    return <FeedLegacy />
  }
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
