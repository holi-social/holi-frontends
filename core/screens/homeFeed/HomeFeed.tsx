import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import FeedLegacy from '@holi/core/screens/homeFeed/FeedLegacy'
import Feed from '@holi/core/screens/homeFeed/Feed'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'

const HomeFeed = () => {
  const { user } = useLoggedInUser()

  if (user?.isEmployee)
    return (
      <SpaceTermContextProvider>
        <Feed />
      </SpaceTermContextProvider>
    )
  return <FeedLegacy />
}

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
