import { useCallback, useEffect, useRef, useState } from 'react'
import type { HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'
import { type OnboardingStateValue, useOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { useFocusEffect } from '@holi/core/helpers'
import { GoodDeedsExplanationFooterNavigation } from '@holi/core/screens/onboarding/steps/GoodDeeds'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OnboardingStepKeys = [
  'WELCOME_SCREEN',
  'CREATE_ACCOUNT',
  'EMAIL_VERIFICATION',
  'USER_NAME_SELECTION',
  'GOOD_DEEDS_EXPLANATION',
  'GOOD_DEEDS_DO',
] as const
export type OnboardingStepKey = (typeof OnboardingStepKeys)[number]

export interface OnboardingStepItem extends HoliStepperItem {
  key: OnboardingStepKey
}

export const onboardingSteps: OnboardingStepItem[] = [
  { key: 'WELCOME_SCREEN' },
  { key: 'CREATE_ACCOUNT' },
  { key: 'USER_NAME_SELECTION' },
  {
    key: 'GOOD_DEEDS_EXPLANATION',
    FooterNavigationComponent: GoodDeedsExplanationFooterNavigation,
    footerNavigation: { isBackButtonAvailable: false, nextButtonLabel: 'onboarding.modal.step01.buttonPrimary' },
    backgroundColor: 'white',
  },
  {
    key: 'GOOD_DEEDS_DO',
    FooterNavigationComponent: GoodDeedsExplanationFooterNavigation,
    footerNavigation: { isBackButtonAvailable: true, nextButtonLabel: 'onboarding.modal.step02.buttonPrimary' },
    backgroundColor: 'yellowDefault',
  },
]

const determineOnboardingInitialStepKey = (
  onboardingState: OnboardingStateValue | null,
  hasRegistrationFlow?: boolean
) => {
  if (hasRegistrationFlow) {
    return 'CREATE_ACCOUNT'
  }
  switch (onboardingState) {
    case 'onboarding':
      return 'WELCOME_SCREEN'
    case 'emailVerification':
      return 'EMAIL_VERIFICATION'
    case 'accountSetup':
      return 'USER_NAME_SELECTION'
    case 'finished':
      return 'CREATE_ACCOUNT'
    default:
      return null
  }
}

export const useOnboardingCurrentStepKey = (hasRegistrationFlow?: boolean) => {
  const onboardingState = useOnboardingState()
  const prevOnboardingState = useRef(onboardingState)
  const [currentStepKey, setCurrentStepKey] = useState<OnboardingStepKey | null>(
    determineOnboardingInitialStepKey(onboardingState, hasRegistrationFlow)
  )

  useEffect(() => {
    if (prevOnboardingState.current === null || prevOnboardingState.current !== onboardingState) {
      setCurrentStepKey(determineOnboardingInitialStepKey(onboardingState, hasRegistrationFlow))
    }
  }, [hasRegistrationFlow, onboardingState])

  useFocusEffect(
    useCallback(() => {
      setCurrentStepKey(determineOnboardingInitialStepKey(onboardingState, hasRegistrationFlow))
    }, [hasRegistrationFlow, onboardingState])
  )

  return [currentStepKey, setCurrentStepKey] as const
}
