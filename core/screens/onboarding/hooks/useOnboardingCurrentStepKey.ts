import { useCallback, useEffect, useRef, useState } from 'react'
import type { HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'
import { type OnboardingStateValue, useOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { useFocusEffect } from '@holi/core/helpers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OnboardingStepKeys = ['WELCOME_SCREEN', 'CREATE_ACCOUNT', 'EMAIL_VERIFICATION', 'USER_NAME_SELECTION'] as const
export type OnboardingStepKey = (typeof OnboardingStepKeys)[number]

export interface OnboardingStepItem extends HoliStepperItem {
  key: OnboardingStepKey
}

export const onboardingSteps: OnboardingStepItem[] = [
  { key: 'WELCOME_SCREEN' },
  { key: 'CREATE_ACCOUNT' },
  { key: 'USER_NAME_SELECTION' },
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
      prevOnboardingState.current = onboardingState
    }
  }, [hasRegistrationFlow, onboardingState])

  useFocusEffect(
    useCallback(() => {
      // Only reset the step if the onboarding state has actually changed
      // This prevents resetting to initial step when browser regains focus
      if (prevOnboardingState.current !== onboardingState) {
        setCurrentStepKey(determineOnboardingInitialStepKey(onboardingState, hasRegistrationFlow))
        prevOnboardingState.current = onboardingState
      }
    }, [hasRegistrationFlow, onboardingState])
  )

  return [currentStepKey, setCurrentStepKey] as const
}
