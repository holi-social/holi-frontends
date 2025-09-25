import React, { useState } from 'react'

import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliStepper, type HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'
import { HoliError } from '@holi/core/errors/classes/HoliError'

// eslint-disable-next-line no-restricted-imports
import { GoodDeedsDo, GoodDeedsExplain, GoodDeedsExplanationFooterNavigation } from '../steps/GoodDeeds'
// eslint-disable-next-line no-restricted-imports
import { useGoodDeedsIntroModalState } from '../hooks/useGoodDeedsIntroModalState'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GoodDeedsOnboardingStepKeys = ['GOOD_DEEDS_EXPLANATION', 'GOOD_DEEDS_DO'] as const
export type GoodDeedsOnboardingStepKey = (typeof GoodDeedsOnboardingStepKeys)[number]

export interface GoodDeedsOnboardingStepItem extends HoliStepperItem {
  key: GoodDeedsOnboardingStepKey
}

export const goodDeedsOnboardingSteps: GoodDeedsOnboardingStepItem[] = [
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

export const GoodDeedsIntroModal = () => {
  const [currentStep, setCurrentStep] = useState<GoodDeedsOnboardingStepKey>('GOOD_DEEDS_EXPLANATION')

  const { visible, hide } = useGoodDeedsIntroModalState()

  const renderStep = (key: GoodDeedsOnboardingStepKey) => {
    switch (key) {
      case 'GOOD_DEEDS_EXPLANATION':
        return <GoodDeedsExplain />
      case 'GOOD_DEEDS_DO':
        return <GoodDeedsDo />
      default:
        throw new HoliError(`Good Deeds Onboarding: "${key}" is not a valid step`)
    }
  }

  return (
    <HoliModal label="" desktop shown={visible} testID="onboarding-good-deeds-modal">
      <HoliStepper
        data={goodDeedsOnboardingSteps}
        activeStepKey={currentStep}
        keyExtractor={(item) => item.key}
        renderStep={({ key }) => renderStep(key as GoodDeedsOnboardingStepKey)}
        onChange={(key, previousKey, buttonPressed) => {
          // finish onboarding if user is on last step and clicks on continue
          if (buttonPressed === 'continue' && [key, previousKey].every((key) => key === 'GOOD_DEEDS_DO')) {
            hide()
            return
          }

          setCurrentStep(key as GoodDeedsOnboardingStepKey)
        }}
        WrapperComponent={({ children }) => <>{children}</>}
        paddingTop={0}
        paddingBottom={0}
        testID="onboarding-good-deeds-modal--stepper"
      />
    </HoliModal>
  )
}
