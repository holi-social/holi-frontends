import type React from 'react'
import { memo } from 'react'
import { AppcuesFrameView } from '@appcues/react-native'
import * as Appcues from '@appcues/react-native'
import { useEffect } from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

type MarketingBannerProps = {
  frameId?: string // !important: do not use the same frameId for multiple instances of the component
}

const MarketingBanner: React.FC<MarketingBannerProps> = ({ frameId = 'marketingBanner' }) => {
  const { user } = useLoggedInUser()

  useEffect(() => {
    if (user?.id) {
      Appcues.identify(user.id, {
        geolocation: user.geolocationId,
        location: user.location,
      })
    } else {
      Appcues.anonymous()
    }
  }, [user?.id, user?.geolocationId, user?.location])

  return <AppcuesFrameView frameID={frameId} />
}

export default memo(MarketingBanner)
