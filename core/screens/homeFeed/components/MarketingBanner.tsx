import type React from 'react'
import { AppcuesFrameView } from '@appcues/react-native'
import * as Appcues from '@appcues/react-native'
import { useEffect } from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import type { ViewStyle } from 'react-native'

type MarketingBannerProps = {
  style?: ViewStyle
}

const MarketingBanner: React.FC<MarketingBannerProps> = ({ style }) => {
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

  return <AppcuesFrameView frameID="marketingBanner" style={style} />
}

export default MarketingBanner
