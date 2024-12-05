import type React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliStepper } from '@holi/ui/components/organisms/HoliStepperV2'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'

import CreateAccount from './steps/CreateAccount'
import EmailVerification from './steps/EmailVerification'
import NamesStep from './steps/NamesSelection'
import { Intro } from './steps/Intro'
import { ContentSelection } from './steps/ContentSelection'
import { storeOnboardingState } from './hooks/onboardingState'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { mono, Spacing } from 'holi-bricks/tokens'
import LocationSelection from './steps/LocationSelection'
import { ChipsSelection } from './steps/ChipsSelection'
import { useUserData } from './hooks/useUserData'
import { getRouteForContentType } from './helpers/getRouteForContentType'
import { showOnboardingFinishModal } from './hooks/useOnboardingFinishModalState'
import {
  type OnboardingStepItem,
  type OnboardingStepKey,
  onboardingSteps,
  useOnbaordingCurrentStepKey,
} from './hooks/useOnbaordingCurrentStepKey'
import { clearOnboardingUserDataAsyncStore } from './helpers/onboardingUserDataAsyncStore'

const Onboarding = () => {
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets()

  const [currentStep, setCurrentStep] = useOnbaordingCurrentStepKey()
  const {
    userData,
    updateContent,
    updateLocation,
    updateInterests,
    updateSkills,
    interestsSearchProps,
    skillsSearchProps,
  } = useUserData()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  usePreventBackNavigation(true)

  const cleanUp = () => Promise.all([storeOnboardingState('finished'), clearOnboardingUserDataAsyncStore()])
  const breakOnboarding = async () => {
    const path = getRouteForContentType(userData.content)
    await cleanUp()
    replaceRoute(path)
  }
  const finishOnboarding = async () => {
    breakOnboarding()
    showOnboardingFinishModal()
  }

  const renderStep = (key: OnboardingStepKey) => {
    switch (key) {
      case 'WELCOME_SCREEN':
        return <Intro onContinue={() => setCurrentStep('CONTENT_SELECTION')} />
      case 'CONTENT_SELECTION':
        return (
          <View style={styles.stepWrapper}>
            <ContentSelection
              onChange={updateContent}
              selectedOption={userData.content}
              testID="onboarding-content-selection"
            />
          </View>
        )
      case 'LOCATION_SELECTION':
        return (
          <View style={styles.stepWrapper}>
            <LocationSelection
              selected={userData.location}
              onChange={updateLocation}
              testID="onboarding-location-selection"
            />
          </View>
        )
      case 'INTERESTS_SELECTION':
        return (
          <View style={styles.stepWrapper}>
            <ChipsSelection
              chipType="interests"
              selectedChipIds={userData.interests}
              onSelect={updateInterests}
              testID="onboarding-intrests-selection"
              {...interestsSearchProps}
            />
          </View>
        )
      case 'SKILLS_SELECTION':
        return (
          <View style={styles.stepWrapper}>
            <ChipsSelection
              chipType="skills"
              selectedChipIds={userData.skills}
              onSelect={updateSkills}
              testID="onboarding-skills-selection"
              {...skillsSearchProps}
            />
          </View>
        )
      case 'CREATE_ACCOUNT':
        return (
          <CreateAccount
            onDismiss={breakOnboarding}
            onRegister={() => setCurrentStep('EMAIL_VERIFICATION')}
            testID="onboarding-account-creation"
          />
        )
      case 'EMAIL_VERIFICATION':
        return (
          <EmailVerification
            onSuccess={() => setCurrentStep('USER_NAME_SELECTION')}
            onDismiss={breakOnboarding}
            testID="onboarding-email-verification"
          />
        )
      case 'USER_NAME_SELECTION':
        return (
          <View style={styles.nameSelectionWrapper}>
            <NamesStep userData={userData} onFinish={finishOnboarding} testID="onboarding-finish-modal" />
          </View>
        )
      default:
        throw new HoliError(`Onboarding: "${key}" is not a valid step`)
    }
  }

  if (!currentStep) return <HoliLoader />

  // Modify footer navigation `nextButtonLabel` based on user data for `LOCATION_SELECTION`, `INTERESTS_SELECTION` and `SKILLS_SELECTION`
  // It is not an good way to do it like that because we update `onboardingSteps` object on every change,
  // but as designers mean it is VERY important for then! So, here we are.
  const modifyStepWithNextButtonLabel = (step: OnboardingStepItem): OnboardingStepItem => {
    const stepKeyToNextButtonLabel: Partial<Record<OnboardingStepItem['key'], string | null>> = {
      LOCATION_SELECTION: !userData.location ? t('onboarding.location.nextButtonLabel.skip') : null,
      INTERESTS_SELECTION: userData.interests.length === 0 ? t('onboarding.interests.nextButtonLabel.skip') : null,
      SKILLS_SELECTION: userData.skills.length === 0 ? t('onboarding.skills.nextButtonLabel.skip') : null,
    }

    return step.key in stepKeyToNextButtonLabel
      ? {
          ...step,
          footerNavigation: {
            ...step.footerNavigation,
            nextButtonLabel: stepKeyToNextButtonLabel[step.key] ?? t('onboarding.welcome.forward'),
          },
        }
      : step
  }

  return (
    <HoliKeyboardSafeAreaView style={styles.wrapper}>
      <HoliStepper
        data={onboardingSteps.map(modifyStepWithNextButtonLabel)}
        activeStepKey={currentStep}
        keyExtractor={(item) => item.key}
        renderStep={({ key }) => renderStep(key as OnboardingStepKey)}
        onChange={(key) => setCurrentStep(key as OnboardingStepKey)}
        paddingTop={safeAreaTop ? safeAreaTop : Spacing.xxs}
        paddingBottom={safeAreaBottom ? safeAreaBottom : Spacing.xxs}
      />
    </HoliKeyboardSafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: mono[200],
    flex: 1,
  },
  stepWrapper: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  nameSelectionWrapper: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing['4xs'],
    flex: 1,
  },
})

export default Onboarding
