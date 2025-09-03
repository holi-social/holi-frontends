import { makeVar, useReactiveVar } from '@apollo/client'

export const welcomeGoodDeedsCounterVar = makeVar<boolean>(false)

export const clearOnboardingState = () => {
  welcomeGoodDeedsCounterVar(false)
}

export const storeWelcomeGoodDeedsCounter = (value: boolean) => {
  if (!value) return

  welcomeGoodDeedsCounterVar(value)
}

export const useWelcomeGoodDeedsCounter = () => useReactiveVar(welcomeGoodDeedsCounterVar)
