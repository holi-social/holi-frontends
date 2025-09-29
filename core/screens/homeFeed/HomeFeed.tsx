import Feed from '@holi/core/screens/homeFeed/Feed'
import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'

const HomeFeed = () => {
  return <Feed />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
