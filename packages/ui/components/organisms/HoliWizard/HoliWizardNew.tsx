import React, { createContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliProgressBar, useProgressBarAnimation } from '@holi/ui/components/molecules/HoliProgressBar'
import { HoliStepper, HoliStepperController, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import HoliWizardNavigationButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNavigationButtons'
import { useTheme } from '@holi/ui/styles/theme'
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
  setFinished: (value: boolean) => void
}
type NextPressHandler = (options: NextPressHandlerOptions) => Promise<void>

export interface SkipPressHandlerOptions {
  currentStep: number
  goNext: () => void
}
type SkipPressHandler = (options: SkipPressHandlerOptions) => void

export interface BackPressHandlerOptions {
  currentStep: number
  goBack: () => void
}
type BackPressHandler = (options: BackPressHandlerOptions) => void

export interface HoliWizardProps {
  steps: React.ReactNode[]
  stepOptions: HoliWizardStepOptions
  handleNextPress: NextPressHandler
  handleBackPress?: BackPressHandler
  handleSkipPress?: SkipPressHandler
  getSubmitButtonLabel: (stepNumber: number) => string
  scrollEnabled?: boolean
  testID?: string
  nextButtonLabel?: string
  isNextButtonEnabled: boolean
  initialBackButton?: boolean
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
  handleSkipPress?: SkipPressHandler
  handleBackPress?: BackPressHandler
}

const HoliWizardContextProvider: React.FC<React.PropsWithChildren<HoliWizardContextProviderProps>> = ({
  stepOptions,
  children,
  handleNextPress,
  handleSkipPress,
  handleBackPress,
}) => {
  const { currentStep, goBack, goNext, setFinished } = useStepper()
  const onNextPress = keyboardDismissWrapper(async () => {
    return handleNextPress({
      currentStep,
      goNext,
      setFinished,
    })
  })
  const onBackPress = keyboardDismissWrapper(() => {
    setFinished(false)
    return handleBackPress
      ? handleBackPress({
          currentStep,
          goBack,
        })
      : goBack()
  })
  const onSkipPress = keyboardDismissWrapper(() => {
    handleSkipPress
      ? handleSkipPress({
          currentStep,
          goNext,
        })
      : goNext()
  })

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
  const { currentStep, stepCount, finished } = useStepper()
  const { currentStepOptions, onSkipPress } = useWizard()
  const { skippable } = currentStepOptions
  const progress = finished && currentStep >= stepCount - 1 ? 100 : (currentStep / stepCount) * 100
  const { percentage } = useProgressBarAnimation(progress)

  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View style={[mixins.container, styles.progressBarContainer]}>
      <HoliProgressBar percentage={percentage} />

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
  nextButtonLabel?: string
  isNextButtonEnabled: boolean
  initialBackButton?: boolean
}
const HoliWizardFooter: React.FC<HoliWizardFooterProps> = ({
  getSubmitButtonLabel,
  nextButtonLabel,
  isNextButtonEnabled,
  initialBackButton,
}) => {
  const { onNextPress, onBackPress, currentStepOptions } = useWizard()
  const { currentStep, stepCount } = useStepper()
  const { isBackButtonAvailable } = currentStepOptions
  const submitButtonLabel = getSubmitButtonLabel(currentStep)

  return (
    <HoliWizardNavigationButtons
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      submitButtonLabel={submitButtonLabel}
      nextButtonLabel={nextButtonLabel}
      isBackButtonAvailable={isBackButtonAvailable && (!!currentStep || initialBackButton)}
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
  handleBackPress,
  handleSkipPress,
  getSubmitButtonLabel,
  nextButtonLabel,
  isNextButtonEnabled,
  initialBackButton = false,
  scrollEnabled = false,
  testID = 'holi-wizard',
}) => {
  return (
    <View style={{ flex: 1 }} testID={testID}>
      <HoliStepperController stepCount={steps.length}>
        <HoliWizardContextProvider
          stepOptions={stepOptions}
          handleNextPress={handleNextPress}
          handleSkipPress={handleSkipPress}
          handleBackPress={handleBackPress}
        >
          <HoliWizardHeader testID={testID} />

          <HoliStepper steps={steps} scrollEnabled={scrollEnabled} lazy />

          <HoliWizardFooter
            getSubmitButtonLabel={getSubmitButtonLabel}
            nextButtonLabel={nextButtonLabel}
            isNextButtonEnabled={isNextButtonEnabled}
            initialBackButton={initialBackButton}
          />
        </HoliWizardContextProvider>
      </HoliStepperController>
    </View>
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
