import React, { memo } from 'react'

import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'

const HomeFeedOnboarding = (props: HomeFeedProps) => {
  const { onboardingState } = useOnboarding()
  const finished = onboardingState === 'finished'

  return (
    <>
      <ModalBasic label="" show={!finished} animationType="fade">
        <ToastProvider>
          <Onboarding />
        </ToastProvider>
      </ModalBasic>

      <HomeFeed {...props} />
    </>
  )
}

export default memo(HomeFeedOnboarding)
