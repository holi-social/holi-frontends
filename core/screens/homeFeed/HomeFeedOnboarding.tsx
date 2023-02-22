import AsyncStore from '@react-native-async-storage/async-storage'
import React, { memo, useLayoutEffect } from 'react'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'

const ONBOARDING_STORAGE_NAME = 'onboarding_finished'

const HomeFeedOnboarding: React.VFC<HomeFeedProps> = (props) => {
  const { isLoggedIn } = useAuth()
  const { navigate } = useRouting()

  useLayoutEffect(() => {
    if (isLoggedIn) {
      AsyncStore.setItem(ONBOARDING_STORAGE_NAME, 'true')
    } else {
      AsyncStore.getItem(ONBOARDING_STORAGE_NAME).then((result) => {
        if (!result) {
          navigate('/onboarding')
        } else {
          try {
            const isOnboardingFinished = JSON.parse(result) as boolean
            if (!isOnboardingFinished) navigate('/onboarding')
          } catch (e) {
            return
          }
        }
      })
    }
  }, [isLoggedIn, navigate])

  return <HomeFeed {...props} />
}

export default memo(HomeFeedOnboarding)
