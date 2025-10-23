import React, {} from 'react'

import HoliModal from '@holi/ui/components/molecules/HoliModal'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'

import { useGoodDeedsIntroModalState } from './helpers/useGoodDeedsIntroModalState'
import { useIsDesktopView } from './helpers/isDesktopView'
import { GoodDeedsIntroStepper } from './GoodDeedsIntroStepper'
import type { GoodDeedsOnboardingStepItem } from './types'

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

  if (!visible || !type) return null

  return (
    <HoliModal
      label="Good Deeds Onboarding"
      desktop={isDesktopView}
      relativeHeight={1}
      autoHeight={false}
      shown={visible && !(isOnboardingScreen || isLoginScreen)} // do not show on Onboarding or Login screens
      onDismiss={hide}
      style={isDesktopView ? styles.modalDesktop : styles.modalMobile}
      testID="onboarding-good-deeds-modal"
    >
      {/* Use key to reset the stepper when the type changes */}
      <GoodDeedsIntroStepper key={type} type={type} steps={steps} onEnd={hide} />
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
