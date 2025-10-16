import { makeVar, useReactiveVar } from '@apollo/client'

export type IntroFlowType = 'onboarding' | 'first-favorite-good-deed' | 'first-tracked-good-deed' | undefined

// do not merge these vars into one var, it will break the modal. The value of the var should be a primitive type.
const goodDeedsIntroModalIsVisibleVar = makeVar(false)
const goodDeedsIntroModalTypeVar = makeVar<IntroFlowType>(undefined)

export const showGoodDeedsIntroModal = (type: IntroFlowType) => {
  goodDeedsIntroModalIsVisibleVar(true)
  goodDeedsIntroModalTypeVar(type)
}
export const hideGoodDeedsIntroModal = () => {
  goodDeedsIntroModalIsVisibleVar(false)
  goodDeedsIntroModalTypeVar(undefined)
}

export const useGoodDeedsIntroModalState = () => {
  const visible = useReactiveVar(goodDeedsIntroModalIsVisibleVar)
  const type = useReactiveVar(goodDeedsIntroModalTypeVar)

  return {
    type,
    visible,
    show: showGoodDeedsIntroModal,
    hide: hideGoodDeedsIntroModal,
  }
}
