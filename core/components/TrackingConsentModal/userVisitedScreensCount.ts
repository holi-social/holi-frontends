import { makeVar, useReactiveVar } from '@apollo/client'

export const SCREENS_TO_VISIT_COUNT = 4

const userVisitedScreensCount = makeVar(0)
export const useUserVisitedScreensCount = () => useReactiveVar(userVisitedScreensCount)
export const increaseUserVisitedScreensCount = () => {
  const currentUserVisitedScreensCount = userVisitedScreensCount()
  // update reactive var only till SCREENS_TO_VISIT_COUNT value achieved
  if (currentUserVisitedScreensCount >= SCREENS_TO_VISIT_COUNT) return

  userVisitedScreensCount(currentUserVisitedScreensCount + 1)
}
