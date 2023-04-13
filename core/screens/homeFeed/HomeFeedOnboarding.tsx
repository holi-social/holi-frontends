import React, { memo, useLayoutEffect } from 'react'

import { useNavigation } from '@react-navigation/native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'

const HomeFeedOnboarding: React.VFC<HomeFeedProps> = (props) => {
  const { navigate } = useRouting()
  const { onboardingState } = useOnboarding()
  const { isFocused } = useNavigation()

  const finished = onboardingState === 'finished'

  useLayoutEffect(() => {
    // on mobile home page is not destroyed when we go to `/profile`
    // so, we need to check first if home page is focused (active current page) to avoid strange behavior
    // when we are on `/profile` after registration we change `onboardingState` and do not want home page to react on it and redirects us to `/onboarding`
    if (isFocused() && !finished) {
      navigate('/onboarding')
    }
  }, [finished, isFocused, navigate])

  return <HomeFeed {...props} />
}

export default memo(HomeFeedOnboarding)
