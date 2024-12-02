import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import FeedLegacy from '@holi/core/screens/homeFeed/FeedLegacy'
import Feed from '@holi/core/screens/homeFeed/Feed'

const HomeFeed = () => {
  const legacy = false

  if (legacy) return <FeedLegacy />
  return <Feed />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
