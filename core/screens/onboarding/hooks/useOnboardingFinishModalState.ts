import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

const onboardingFinishModalIsVisibleVar = makeVar(false)

export const showOnboardingFinishModal = () => onboardingFinishModalIsVisibleVar(true)
export const hideOnboardingFinishModal = () => onboardingFinishModalIsVisibleVar(false)

export const useOnboardingFinishModalState = () => {
  const visible = useReactiveVar(onboardingFinishModalIsVisibleVar)
  return {
    visible,
    show: showOnboardingFinishModal,
    hide: hideOnboardingFinishModal,
  }
}
