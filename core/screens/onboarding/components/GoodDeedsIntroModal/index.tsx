import React, { useState } from 'react'

import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliStepper, type HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

import { GoodDeedsBecomeHero } from './components/GoodDeedsBecomeHero'
import { GoodDeedsProgressExplanation } from './components/GoodDeedsProgressExplanation'
import { useGoodDeedsIntroModalState } from './helpers/useGoodDeedsIntroModalState'
import { useIsDesktopView } from './helpers/isDesktopView'
import { GoodDeedsCampaignExplanation } from './components/GoodDeedsCampaignExplanation'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GoodDeedsOnboardingStepKeys = [
  'GOOD_DEEDS_BECOM_HERO',
  'GOOD_DEEDS_PROGRESS_EXPLANATION',
  'GOOD_DEEDS_CAMPAIGN_EXPLANATION',
] as const
export type GoodDeedsOnboardingStepKey = (typeof GoodDeedsOnboardingStepKeys)[number]

export interface GoodDeedsOnboardingStepItem extends HoliStepperItem {
  key: GoodDeedsOnboardingStepKey
}

export const goodDeedsOnboardingSteps: GoodDeedsOnboardingStepItem[] = [
  {
    key: 'GOOD_DEEDS_BECOM_HERO',
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
  const isDesktopView = useIsDesktopView()
  const { styles } = useStyles(stylesheet)

  const [currentStep, setCurrentStep] = useState<GoodDeedsOnboardingStepKey>(goodDeedsOnboardingSteps[0].key)

  const { visible, hide } = useGoodDeedsIntroModalState()

  const handleClose = () => {
    hide()
    setCurrentStep('GOOD_DEEDS_BECOM_HERO')
  }

  const handleNextStep = () => {
    const currentStepIndex = goodDeedsOnboardingSteps.findIndex((step) => step.key === currentStep)
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < goodDeedsOnboardingSteps.length) {
      setCurrentStep(goodDeedsOnboardingSteps[nextStepIndex].key)
    } else {
      handleClose()
    }
  }

  const handleBackStep = () => {
    const currentStepIndex = goodDeedsOnboardingSteps.findIndex((step) => step.key === currentStep)
    const previousStepIndex = currentStepIndex - 1
    if (previousStepIndex >= 0) {
      setCurrentStep(goodDeedsOnboardingSteps[previousStepIndex].key)
    }
  }

  const renderStep = (key: GoodDeedsOnboardingStepKey) => {
    switch (key) {
      case 'GOOD_DEEDS_BECOM_HERO':
        return <GoodDeedsBecomeHero onNextPress={handleNextStep} />
      case 'GOOD_DEEDS_PROGRESS_EXPLANATION':
        return <GoodDeedsProgressExplanation onNextPress={handleNextStep} onBackPress={handleBackStep} />
      case 'GOOD_DEEDS_CAMPAIGN_EXPLANATION':
        return <GoodDeedsCampaignExplanation onNextPress={handleNextStep} onBackPress={handleBackStep} />
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
      shown={visible}
      onDismiss={handleClose}
      style={isDesktopView ? styles.modalDesktop : styles.modalMobile}
      testID="onboarding-good-deeds-modal"
    >
      <HoliStepper
        data={goodDeedsOnboardingSteps}
        activeStepKey={currentStep}
        keyExtractor={(item) => item.key}
        renderStep={({ key }) => renderStep(key as GoodDeedsOnboardingStepKey)}
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
