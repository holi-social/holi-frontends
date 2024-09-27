import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { FirstVisitOnboardingSelectionOption } from '@holi/core/screens/onboarding/components/FirstVisitOnboardingSelection'
import {
  FirstVisitOnboardingStep,
  FirstVisitOnboardingStepProps,
} from '@holi/core/screens/onboarding/components/FirstVisitOnboardingStep'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliWizard, {
  BackPressHandlerOptions,
  NextPressHandlerOptions,
  SkipPressHandlerOptions,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNew'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type FirstVisitStep =
  | 'VOLUNTEERING_QUESTION'
  | 'ALREADY_VOLUNTEERING'
  | 'SMALL_ACTIONS'
  | 'COLLABORATION'
  | 'POST_FEATURE_PREVIEW'
  | 'NOT_VOLUNTEERING'

type ContentType = 'CHALLENGES' | 'DONATIONS' | 'VOLUNTEERING' | 'SPACES' | 'HOME'

type FirstVisitOnboardingStepOptionAction = { nextStep: FirstVisitStep } | { contentType: ContentType }

type FirstVisitOnboardingStepOptionConfiguration = FirstVisitOnboardingSelectionOption &
  FirstVisitOnboardingStepOptionAction

type FirstVisitOnboardingStepAction =
  | { options: FirstVisitOnboardingStepOptionConfiguration[] }
  | { contentType: ContentType }

type FirstVisitOnboardingStepConfiguration = Pick<FirstVisitOnboardingStepProps, 'descriptionAbove' | 'image'> &
  FirstVisitOnboardingStepAction

const onboardingSteps: { [key in FirstVisitStep]: FirstVisitOnboardingStepConfiguration } = {
  VOLUNTEERING_QUESTION: {
    descriptionAbove: true,
    options: [
      {
        id: 'ALREADY_VOLUNTEERING',
        nextStep: 'ALREADY_VOLUNTEERING',
      },
      {
        id: 'NOT_VOLUNTEERING',
        nextStep: 'NOT_VOLUNTEERING',
      },
    ],
  },
  ALREADY_VOLUNTEERING: {
    options: [
      {
        id: 'SMALL_ACTIONS',
        nextStep: 'SMALL_ACTIONS',
        image: require('@holi/ui/assets/img/onboarding/icon-small-actions.svg'),
      },
      {
        id: 'COLLABORATION',
        nextStep: 'COLLABORATION',
        image: require('@holi/ui/assets/img/onboarding/icon-collaboration.svg'),
      },
      {
        id: 'POSTS',
        nextStep: 'POST_FEATURE_PREVIEW',
        image: require('@holi/ui/assets/img/onboarding/icon-posts.svg'),
      },
      {
        id: 'EXPLORE',
        contentType: 'HOME',
        image: require('@holi/ui/assets/img/onboarding/icon-explore.svg'),
      },
    ],
  },
  SMALL_ACTIONS: {
    options: [
      {
        mobileOnly: true,
        id: 'CHALLENGES',
        contentType: 'CHALLENGES',
        image: require('@holi/ui/assets/img/onboarding/icon-challenges.svg'),
      },
      {
        id: 'DISCUSS',
        contentType: 'HOME',
        image: require('@holi/ui/assets/img/onboarding/icon-discuss.svg'),
      },
      {
        id: 'DONATIONS',
        contentType: 'DONATIONS',
        image: require('@holi/ui/assets/img/onboarding/icon-donations.svg'),
      },
      {
        id: 'SPACES',
        contentType: 'SPACES',
        image: require('@holi/ui/assets/img/onboarding/icon-spaces.svg'),
      },
    ],
  },
  COLLABORATION: {
    options: [
      {
        id: 'SPACES',
        contentType: 'SPACES',
        image: require('@holi/ui/assets/img/onboarding/icon-spaces.svg'),
      },
      {
        id: 'FEED_POSTS',
        contentType: 'HOME',
        image: require('@holi/ui/assets/img/onboarding/icon-feed-posts.svg'),
      },
    ],
  },
  POST_FEATURE_PREVIEW: {
    // no options, only info illustration
    contentType: 'HOME',
    image: {
      source: require('@holi/ui/assets/img/onboarding/posts-insights-composition.png'),
      width: 630,
      height: 680,
    },
  },
  NOT_VOLUNTEERING: {
    options: [
      {
        mobileOnly: true,
        id: 'CHALLENGES',
        contentType: 'CHALLENGES',
        image: require('@holi/ui/assets/img/onboarding/icon-challenges.svg'),
      },
      {
        id: 'POSTS',
        contentType: 'HOME',
        image: require('@holi/ui/assets/img/onboarding/icon-discuss.svg'),
      },
      {
        id: 'DONATIONS',
        contentType: 'DONATIONS',
        image: require('@holi/ui/assets/img/onboarding/icon-donations.svg'),
      },
      {
        id: 'VOLUNTEERING',
        contentType: 'VOLUNTEERING',
        image: require('@holi/ui/assets/img/onboarding/icon-volunteering.svg'),
      },
    ],
  },
}

interface FirstVisitOnboardingStepperProps {
  onContentSelection: (content: ContentType) => Promise<void>
}

type SelectionState = { [key in FirstVisitStep]?: string }

export const FirstVisitOnboardingStepper = ({ onContentSelection }: FirstVisitOnboardingStepperProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { t } = useTranslation()
  const { navigate, navigateBack } = useRouting()
  const [selections, setSelections] = useState<SelectionState>({})
  const [currentStep, setCurrentStep] = useState<FirstVisitStep>('VOLUNTEERING_QUESTION')
  const { track } = useTracking()

  const onSelectOption = useCallback(
    (step: FirstVisitStep, selection: string) =>
      setSelections({
        ...selections,
        [step]: selection,
      }),
    [selections]
  )

  // Next button is enabled if the content type is already determined by the current step or an option has already been selected
  const nextButtonEnabled = useMemo(
    () => 'contentType' in onboardingSteps[currentStep] || !!selections[currentStep],
    [currentStep, selections]
  )

  // Calculates the currently rendered steps depending on the selected options
  const stepsToRender = useMemo<FirstVisitStep[]>(() => {
    const determineNextStep = (previousStep: FirstVisitStep) => {
      const previousStepSelection = selections[previousStep]
      const stepConfiguration = onboardingSteps[previousStep]
      if (!('options' in stepConfiguration)) {
        return undefined
      }
      const options = stepConfiguration.options
      if (!options?.length) {
        return undefined
      }
      // Use first option as default to determine the next step
      const selectedOption = options.find((option) => option.id === previousStepSelection) ?? options[0]
      return 'nextStep' in selectedOption ? selectedOption.nextStep : undefined
    }

    const firstStep = 'VOLUNTEERING_QUESTION'
    const secondStep = determineNextStep(firstStep)
    const thirdStep = secondStep && determineNextStep(secondStep)
    return [firstStep, secondStep, thirdStep].filter((step) => !!step) as FirstVisitStep[]
  }, [selections])

  const steps = useMemo(
    () =>
      stepsToRender.map((step) => {
        const stepConfiguration = onboardingSteps[step]
        return (
          <ScrollView key={step}>
            <HoliBox padding={[0, 0, 96, 0]}>
              <FirstVisitOnboardingStep
                step={step}
                onSelect={(selection) => onSelectOption(step, selection)}
                options={'options' in stepConfiguration ? stepConfiguration.options : []}
                initialSelection={selections[step]}
                descriptionAbove={stepConfiguration.descriptionAbove}
                image={stepConfiguration.image}
              />
            </HoliBox>
          </ScrollView>
        )
      }),
    [onSelectOption, selections, stepsToRender]
  )

  // Handle content type if already selected, otherwise progress to next step
  const handleNextPress = useCallback(
    async ({ currentStep, goNext, setFinished }: NextPressHandlerOptions) => {
      const stepKey = stepsToRender[currentStep]
      const stepConfiguration = onboardingSteps[stepKey]
      if ('contentType' in stepConfiguration) {
        setFinished(true)
        track(TrackingEvent.OnboardingPressed(stepKey, stepConfiguration.contentType))
        await onContentSelection(stepConfiguration.contentType)
      } else {
        const selectedOptionId = selections[stepKey]
        const selectedOption = stepConfiguration.options?.find((option) => option.id === selectedOptionId)
        if (selectedOption && 'contentType' in selectedOption) {
          setFinished(true)
          track(TrackingEvent.OnboardingPressed(stepKey, selectedOption.contentType))
          await onContentSelection(selectedOption.contentType)
        } else {
          selectedOptionId && track(TrackingEvent.OnboardingPressed(stepKey, selectedOptionId))
          const nextStep = selectedOption?.nextStep
          nextStep && setCurrentStep(nextStep)
          goNext()
        }
      }
    },
    [track, stepsToRender, onContentSelection, selections]
  )

  const handleBackPress = useCallback(
    ({ currentStep, goBack }: BackPressHandlerOptions) => {
      if (currentStep > 0) {
        const curr = stepsToRender[currentStep]
        curr && track(TrackingEvent.OnboardingPressed(curr, 'BACK'))
        setCurrentStep(stepsToRender[currentStep - 1])
        goBack()
      } else {
        navigateBack()
      }
    },
    [track, stepsToRender, navigateBack]
  )

  const handleSkipPress = useCallback(
    async ({ currentStep }: SkipPressHandlerOptions) => {
      const curr = stepsToRender[currentStep]
      curr && track(TrackingEvent.OnboardingPressed(curr, 'SKIP'))
      await storeOnboardingState('finished')
      navigate('/')
    },
    [navigate, track, stepsToRender]
  )

  return (
    <View style={[styles.container]}>
      <HoliWizard
        steps={steps}
        stepOptions={{
          0: { skippable: true, isBackButtonAvailable: true },
          1: { skippable: true, isBackButtonAvailable: true },
          2: { skippable: true, isBackButtonAvailable: true },
        }}
        handleNextPress={handleNextPress}
        handleBackPress={handleBackPress}
        handleSkipPress={handleSkipPress}
        getSubmitButtonLabel={() => t('onboarding.firstVisit.continue')}
        nextButtonLabel={t('onboarding.firstVisit.continue')}
        isNextButtonEnabled={nextButtonEnabled}
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
