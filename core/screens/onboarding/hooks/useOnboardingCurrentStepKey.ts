import { useEffect, useRef, useState } from 'react'
import type { HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'
import { type OnboardingStateValue, useOnboardingState } from './onboardingState'

const OnboardingStepKeys = [
  'WELCOME_SCREEN',
  'CONTENT_SELECTION',
  'LOCATION_SELECTION',
  'INTERESTS_SELECTION',
  'SKILLS_SELECTION',
  'CREATE_ACCOUNT',
  'EMAIL_VERIFICATION',
  'USER_NAME_SELECTION',
] as const
export type OnboardingStepKey = (typeof OnboardingStepKeys)[number]

export interface OnboardingStepItem extends HoliStepperItem {
  key: OnboardingStepKey
}

export const onboardingSteps: OnboardingStepItem[] = [
  { key: 'WELCOME_SCREEN' },
  {
    key: 'CONTENT_SELECTION',
    progressBar: { skippable: true },
    footerNavigation: { isNextButtonEnabled: true, isBackButtonAvailable: true },
  },
  {
    key: 'LOCATION_SELECTION',
    progressBar: { skippable: true },
    footerNavigation: { isNextButtonEnabled: true, isBackButtonAvailable: true },
  },
  {
    key: 'INTERESTS_SELECTION',
    progressBar: { skippable: true },
    footerNavigation: { isNextButtonEnabled: true, isBackButtonAvailable: true },
  },
  {
    key: 'SKILLS_SELECTION',
    progressBar: { skippable: true },
    footerNavigation: { isNextButtonEnabled: true, isBackButtonAvailable: true },
  },
  { key: 'CREATE_ACCOUNT' },
  { key: 'USER_NAME_SELECTION' },
]

const determineOnboardingInitialStepKey = (onboardingState: OnboardingStateValue | null) => {
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

export const useOnboardingCurrentStepKey = () => {
  const onboardingState = useOnboardingState()
  const prevOnboardingState = useRef(onboardingState)
  const [currentStepKey, setCurrentStepKey] = useState<OnboardingStepKey | null>(
    determineOnboardingInitialStepKey(onboardingState)
  )

  useEffect(() => {
    if (prevOnboardingState.current === null || prevOnboardingState.current !== onboardingState) {
      setCurrentStepKey(determineOnboardingInitialStepKey(onboardingState))
    }
  }, [onboardingState])

  return [currentStepKey, setCurrentStepKey] as const
}
