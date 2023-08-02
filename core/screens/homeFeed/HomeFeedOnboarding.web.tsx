import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'

import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'

const HomeFeedOnboarding = (props: HomeFeedProps) => {
  const { storedOnboardingState } = useStoredOnboardingState()
  const finished = storedOnboardingState === 'finished'

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

export default withProfiler(memo(HomeFeedOnboarding), { name: 'HomeFeedOnboarding' })
