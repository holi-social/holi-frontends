import { makeVar, useReactiveVar } from '@apollo/client'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'

const goodDeedsIntroModalIsVisibleVar = makeVar(false)

export const showGoodDeedsIntroModal = () => goodDeedsIntroModalIsVisibleVar(true)
export const hideGoodDeedsIntroModal = () => goodDeedsIntroModalIsVisibleVar(false)

export const useGoodDeedsIntroModalState = () => {
  const visible = useReactiveVar(goodDeedsIntroModalIsVisibleVar)
  const goodDeedsIntroModalEnabled = useFeatureFlagToggle(FeatureFlagKey.GOOD_DEEDS_INTRO_1)

  return {
    visible: !!goodDeedsIntroModalEnabled && visible,
    show: showGoodDeedsIntroModal,
    hide: hideGoodDeedsIntroModal,
  }
}
