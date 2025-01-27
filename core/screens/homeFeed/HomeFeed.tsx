import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import FeedLegacy from '@holi/core/screens/homeFeed/FeedLegacy'
import Feed from '@holi/core/screens/homeFeed/Feed'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagAB } from '@holi/core/featureFlags/hooks/useFeatureFlagAB'

const HomeFeed = () => {
  const displayNewHomeFeed = useFeatureFlagAB(FeatureFlagKey.NEW_HOME_FEED)

  if (displayNewHomeFeed === 'test') {
    return (
      <SpaceTermContextProvider>
        <Feed />
      </SpaceTermContextProvider>
    )
  } else {
    return <FeedLegacy />
  }
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
