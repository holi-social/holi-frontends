import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, Text, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type HoliWizardProps = {
  children: Array<React.ReactChild>
  testID?: string
  onNextPress?: () => void
  onSubmit?: () => void
  isNextButtonDisabled?: boolean
  isBackButtonAvailable?: boolean
  buttonName: string
}

const HoliWizard: React.VFC<HoliWizardProps> = ({
  children,
  isNextButtonDisabled = false,
  isBackButtonAvailable = true,
  onNextPress,
  onSubmit,
  buttonName,
  testID,
}: HoliWizardProps) => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepCount, setStepCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isBackButton, setIsBackButton] = useState(true)
  const [isLastStep, setIsLastStep] = useState(false)

  useEffect(() => {
    const currentProgress = stepCount - currentStep
    const progressPercentage = currentProgress > 0 ? 100 / currentProgress : 0
    setProgress(progressPercentage)
    const displayBackButton = isBackButtonAvailable && currentStep > 0
    setIsBackButton(displayBackButton)
    const isLast = currentStep === stepCount - 1
    setIsLastStep(isLast)
  }, [currentStep, stepCount, isBackButtonAvailable])

  useEffect(() => {
    if (children) {
      setStepCount(children.length)
    }
  }, [children])

  const handleNextButtonPress = () => {
    if (currentStep < stepCount - 1) {
      setCurrentStep(currentStep + 1)
    }
    if (isLastStep) {
      onSubmit
    } else {
      onNextPress
    }
  }

  const handleBackButtonPress = () => {
    if (currentStep !== 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const StepCount = () => {
    return (
      <View style={styles.stepCountContainer}>
        <HoliText size="extrasmall" style={{ color: colors.fontColorBlack }}>
          {t('wizard.stepsCount', { current: currentStep + 1, total: stepCount })}
        </HoliText>
      </View>
    )
  }

  const NavigationButtons = () => {
    return (
      <View style={[styles.buttonContainer]}>
        {isBackButton && (
          <HoliButton
            label={t('global.next')}
            disabled={false}
            onPress={handleBackButtonPress}
            testID="holi-wizard-next-btn"
            style={styles.backButton}
          >
            <HoliIcon icon={'arrow-left'} size={24} color={colors.fontColorBlack} />
          </HoliButton>
        )}
        <View style={{ flex: 1 }}>
          <HoliButton
            disabled={isNextButtonDisabled}
            label={t('global.next')}
            onPress={handleNextButtonPress}
            testID="holi-wizard-next-btn"
            style={styles.nextButton}
          >
            <Text>{isLastStep ? buttonName : t('global.next')}</Text>
          </HoliButton>
        </View>
      </View>
    )
  }

  return (
    <View testID={testID} style={styles.container}>
      <HoliProgressBar progress={progress} />
      <StepCount />
      {children && children[currentStep]}
      <NavigationButtons />
    </View>
  )
}

export default HoliWizard

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    padding: 24,
    paddingTop: 16,
  },
  stepCountContainer: { alignSelf: 'flex-start', marginTop: 12 },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: colors.backgroundColorWhite,
  },
  nextButton: { height: 56 },
  buttonContainer: {
    bottom: vars.topBarHeight + 30,
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
  },
})
