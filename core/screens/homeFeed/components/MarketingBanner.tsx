import type React from 'react'
import { memo } from 'react'
import { AppcuesFrameView } from '@appcues/react-native'
import * as Appcues from '@appcues/react-native'
import { useEffect } from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

type MarketingBannerProps = {
  frameId: 'home-feed-banner' | 'act-home-banner' // !important: do not use the same frameId for multiple instances of the component
}

const MarketingBanner: React.FC<MarketingBannerProps> = ({ frameId }) => {
  const { user } = useLoggedInUser()

  useEffect(() => {
    if (user?.id) {
      Appcues.identify(user.id, {
        geolocation: user.geolocationId,
        location: user.location,
        isEmployee: user.isEmployee,
      })
    } else {
      Appcues.anonymous()
    }
  }, [user?.id, user?.geolocationId, user?.location, user?.isEmployee])

  return <AppcuesFrameView frameID={frameId} />
}

export default memo(MarketingBanner)
