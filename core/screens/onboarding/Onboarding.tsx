import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import { HoliStepper, type StepperButtonType } from '@holi/ui/components/organisms/HoliStepperV2'
import { Spacing, mono } from 'holi-bricks/foundations'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { getRouteForContentType } from './helpers/getRouteForContentType'
import { storeOnboardingState, useOnboardingState } from './hooks/onboardingState'
import {
  type OnboardingStepItem,
  type OnboardingStepKey,
  onboardingSteps,
  useOnboardingCurrentStepKey,
} from './hooks/useOnboardingCurrentStepKey'
import { useUserData } from './hooks/useUserData'
import { ChipsSelection } from './steps/ChipsSelection'
import { ContentSelection } from './steps/ContentSelection'
import { CreateAccount } from './steps/CreateAccount'
import { EmailVerification } from './steps/EmailVerification'
import { Intro } from './steps/Intro'
import LocationSelection from './steps/LocationSelection'
import { NamesSelection } from './steps/NamesSelection'
import OnboardingStepCompleted = TrackingEvent.OnboardingStepCompleted
import SignupStepCompleted = TrackingEvent.SignupStepCompleted
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { clearOnboardingUserDataAsyncStore } from './helpers/onboardingUserDataAsyncStore'
import { useCallback, useEffect } from 'react'
import { showOnboardingFinishModal } from '@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform'

const Onboarding = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets()
  const onboardingState = useOnboardingState()
  const { track } = useTracking()
  const { isLoggedIn } = useLoggedInUser()

  const [currentStep, setCurrentStep] = useOnboardingCurrentStepKey()
  const { userData, updateContent, updateLocation, updateInterests, updateSkills, clearInterests, clearSkills } =
    useUserData()

  const routeForSelectedContentType = getRouteForContentType(userData.content)
  const redirect = useRedirect(routeForSelectedContentType)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  usePreventBackNavigation(true)

  const cleanUp = async () => {
    storeOnboardingState('finished')
    await clearOnboardingUserDataAsyncStore()
  }
  const breakOnboarding = useCallback(async () => {
    await cleanUp()
    redirect(true)
  }, [redirect])

  const finishOnboarding = async () => {
    breakOnboarding()
    showOnboardingFinishModal()
  }

  // Abort and clean-up onboarding if user already is logged in when entering the screen
  useEffect(() => {
    if (isLoggedIn && onboardingState === 'finished') {
      breakOnboarding()
    }
  }, [breakOnboarding, isLoggedIn, onboardingState])

  const clearSelection = (key: OnboardingStepKey) => {
    switch (key) {
      case 'CONTENT_SELECTION':
        return updateContent(undefined)
      case 'LOCATION_SELECTION':
        return updateLocation(undefined)
      case 'INTERESTS_SELECTION':
        return clearInterests()
      case 'SKILLS_SELECTION':
        return clearSkills()
    }
  }

  // events shall only be emitted when user clicks on continue/skip/back, not during answer selection
  // therefore this callback hooks into HoliStepper.onChange
  const trackOnboardingStepCompletion = (key: OnboardingStepKey, buttonPressed: StepperButtonType) => {
    switch (key) {
      case 'CONTENT_SELECTION': {
        track(OnboardingStepCompleted('contentSelection', [userData.content as string], buttonPressed))
        break
      }
      case 'LOCATION_SELECTION': {
        track(OnboardingStepCompleted('locationSelection', [userData.location?.label as string], buttonPressed))
        break
      }
      case 'INTERESTS_SELECTION': {
        track(OnboardingStepCompleted('interestsSelection', userData.interests, buttonPressed))
        break
      }
      case 'SKILLS_SELECTION': {
        track(OnboardingStepCompleted('skillsSelection', userData.skills, buttonPressed))
        break
      }
    }
  }

  const renderStep = (key: OnboardingStepKey) => {
    switch (key) {
      case 'WELCOME_SCREEN':
        return (
          <Intro
            onContinue={() => {
              track(OnboardingStepCompleted('welcome', ['continue'], 'continue'))
              setCurrentStep('CONTENT_SELECTION')
            }}
          />
        )
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
              testID="onboarding-interests-selection"
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
            />
          </View>
        )
      case 'CREATE_ACCOUNT':
        return (
          <CreateAccount
            onLogin={() => {
              track(SignupStepCompleted({ step: 'emailAndPassword', answer: 'login' }))
            }}
            onContinueAsGuest={() => {
              track(SignupStepCompleted({ step: 'emailAndPassword', answer: 'continueAsGuest' }))
              breakOnboarding()
            }}
            onRegister={() => {
              track(SignupStepCompleted({ step: 'emailAndPassword', answer: 'signUp' }))
              metaSdk.trackSignUp()
              setCurrentStep('EMAIL_VERIFICATION')
            }}
            testID="onboarding-account-creation"
          />
        )
      case 'EMAIL_VERIFICATION':
        return (
          <EmailVerification
            onSuccess={() => {
              track(SignupStepCompleted({ step: 'verificationCode', answer: 'verifyAccount' }))
              setCurrentStep('USER_NAME_SELECTION')
            }}
            onDismiss={() => {
              track(SignupStepCompleted({ step: 'verificationCode', answer: 'continueAsGuest' }))
              breakOnboarding()
            }}
            testID="onboarding-email-verification"
          />
        )
      case 'USER_NAME_SELECTION':
        return (
          <View style={styles.nameSelectionWrapper}>
            <NamesSelection
              userData={userData}
              onFinish={() => {
                track(SignupStepCompleted({ step: 'name', answer: 'continue' }))
                finishOnboarding()
              }}
              testID="onboarding-name-selection"
            />
          </View>
        )
      default:
        throw new HoliError(`Onboarding: "${key}" is not a valid step`)
    }
  }

  if (!currentStep) return <HoliLoader testID="loader" />

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
        onChange={(key, previousKey, buttonPressed) => {
          if (buttonPressed === 'skip') {
            clearSelection(previousKey as OnboardingStepKey)
          }
          trackOnboardingStepCompletion(previousKey as OnboardingStepKey, buttonPressed)
          setCurrentStep(key as OnboardingStepKey)
        }}
        paddingTop={safeAreaTop ? safeAreaTop : Spacing.xxs}
        paddingBottom={safeAreaBottom ? safeAreaBottom : Spacing.xxs}
        testID="onboarding-stepper"
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
