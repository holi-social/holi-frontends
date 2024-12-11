import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import FeedLegacy from '@holi/core/screens/homeFeed/FeedLegacy'
import Feed from '@holi/core/screens/homeFeed/Feed'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

const HomeFeed = () => {
  const { user } = useLoggedInUser()

  if (user?.isEmployee) return <Feed />
  return <FeedLegacy />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
