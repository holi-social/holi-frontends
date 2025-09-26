import { makeVar, useReactiveVar } from '@apollo/client'

const goodDeedsIntroModalIsVisibleVar = makeVar(false)

export const showGoodDeedsIntroModal = () => goodDeedsIntroModalIsVisibleVar(true)
export const hideGoodDeedsIntroModal = () => goodDeedsIntroModalIsVisibleVar(false)

export const useGoodDeedsIntroModalState = () => {
  const visible = useReactiveVar(goodDeedsIntroModalIsVisibleVar)
  return {
    visible,
    show: showGoodDeedsIntroModal,
    hide: hideGoodDeedsIntroModal,
  }
}
