import React, { Children, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'
import HoliWizardContext from '@holi/ui/components/organisms/HoliWizard/HoliWizardContext'
import HoliWizardNavigationButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNavigationButtons'
import { useKeyboard } from '@holi/ui/helper'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface HoliWizardProps {
  onSubmit: () => Promise<void>
  onNextPress: (currentStep: number) => Promise<boolean>
  submitButtonLabel: string
  isBackButtonAvailable?: boolean
  testID?: string
}

const HoliWizard = React.forwardRef<ScrollView, React.PropsWithChildren<HoliWizardProps>>(
  ({ children, isBackButtonAvailable = false, onNextPress, onSubmit, submitButtonLabel, testID }, ref) => {
    const { t } = useTranslation()
    const [currentStep, setCurrentStep] = useState(0)
    const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false)
    const mixins = useStyleMixins()

    const { isKeyboardOpen } = useKeyboard()

    // TODO: This behavior of hiding on the first step only is a temporary solution for Android.
    // This will be refactored with HOLI-4689.
    const hideFooterButtons = Platform.OS === 'android' && currentStep === 0 && isKeyboardOpen

    const arrayChildren = Children.toArray(children)
    const stepCount = arrayChildren.length
    const progress = stepCount - currentStep > 0 ? 100 / (stepCount - currentStep) : 0

    const wizardContext = {
      currentStep,
      setNextButtonEnabled: setIsNextButtonEnabled,
    }

    const handleNextButtonPress = async () => {
      if (currentStep < stepCount - 1) {
        const success = await onNextPress(currentStep)
        if (success) {
          setIsNextButtonEnabled(false)
          setCurrentStep(currentStep + 1)
        }
      } else {
        await onSubmit()
      }
    }

    const handleBackButtonPress = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
      }
    }

    const StepCount = () => {
      return (
        <View style={styles.stepCountContainer}>
          <HoliText size="extrasmall" style={{ color: colors.foreground30 }}>
            {t('wizard.stepsCount', { current: currentStep + 1, total: stepCount })}
          </HoliText>
        </View>
      )
    }

    return (
      <SafeAreaView style={{ flex: 1 }} testID={testID}>
        <HoliWizardContext.Provider value={wizardContext}>
          <View style={[mixins.container, styles.progressBarContainer]}>
            <HoliProgressBar progress={progress} />
            <StepCount />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollViewContent, mixins.container]}
            ref={ref}
          >
            {arrayChildren && arrayChildren[currentStep]}
          </ScrollView>

          {!hideFooterButtons && (
            <HoliWizardNavigationButtons
              onNextPress={handleNextButtonPress}
              onBackPress={handleBackButtonPress}
              submitButtonLabel={submitButtonLabel}
              isBackButtonAvailable={isBackButtonAvailable && currentStep > 0}
              isNextButtonEnabled={isNextButtonEnabled}
              isLastStep={currentStep === stepCount - 1}
              style={styles.buttonContainer}
            />
          )}
        </HoliWizardContext.Provider>
      </SafeAreaView>
    )
  }
)

HoliWizard.displayName = 'HoliWizard'

export default HoliWizard

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: BUTTON_RECTS.height + BUTTON_RECTS.paddingBottom + 24,
  },
  stepCountContainer: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  progressBarContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingTop: 42,
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
