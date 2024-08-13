import React, { Children, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import FormWrapper from '@holi/core/components/FormWrapper'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliProgressBar, useProgressBarAnimation } from '@holi/ui/components/molecules/HoliProgressBar'
import HoliWizardContext from '@holi/ui/components/organisms/HoliWizard/HoliWizardContext'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface HoliWizardProps {
  onSubmit: () => Promise<void>
  onNextPress: (currentStep: number) => Promise<boolean>
  isBackButtonAvailable?: boolean
}

const HoliWizard = React.forwardRef<ScrollView, React.PropsWithChildren<HoliWizardProps>>(
  ({ children, isBackButtonAvailable = false, onNextPress, onSubmit }, ref) => {
    const { t } = useTranslation()
    const [currentStep, setCurrentStep] = useState(0)
    const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false)
    const [isSaveButtonLoading, setSaveButtonLoading] = useState(false)
    const mixins = useStyleMixins()
    const { theme } = useTheme()
    const { colors } = theme
    const styles = useMemo(() => getStyles(theme), [theme])

    const arrayChildren = Children.toArray(children)
    const stepCount = arrayChildren.length
    const progress = stepCount - currentStep > 0 ? 100 / (stepCount - currentStep) : 0
    const { percentage } = useProgressBarAnimation(progress)

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
        setSaveButtonLoading(true)
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
      <FormWrapper
        testID="holi-wizard"
        showBottomBar
        onBack={handleBackButtonPress}
        onSave={handleNextButtonPress}
        saveButtonDisabled={!isNextButtonEnabled}
        saveButtonLoading={isSaveButtonLoading}
        showBackButton={isBackButtonAvailable && currentStep > 0}
        buttonLabel={currentStep === stepCount - 1 ? t('global.save') : t('global.next')}
        scrollToInput={false}
        bottomBarStyle={styles.bottomBar}
        renderProp={() => (
          <HoliWizardContext.Provider value={wizardContext}>
            <View style={[mixins.container, styles.progressBarContainer]}>
              <HoliProgressBar percentage={percentage} />
              <StepCount />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={mixins.container} ref={ref}>
              {arrayChildren && arrayChildren[currentStep]}
            </ScrollView>
          </HoliWizardContext.Provider>
        )}
      />
    )
  }
)

HoliWizard.displayName = 'HoliWizard'

export default HoliWizard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    scrollView: {
      width: '100%',
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
    bottomBar: {
      backgroundColor: theme.colors.background10,
      ...Platform.select({
        web: {
          borderTopColor: 'transparent',
          position: 'fixed',
          alignSelf: 'center',
        },
      }),
    },
  })
