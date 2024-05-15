import { makeVar, useReactiveVar } from '@apollo/client'

import { onboardingStateVar } from '@holi/core/screens/onboarding/hooks'

export const SCREENS_TO_VISIT_COUNT = 4

const userVisitedScreensCount = makeVar(0)
export const useUserVisitedScreensCount = () => useReactiveVar(userVisitedScreensCount)

export const increaseUserVisitedScreensCount = () => {
  const currentUserVisitedScreensCount = userVisitedScreensCount()
  const onboardingStateValue = onboardingStateVar()
  const isOnboardingFinished = !!onboardingStateValue && onboardingStateValue === 'finished'

  if (isOnboardingFinished && currentUserVisitedScreensCount < SCREENS_TO_VISIT_COUNT) {
    userVisitedScreensCount(currentUserVisitedScreensCount + 1)
  }
}

export const resetUserVisitedScreensCount = () => {
  userVisitedScreensCount(0)
}
