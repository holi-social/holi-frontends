import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import Feed from '@holi/core/screens/homeFeed/Feed'

const HomeFeed = () => {
  return <Feed />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
