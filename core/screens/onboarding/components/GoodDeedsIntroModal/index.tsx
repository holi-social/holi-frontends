import React, { useState } from 'react'

import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliStepper, type HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'

import { GoodDeedsBecomeHero } from './components/GoodDeedsBecomeHero'
import { GoodDeedsProgressExplanation } from './components/GoodDeedsProgressExplanation'
import { type IntroFlowType, useGoodDeedsIntroModalState } from './helpers/useGoodDeedsIntroModalState'
import { useIsDesktopView } from './helpers/isDesktopView'
import { GoodDeedsCampaignExplanation } from './components/GoodDeedsCampaignExplanation'
import { GoodDeedsImpactStarter } from './components/GoodDeedsImpactStarter'
import { GoodDeedsYouAreHero } from '@holi/core/screens/onboarding/components/GoodDeedsIntroModal/components/GoodDeedsYouAreHero'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GoodDeedsOnboardingStepKeys = [
  'GOOD_DEEDS_IMPACT_STARTER',
  'GOOD_DEEDS_YOU_ARE_HERO',
  'GOOD_DEEDS_BECOME_HERO',
  'GOOD_DEEDS_PROGRESS_EXPLANATION',
  'GOOD_DEEDS_CAMPAIGN_EXPLANATION',
] as const
export type GoodDeedsOnboardingStepKey = (typeof GoodDeedsOnboardingStepKeys)[number]

export interface GoodDeedsOnboardingStepItem extends HoliStepperItem {
  key: GoodDeedsOnboardingStepKey
}

export const goodDeedsOnboardingSteps: GoodDeedsOnboardingStepItem[] = [
  {
    key: 'GOOD_DEEDS_BECOME_HERO',
    backgroundColor: 'white',
  },
  {
    key: 'GOOD_DEEDS_PROGRESS_EXPLANATION',
    backgroundColor: 'white',
  },
  {
    key: 'GOOD_DEEDS_CAMPAIGN_EXPLANATION',
    backgroundColor: 'white',
  },
]

export const firstTrackedGoodDeedsOnboardingSteps: GoodDeedsOnboardingStepItem[] = [
  {
    key: 'GOOD_DEEDS_IMPACT_STARTER',
    backgroundColor: 'yellowDefault',
  },
  {
    key: 'GOOD_DEEDS_YOU_ARE_HERO',
    backgroundColor: 'white',
  },
  {
    key: 'GOOD_DEEDS_PROGRESS_EXPLANATION',
    backgroundColor: 'white',
  },
  {
    key: 'GOOD_DEEDS_CAMPAIGN_EXPLANATION',
    backgroundColor: 'white',
  },
]

export const GoodDeedsIntroModal = () => {
  const pathname = usePathname()
  const isOnboardingScreen = pathname.includes('onboarding')
  const isLoginScreen = pathname.includes('login')
  const isDesktopView = useIsDesktopView()
  const { styles } = useStyles(stylesheet)

  const { type, visible, hide } = useGoodDeedsIntroModalState()

  const steps = type === 'first-tracked-good-deed' ? firstTrackedGoodDeedsOnboardingSteps : goodDeedsOnboardingSteps
  const firstStep = steps[0].key
  const [currentStep, setCurrentStep] = useState<GoodDeedsOnboardingStepKey>(firstStep)

  const handleClose = () => {
    hide()
    setCurrentStep(firstStep)
  }

  const handleNextStep = () => {
    const currentStepIndex = steps.findIndex((step) => step.key === currentStep)
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].key)
    } else {
      handleClose()
    }
  }

  const handleBackStep = () => {
    const currentStepIndex = steps.findIndex((step) => step.key === currentStep)
    const previousStepIndex = currentStepIndex - 1
    if (previousStepIndex >= 0) {
      setCurrentStep(steps[previousStepIndex].key)
    }
  }

  const renderStep = (key: GoodDeedsOnboardingStepKey, type: IntroFlowType) => {
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
    <HoliModal
      label=""
      desktop={isDesktopView}
      relativeHeight={1}
      autoHeight={false}
      shown={visible && !(isOnboardingScreen || isLoginScreen)} // do not show on Onboarding or Login screens
      onDismiss={handleClose}
      style={isDesktopView ? styles.modalDesktop : styles.modalMobile}
      testID="onboarding-good-deeds-modal"
    >
      <HoliStepper
        data={steps}
        activeStepKey={currentStep}
        keyExtractor={(item) => item.key}
        renderStep={({ key }) => renderStep(key as GoodDeedsOnboardingStepKey, type)}
        onChange={(key, previousKey, buttonPressed) => {
          // finish onboarding if user is on last step and clicks on continue
          if (buttonPressed === 'continue' && [key, previousKey].every((key) => key === 'GOOD_DEEDS_DO')) {
            handleClose()
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

const stylesheet = createStyleSheet((theme) => ({
  modalMobile: {
    backgroundColor: theme.colors.decorative.yellowDefault,
  },
  modalDesktop: {
    height: 408,
    maxWidth: +dimensions.maxScreenWidth,
    width: '100%',
  },
}))
