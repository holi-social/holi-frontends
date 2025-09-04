import { makeVar, useReactiveVar } from '@apollo/client'

export const welcomeGoodDeedsCounterModalVisibilityVar = makeVar<boolean>(false)

export const clearOnboardingState = () => {
  welcomeGoodDeedsCounterModalVisibilityVar(false)
}

export const storeWelcomeGoodDeedsCounterModalVisibility = (value: boolean) => {
  welcomeGoodDeedsCounterModalVisibilityVar(value)
}

export const useWelcomeGoodDeedsCounterModalVisibility = () => useReactiveVar(welcomeGoodDeedsCounterModalVisibilityVar)
