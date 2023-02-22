import React, { Children, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'
import HoliWizardContext from '@holi/ui/components/organisms/HoliWizard/HoliWizardContext'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface HoliWizardProps {
  testID?: string
  onNextPress: (currentStep: number) => Promise<boolean>
  onSubmit: () => Promise<void>
  isBackButtonAvailable?: boolean
  submitButtonLabel: string
}

const HoliWizard = ({
  children,
  isBackButtonAvailable = false,
  onNextPress,
  onSubmit,
  submitButtonLabel,
  testID,
}: React.PropsWithChildren<HoliWizardProps>) => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { height: deviceHeight } = useWindowDimensions()
  const mixins = useStyleMixins()

  const arrayChildren = Children.toArray(children)
  const stepCount = arrayChildren.length
  const progress = stepCount - currentStep > 0 ? 100 / (stepCount - currentStep) : 0

  const setNextButtonEnabled = (buttonStatus: boolean) => {
    setIsNextButtonEnabled(buttonStatus)
  }
  const wizardContext = {
    setNextButtonEnabled,
  }

  const handleNextButtonPress = async () => {
    try {
      setIsLoading(true)
      if (currentStep < stepCount - 1) {
        const success = await onNextPress(currentStep)
        if (success) {
          setIsNextButtonEnabled(false)
          setCurrentStep(currentStep + 1)
        }
      } else {
        await onSubmit()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackButtonPress = () => {
    if (currentStep !== 0 && currentStep > 0) {
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

  const NavigationButtons = () => {
    return (
      <View style={[mixins.container, styles.buttonContainer]}>
        {isBackButtonAvailable && currentStep > 0 && (
          <HoliButton
            label={t('global.back')}
            disabled={false}
            onPress={handleBackButtonPress}
            testID="holi-wizard-back-btn"
            style={styles.backButton}
          >
            <HoliIcon icon={'arrow-left'} size={24} color={colors.foreground30} />
          </HoliButton>
        )}
        <View style={{ flex: 1 }}>
          <HoliButtonLoading
            disabled={!isNextButtonEnabled || isLoading}
            label={
              isLoading ? t('global.loading') : currentStep === stepCount - 1 ? submitButtonLabel : t('global.next')
            }
            onPress={handleNextButtonPress}
            testID="holi-wizard-next-btn"
            style={styles.nextButton}
            icon={isLoading ? 'loader-4' : undefined}
            iconSpinning={isLoading}
          />
        </View>
      </View>
    )
  }

  return (
    <HoliWizardContext.Provider value={wizardContext}>
      <View testID={testID} style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
        <View style={styles.progressBarContainer}>
          <HoliProgressBar progress={progress} />
          <StepCount />
        </View>
        <ScrollView style={styles.content}>{arrayChildren && arrayChildren[currentStep]}</ScrollView>
        <NavigationButtons />
      </View>
    </HoliWizardContext.Provider>
  )
}

export default HoliWizard

const styles = StyleSheet.create({
  defaultLayout: {
    paddingBottom: 0,
  },
  contentStyle: {
    paddingBottom: 0,
    display: 'flex',
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: Platform.OS === 'web' ? vars.topBarHeight : 44,
  },
  content: {
    width: '100%',
  },
  stepsContainer: {
    paddingHorizontal: 0,
  },
  stepCountContainer: { alignSelf: 'flex-start', marginTop: 12 },
  progressBarContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingTop: 16,
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: colors.background10,
  },
  nextButton: { height: 56, width: '100%' },
  buttonContainer: {
    bottom: Platform.OS === 'web' ? 0 : vars.topBarHeight,
    paddingHorizontal: Platform.OS === 'web' ? 24 : 0,
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
    paddingBottom: 28,
  },
})
