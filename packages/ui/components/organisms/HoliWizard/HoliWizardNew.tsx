import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'
import { HoliStepper } from '@holi/ui/components/organisms/HoliStepper'
import HoliWizardNaviagtionButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNaviagtionButtons'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface HoliWizardCurrentStepOptions {
  skipable?: boolean
  isBackButtonAvailable?: boolean
}

export interface HoliWizardProps {
  steps: React.ReactNode[]
  currentStep: number
  currentStepOptions: HoliWizardCurrentStepOptions
  screenWidth: number
  onNextPress: () => void
  onBackPress: () => void
  onSkipPress?: () => void
  submitButtonLabel: string
  isNextButtonEnabled?: boolean
  isLoading?: boolean
  scrollEnabled?: boolean
  testID?: string
}

const HoliWizard = forwardRef<ScrollView, HoliWizardProps>(
  (
    {
      steps,
      currentStep,
      currentStepOptions,
      screenWidth,
      onNextPress,
      onSkipPress,
      onBackPress,
      submitButtonLabel,
      isNextButtonEnabled,
      isLoading,
      scrollEnabled = false,
      testID = 'holi-wizard',
    },
    ref
  ) => {
    const { t } = useTranslation()
    const mixins = useStyleMixins()

    const stepCount = steps.length
    const { skipable = false, isBackButtonAvailable = true } = currentStepOptions
    const progress = ((currentStep + 1) / stepCount) * 100

    const keyboardDismissWrapper = (fn?: () => void) => {
      return () => {
        Keyboard.dismiss()
        fn?.()
      }
    }

    return (
      <SafeAreaView style={{ flex: 1 }} testID={testID}>
        <View style={[mixins.container, styles.progressBarContainer]}>
          <HoliProgressBar progress={progress} />

          <View style={styles.stepCountContainer}>
            <HoliText size="extrasmall" style={{ color: colors.foreground30 }}>
              {t('wizard.stepsCount', { current: currentStep + 1, total: stepCount })}
            </HoliText>

            {skipable && (
              <HoliButton
                label={t('global.skip')}
                inline
                transparent
                variant="small"
                onPress={keyboardDismissWrapper(onSkipPress)}
                testID={`${testID}-skip-btn`}
              >
                <HoliText size="extrasmall">{t('global.skip')}</HoliText>
              </HoliButton>
            )}
          </View>
        </View>

        <HoliStepper
          steps={steps}
          currentStep={currentStep}
          width={screenWidth}
          ref={ref}
          style={{ flexGrow: 1, flexShrink: 1 }}
          scrollEnabled={scrollEnabled}
          lazy
        />

        <HoliWizardNaviagtionButtons
          onNextPress={keyboardDismissWrapper(onNextPress)}
          onBackPress={keyboardDismissWrapper(onBackPress)}
          submitButtonLabel={submitButtonLabel}
          isBackButtonAvailable={isBackButtonAvailable && !!currentStep}
          isNextButtonEnabled={isNextButtonEnabled}
          isLastStep={currentStep === stepCount - 1}
          isLoading={isLoading}
          style={styles.buttonContainer}
        />
      </SafeAreaView>
    )
  }
)

HoliWizard.displayName = 'HoliWizard'

export default HoliWizard

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  scrollView: {
    width: '100%',
  },
  stepCountContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    width: '100%',
    justifyContent: 'center',
    flexShrink: 0,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
  },
  buttonContainer: {
    bottom: 0,
    paddingBottom: BUTTON_RECTS.paddingBottom,

    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      native: {
        position: 'absolute',
      },
      default: {
        position: 'fixed',
      },
    }),
    justifyContent: 'center',
  },
})
