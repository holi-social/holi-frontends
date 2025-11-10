import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

export const welcomeGoodDeedsCounterModalVar = makeVar<boolean>(false)

export const clearOnboardingState = () => {
  welcomeGoodDeedsCounterModalVar(false)
}

export const storeWelcomeGoodDeedsCounterModal = (value: boolean) => {
  welcomeGoodDeedsCounterModalVar(value)
}

export const useWelcomeGoodDeedsCounterModal = () => useReactiveVar(welcomeGoodDeedsCounterModalVar)
