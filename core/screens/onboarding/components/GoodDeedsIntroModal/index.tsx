import React, { useState } from 'react'

import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliStepper, type HoliStepperItem } from '@holi/ui/components/organisms/HoliStepperV2'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

import { GoodDeedsExplainMobile } from './components/GoodDeedsExplainMobile'
import { GoodDeedsDoMobile } from './components/GoodDeedsDoMobile'
import { GoodDeedsExplainDesktop } from './components/GoodDeedsExplainDesktop'
import { GoodDeedsDoDesktop } from './components/GoodDeedsDoDesktop'
import { GoodDeedsIntroFooterNavigation } from './components/GoodDeedsIntroFooterNavigation'
import { useGoodDeedsIntroModalState } from './helpers/useGoodDeedsIntroModalState'
import { useIsDesktopView } from './helpers/isDesktopView'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GoodDeedsOnboardingStepKeys = ['GOOD_DEEDS_EXPLANATION', 'GOOD_DEEDS_DO'] as const
export type GoodDeedsOnboardingStepKey = (typeof GoodDeedsOnboardingStepKeys)[number]

export interface GoodDeedsOnboardingStepItem extends HoliStepperItem {
  key: GoodDeedsOnboardingStepKey
}

export const goodDeedsOnboardingStepsDesktop: GoodDeedsOnboardingStepItem[] = [
  {
    key: 'GOOD_DEEDS_EXPLANATION',
    backgroundColor: 'white',
  },
  {
    key: 'GOOD_DEEDS_DO',
  },
]

export const goodDeedsOnboardingStepsMobile: GoodDeedsOnboardingStepItem[] = [
  {
    key: 'GOOD_DEEDS_EXPLANATION',
    FooterNavigationComponent: GoodDeedsIntroFooterNavigation,
    footerNavigation: { isBackButtonAvailable: false, nextButtonLabel: 'onboarding.modal.step01.buttonPrimary' },
    backgroundColor: 'white',
  },
  {
    key: 'GOOD_DEEDS_DO',
    FooterNavigationComponent: GoodDeedsIntroFooterNavigation,
    footerNavigation: { isBackButtonAvailable: true, nextButtonLabel: 'onboarding.modal.step02.buttonPrimary' },
    backgroundColor: 'yellowDefault',
  },
]

export const GoodDeedsIntroModal = () => {
  const isDesktopView = useIsDesktopView()
  const { styles } = useStyles(stylesheet)

  const [currentStep, setCurrentStep] = useState<GoodDeedsOnboardingStepKey>('GOOD_DEEDS_EXPLANATION')

  const { visible, hide } = useGoodDeedsIntroModalState()

  const handleClose = () => {
    hide()
    setCurrentStep('GOOD_DEEDS_EXPLANATION')
  }

  const renderStep = isDesktopView
    ? (key: GoodDeedsOnboardingStepKey) => {
        switch (key) {
          case 'GOOD_DEEDS_EXPLANATION':
            return <GoodDeedsExplainDesktop onNextPress={() => setCurrentStep('GOOD_DEEDS_DO')} />
          case 'GOOD_DEEDS_DO':
            return (
              <GoodDeedsDoDesktop
                onNextPress={handleClose}
                onBackPress={() => setCurrentStep('GOOD_DEEDS_EXPLANATION')}
              />
            )
          default:
            throw new HoliError(`Good Deeds Onboarding: "${key}" is not a valid step`)
        }
      }
    : (key: GoodDeedsOnboardingStepKey) => {
        switch (key) {
          case 'GOOD_DEEDS_EXPLANATION':
            return <GoodDeedsExplainMobile />
          case 'GOOD_DEEDS_DO':
            return <GoodDeedsDoMobile />
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
        data={isDesktopView ? goodDeedsOnboardingStepsDesktop : goodDeedsOnboardingStepsMobile}
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
