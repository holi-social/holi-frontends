import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import { HoliStepper } from '@holi/ui/components/organisms/HoliStepperV2'
import { mono, Spacing } from 'holi-bricks/foundations'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { pathToRedirect, useRedirect } from '@holi/core/navigation/hooks/useRedirect'

import { storeOnboardingState, useOnboardingState } from './hooks/onboardingState'
import {
  type OnboardingStepKey,
  onboardingSteps,
  useOnboardingCurrentStepKey,
} from './hooks/useOnboardingCurrentStepKey'
import { Authentication, type AuthenticationParams } from '@holi/core/screens/auth/Authentication'
import { EmailVerification } from './steps/EmailVerification'
import { Intro } from './steps/Intro'
import { NamesSelection } from './steps/NamesSelection'
import { clearOnboardingUserDataAsyncStore } from './helpers/onboardingUserDataAsyncStore'
import { useGoodDeedsIntroModalState } from './components/GoodDeedsIntroModal/helpers/useGoodDeedsIntroModalState'
import { getRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'

import OnboardingStepCompleted = TrackingEvent.OnboardingStepCompleted
import SignupStepCompleted = TrackingEvent.SignupStepCompleted

export type OnboardingParams = AuthenticationParams

const Onboarding = () => {
  const setScreenOptions = useSetScreenOptions()
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets()
  const onboardingState = useOnboardingState()
  const { track } = useTracking()
  const { isLoggedIn } = useLoggedInUser()
  const [currentStep, setCurrentStep] = useOnboardingCurrentStepKey()
  const redirect = useRedirect('/act')

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  usePreventBackNavigation(true)

  const { show: showGoodDeedsIntroModal } = useGoodDeedsIntroModalState()
  const cleanUp = async () => {
    storeOnboardingState('finished')
    await clearOnboardingUserDataAsyncStore()
  }
  const finishOnboarding = useCallback(async () => {
    await cleanUp()

    const redirectPath = pathToRedirect() ?? (await getRedirectAfterSocialLogin())
    redirect(true)

    if (!redirectPath) {
      showGoodDeedsIntroModal('onboarding')
    } else if (redirectPath.includes('/profile/settings/favorites/add?taskId=')) {
      showGoodDeedsIntroModal('first-favorite-good-deed')
    }
  }, [redirect, showGoodDeedsIntroModal])

  // Abort and clean-up onboarding if user already is logged in when entering the screen
  useEffect(() => {
    if (isLoggedIn && onboardingState === 'finished') {
      finishOnboarding()
    }
  }, [finishOnboarding, isLoggedIn, onboardingState])

  const renderStep = (key: OnboardingStepKey) => {
    switch (key) {
      case 'WELCOME_SCREEN':
        return (
          <Intro
            onContinue={() => {
              setCurrentStep('CREATE_ACCOUNT')
            }}
          />
        )

      case 'CREATE_ACCOUNT':
        return (
          <Authentication
            initialSelection="registration"
            onContinueAsGuest={() => {
              finishOnboarding()
            }}
            onRegister={() => {
              setCurrentStep('EMAIL_VERIFICATION')
            }}
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
              finishOnboarding()
            }}
            testID="onboarding-email-verification"
          />
        )
      case 'USER_NAME_SELECTION':
        return (
          <View style={styles.nameSelectionWrapper}>
            <NamesSelection
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

  if (!currentStep || (isLoggedIn && !['finished', 'accountSetup'].includes(onboardingState ?? ''))) {
    return <HoliLoader testID="loader" />
  }

  return (
    <HoliKeyboardSafeAreaView style={styles.wrapper}>
      <HoliStepper
        data={onboardingSteps}
        activeStepKey={currentStep}
        keyExtractor={(item) => item.key}
        renderStep={({ key }) => renderStep(key as OnboardingStepKey)}
        onChange={(key, previousKey, buttonPressed) => {
          // finish onboarding if user is on last step and clicks on continue
          if (buttonPressed === 'continue' && [key, previousKey].every((key) => key === 'GOOD_DEEDS_DO')) {
            track(OnboardingStepCompleted(key as OnboardingStepKey, ['fihish'], 'continue'))
            finishOnboarding()
            return
          }

          if (buttonPressed === 'skip') {
            track(OnboardingStepCompleted(key as OnboardingStepKey, ['skip'], 'skip'))
          }

          setCurrentStep(key as OnboardingStepKey)
        }}
        paddingTop={safeAreaTop ?? Spacing.xxs}
        paddingBottom={safeAreaBottom ?? Spacing.xxs}
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
