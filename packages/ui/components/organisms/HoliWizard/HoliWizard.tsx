import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'
import HoliWizardContext from '@holi/ui/components/organisms/HoliWizard/HoliWizardContext'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type HoliWizardProps = {
  children: Array<React.ReactChild>
  testID?: string
  onNextPress: () => void
  onSubmit: () => void
  isBackButtonAvailable?: boolean
  submitButtonLabel: string
}

const HoliWizard: React.VFC<HoliWizardProps> = ({
  children,
  isBackButtonAvailable = false,
  onNextPress,
  onSubmit,
  submitButtonLabel,
  testID,
}: HoliWizardProps) => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false)
  const { height: deviceHeight } = useWindowDimensions()
  const mixins = useStyleMixins()

  const stepCount = children && children.length
  const progress = stepCount - currentStep > 0 ? 100 / (stepCount - currentStep) : 0

  const setNextButtonEnabled = (buttonStatus: boolean) => {
    setIsNextButtonEnabled(buttonStatus)
  }
  const wizardContext = { setNextButtonEnabled }

  const handleNextButtonPress = () => {
    if (currentStep < stepCount - 1) {
      setCurrentStep(currentStep + 1)
    }
    if (currentStep === stepCount - 1) {
      onSubmit()
    } else {
      onNextPress()
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
        <HoliText size="extrasmall" style={{ color: colors.fontColorBlack }}>
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
            disabled={!isNextButtonEnabled}
            label={t('global.next')}
            onPress={handleNextButtonPress}
            testID="holi-wizard-next-btn"
            style={styles.nextButton}
          >
            <Text>{currentStep === stepCount - 1 ? submitButtonLabel : t('global.next')}</Text>
          </HoliButton>
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
        {children && children[currentStep]}
        <NavigationButtons />
      </View>
    </HoliWizardContext.Provider>
  )
}

export default HoliWizard

const styles = StyleSheet.create({
  defaultLayout: {
    width: '100%',
    paddingBottom: 0,
    ...Platform.select({
      web: {
        minHeight: '100vh',
        minWidth: '100vh',
      },
    }),
  },
  contentStyle: {
    paddingBottom: 0,
    display: 'flex',
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: Platform.OS === 'web' ? vars.topBarHeight : 44,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
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
    backgroundColor: colors.backgroundColorWhite,
  },
  nextButton: { height: 56, width: '100%' },
  buttonContainer: {
    bottom: Platform.OS === 'web' ? 10 : vars.topBarHeight,
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
