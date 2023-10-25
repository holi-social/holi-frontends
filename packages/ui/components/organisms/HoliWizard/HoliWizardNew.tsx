import React, { createContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'
import { HoliStepper, HoliStepperController, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import HoliWizardNavigationButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNavigationButtons'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const keyboardDismissWrapper = (fn: () => void | Promise<void>) => {
  return () => {
    Keyboard.dismiss()
    return fn()
  }
}

type HoliWizardStepOptions = Record<number, HoliWizardCurrentStepOptions>

export interface HoliWizardCurrentStepOptions {
  skippable?: boolean
  isBackButtonAvailable?: boolean
}

export interface NextPressHandlerOptions {
  currentStep: number
  goNext: () => void
}
type NextPressHandler = (options: NextPressHandlerOptions) => void

export interface HoliWizardProps {
  steps: React.ReactNode[]
  stepOptions: HoliWizardStepOptions
  handleNextPress: NextPressHandler
  getSubmitButtonLabel: (stepNumber: number) => string
  scrollEnabled?: boolean
  testID?: string
  isNextButtonEnabled: boolean
}

interface HoliWizardContextType {
  currentStepOptions: HoliWizardCurrentStepOptions
  onNextPress: () => void
  onBackPress: () => void
  onSkipPress?: () => void
}

const HoliWizardContext = createContext<HoliWizardContextType | null>(null)

interface HoliWizardContextProviderProps {
  stepOptions: HoliWizardStepOptions
  handleNextPress: NextPressHandler
}

const HoliWizardContextProvider: React.FC<React.PropsWithChildren<HoliWizardContextProviderProps>> = ({
  stepOptions,
  children,
  handleNextPress,
}) => {
  const { currentStep, goBack, goNext } = useStepper()
  const onNextPress = keyboardDismissWrapper(() =>
    handleNextPress({
      currentStep,
      goNext,
    })
  )
  const onBackPress = keyboardDismissWrapper(goBack)
  const onSkipPress = keyboardDismissWrapper(goNext)

  const context = {
    currentStepOptions: stepOptions[currentStep],
    onNextPress,
    onBackPress,
    onSkipPress,
  }

  return <HoliWizardContext.Provider value={context}>{children}</HoliWizardContext.Provider>
}

export const useWizard = () => {
  const context = React.useContext(HoliWizardContext)
  return context as HoliWizardContextType
}

interface HoliWizardHeaderProps {
  testID: string
}

const HoliWizardHeader: React.FC<HoliWizardHeaderProps> = ({ testID }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { currentStep, stepCount } = useStepper()
  const { currentStepOptions, onSkipPress } = useWizard()
  const { skippable } = currentStepOptions
  const progress = ((currentStep + 1) / stepCount) * 100

  return (
    <View style={[mixins.container, styles.progressBarContainer]}>
      <HoliProgressBar progress={progress} />

      <View style={styles.stepCountContainer}>
        <HoliText size="extrasmall" style={{ color: colors.foreground30 }}>
          {t('wizard.stepsCount', { current: currentStep + 1, total: stepCount })}
        </HoliText>

        {skippable && (
          <HoliButton
            label={t('global.skip')}
            inline
            transparent
            variant="small"
            onPress={onSkipPress}
            testID={`${testID}-skip-btn`}
          >
            <HoliText size="extrasmall">{t('global.skip')}</HoliText>
          </HoliButton>
        )}
      </View>
    </View>
  )
}

interface HoliWizardFooterProps {
  getSubmitButtonLabel: (stepNumber: number) => string
  isNextButtonEnabled: boolean
}
const HoliWizardFooter: React.FC<HoliWizardFooterProps> = ({ getSubmitButtonLabel, isNextButtonEnabled }) => {
  const { onNextPress, onBackPress, currentStepOptions } = useWizard()
  const { currentStep, stepCount } = useStepper()
  const { isBackButtonAvailable } = currentStepOptions
  const submitButtonLabel = getSubmitButtonLabel(currentStep)

  return (
    <HoliWizardNavigationButtons
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      submitButtonLabel={submitButtonLabel}
      isBackButtonAvailable={isBackButtonAvailable && !!currentStep}
      isNextButtonEnabled={isNextButtonEnabled}
      isLastStep={currentStep === stepCount - 1}
      style={styles.buttonContainer}
    />
  )
}

const HoliWizard: React.FC<HoliWizardProps> = ({
  steps,
  stepOptions,
  handleNextPress,
  getSubmitButtonLabel,
  isNextButtonEnabled,
  scrollEnabled = false,
  testID = 'holi-wizard',
}) => {
  return (
    <SafeAreaView style={{ flex: 1 }} testID={testID}>
      <HoliStepperController stepCount={steps.length}>
        <HoliWizardContextProvider stepOptions={stepOptions} handleNextPress={handleNextPress}>
          <HoliWizardHeader testID={testID} />

          <HoliStepper steps={steps} scrollEnabled={scrollEnabled} lazy />

          <HoliWizardFooter getSubmitButtonLabel={getSubmitButtonLabel} isNextButtonEnabled={isNextButtonEnabled} />
        </HoliWizardContextProvider>
      </HoliStepperController>
    </SafeAreaView>
  )
}

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
