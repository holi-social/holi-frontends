import React, { useState } from 'react'

import { HoliStepper } from '@holi/ui/components/organisms/HoliStepperV2'
import { HoliError } from '@holi/core/errors/classes/HoliError'

import { GoodDeedsBecomeHero } from './components/GoodDeedsBecomeHero'
import { GoodDeedsProgressExplanation } from './components/GoodDeedsProgressExplanation'
import type { IntroFlowType } from './helpers/useGoodDeedsIntroModalState'
import { GoodDeedsCampaignExplanation } from './components/GoodDeedsCampaignExplanation'
import { GoodDeedsImpactStarter } from './components/GoodDeedsImpactStarter'
import { GoodDeedsYouAreHero } from './components/GoodDeedsYouAreHero'
import type { GoodDeedsOnboardingStepItem } from './types'

interface GoodDeedsIntroStepperProps {
  type: IntroFlowType
  steps: GoodDeedsOnboardingStepItem[]
  onEnd: () => void
}
export const GoodDeedsIntroStepper = ({ type, steps, onEnd }: GoodDeedsIntroStepperProps) => {
  const firstStep = steps[0].key
  const [currentStep, setCurrentStep] = useState<GoodDeedsOnboardingStepItem['key']>(firstStep)

  const handleNextStep = () => {
    const currentStepIndex = steps.findIndex((step) => step.key === currentStep)
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].key)
    } else {
      onEnd()
    }
  }

  const handleBackStep = () => {
    const currentStepIndex = steps.findIndex((step) => step.key === currentStep)
    const previousStepIndex = currentStepIndex - 1
    if (previousStepIndex >= 0) {
      setCurrentStep(steps[previousStepIndex].key)
    }
  }

  const renderStep = (key: GoodDeedsOnboardingStepItem['key'], type: IntroFlowType) => {
    switch (key) {
      case 'GOOD_DEEDS_IMPACT_STARTER':
        return <GoodDeedsImpactStarter onNextPress={handleNextStep} />
      case 'GOOD_DEEDS_YOU_ARE_HERO':
        return <GoodDeedsYouAreHero onNextPress={handleNextStep} />
      case 'GOOD_DEEDS_BECOME_HERO':
        return <GoodDeedsBecomeHero type={type} onNextPress={handleNextStep} />
      case 'GOOD_DEEDS_PROGRESS_EXPLANATION':
        return <GoodDeedsProgressExplanation onNextPress={handleNextStep} onBackPress={handleBackStep} />
      case 'GOOD_DEEDS_CAMPAIGN_EXPLANATION':
        return <GoodDeedsCampaignExplanation type={type} onNextPress={handleNextStep} onBackPress={handleBackStep} />
      default:
        throw new HoliError(`Good Deeds Onboarding: "${key}" is not a valid step`)
    }
  }

  return (
    <HoliStepper
      data={steps}
      activeStepKey={currentStep}
      keyExtractor={(item) => item.key}
      renderStep={({ key }) => renderStep(key as GoodDeedsOnboardingStepItem['key'], type)}
      onChange={(key, previousKey, buttonPressed) => {
        // finish onboarding if user is on last step and clicks on continue
        if (buttonPressed === 'continue' && [key, previousKey].every((key) => key === 'GOOD_DEEDS_DO')) {
          onEnd()
          return
        }

        setCurrentStep(key as GoodDeedsOnboardingStepItem['key'])
      }}
      WrapperComponent={({ children }) => <>{children}</>}
      paddingTop={0}
      paddingBottom={0}
      testID="onboarding-good-deeds-modal--stepper"
    />
  )
}
