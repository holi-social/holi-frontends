import React, { memo } from 'react'
import { Modal } from 'react-native'

import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'

const HomeFeedOnboarding: React.VFC<HomeFeedProps> = (props) => {
  const { finished } = useOnboarding()

  return (
    <>
      <Modal visible={!finished} animationType="fade">
        <Onboarding />
      </Modal>

      <HomeFeed {...props} />
    </>
  )
}

export default memo(HomeFeedOnboarding)
