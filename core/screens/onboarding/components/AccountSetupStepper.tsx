import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliWizard, {
  type BackPressHandlerOptions,
  type NextPressHandlerOptions,
  type SkipPressHandlerOptions,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNew'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ContentSelectionStep } from '@holi/core/screens/onboarding/components/ContentSelectionStep'

interface AccountSetupStepperProps {
  onContentSelection: (contentType: string) => Promise<void>
  onFinish: () => void
}

const stepKeys = ['CONTENT_SELECTION']

export const AccountSetupStepper = ({ onContentSelection, onFinish }: AccountSetupStepperProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { t } = useTranslation()
  const { navigateBack } = useRouting()
  const { track } = useTracking()
  const [selectedContent, setSelectedContent] = useState<string>()

  // Handle content type if already selected, otherwise progress to next step
  const handleNextPress = useCallback(
    async ({ currentStep, goNext, setFinished }: NextPressHandlerOptions) => {
      if (stepKeys[currentStep] === 'CONTENT_SELECTION') {
        if (!selectedContent) {
          return
        }
        setFinished(true)
        track(TrackingEvent.OnboardingPressed(stepKeys[currentStep], selectedContent))
        await onContentSelection(selectedContent)
        onFinish()
      } else {
        goNext()
      }
    },
    [selectedContent, track, onContentSelection, onFinish]
  )

  const handleBackPress = useCallback(
    ({ currentStep, goBack }: BackPressHandlerOptions) => {
      if (currentStep === 0) {
        navigateBack()
      } else {
        goBack()
      }
    },
    [navigateBack]
  )

  const handleSkipPress = useCallback(
    async ({ currentStep, goNext }: SkipPressHandlerOptions) => {
      const stepKey = stepKeys[currentStep]
      if (stepKey === 'CONTENT_SELECTION') {
        track(TrackingEvent.OnboardingPressed(stepKey, 'SKIP'))
        onFinish()
      } else {
        goNext()
      }
    },
    [track, onFinish]
  )

  return (
    <View style={[styles.container]}>
      <HoliWizard
        steps={[
          <ScrollView key={stepKeys[0]}>
            <ContentSelectionStep onSelect={setSelectedContent} selectedOption={selectedContent} />
            <HoliGap size="xl" />
            <HoliGap size="ml" />
          </ScrollView>,
        ]}
        stepOptions={{
          0: { skippable: true, isBackButtonAvailable: true },
        }}
        handleNextPress={handleNextPress}
        handleBackPress={handleBackPress}
        handleSkipPress={handleSkipPress}
        getSubmitButtonLabel={() => t('onboarding.accountSetup.continue')}
        nextButtonLabel={t('onboarding.accountSetup.continue')}
        isNextButtonEnabled={!!selectedContent}
        initialBackButton={true}
      />
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      flex: 1,
    },
  })
