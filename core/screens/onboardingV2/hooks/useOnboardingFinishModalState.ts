import { makeVar, useReactiveVar } from '@apollo/client'

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
