import React, { memo, useLayoutEffect } from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'

const HomeFeedOnboarding: React.VFC<HomeFeedProps> = (props) => {
  const { navigate } = useRouting()
  const { onboardingState } = useOnboarding()
  const finished = onboardingState === 'finished'

  useLayoutEffect(() => {
    !finished && navigate('/onboarding')
  }, [finished, navigate])

  return <HomeFeed {...props} />
}

export default memo(HomeFeedOnboarding)
