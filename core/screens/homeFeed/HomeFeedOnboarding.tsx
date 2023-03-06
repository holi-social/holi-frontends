import React, { memo } from 'react'

// import React, { memo, useLayoutEffect } from 'react'
// import useRouting from '@holi/core/navigation/hooks/useRouting'
import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'

// import { useOnboarding } from '@holi/core/screens/onboarding/hooks'

const HomeFeedOnboarding: React.VFC<HomeFeedProps> = (props) => {
  // const { navigate } = useRouting()
  // const { finished } = useOnboarding()

  // useLayoutEffect(() => {
  //   !finished && navigate('/onboarding')
  // }, [finished, navigate])

  return <HomeFeed {...props} />
}

export default memo(HomeFeedOnboarding)
