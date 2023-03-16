import React, { memo } from 'react'

import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'

const HomeFeedOnboarding: React.VFC<HomeFeedProps> = (props) => {
  const { finished } = useOnboarding()

  return (
    <>
      <ModalBasic label="" show={!finished} animationType="fade">
        <Onboarding />
      </ModalBasic>

      <HomeFeed {...props} />
    </>
  )
}

export default memo(HomeFeedOnboarding)
