import type React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import { HoliStepper } from '@holi/ui/components/organisms/HoliStepperV2'
import { Spacing, mono } from 'holi-bricks/foundations'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { storeOnboardingState, useOnboardingState } from './hooks/onboardingState'
import {
  type OnboardingStepItem,
  type OnboardingStepKey,
  onboardingSteps,
  useOnboardingCurrentStepKey,
} from './hooks/useOnboardingCurrentStepKey'
import { CreateAccount } from './steps/CreateAccount'
import { EmailVerification } from './steps/EmailVerification'
import { Intro } from './steps/Intro'
import { NamesSelection } from './steps/NamesSelection'
import OnboardingStepCompleted = TrackingEvent.OnboardingStepCompleted
import SignupStepCompleted = TrackingEvent.SignupStepCompleted
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { clearOnboardingUserDataAsyncStore } from './helpers/onboardingUserDataAsyncStore'
import { useCallback, useEffect } from 'react'
import { showOnboardingFinishModal } from '@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export type OnboardingParams = {
  flow?: string
}

const { useParam } = createParamHooks<OnboardingParams>()

const Onboarding = () => {
  const { t } = useTranslation()
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets()
  const onboardingState = useOnboardingState()
  const { track } = useTracking()
  const { isLoggedIn } = useLoggedInUser()
  const [flowId] = useParam('flow')

  const [currentStep, setCurrentStep] = useOnboardingCurrentStepKey()

  const redirect = useRedirect('/')
  const setScreenOptions = useSetScreenOptions()

  useEffect(() => {
    setScreenOptions({
      headerShown: false,
      animation: 'none',
      gestureEnabled: false,
      navigationCustomOptions: { footerShown: false },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
    } else if (flowId) {
      // Account creation flow already started => onboarding is finished
      storeOnboardingState('finished')
    }
  }, [breakOnboarding, flowId, isLoggedIn, onboardingState])

  // No longer needed since we removed location/interests/skills steps
  const clearSelection = () => {
    // No-op for remaining steps
  }

  const renderStep = (key: OnboardingStepKey) => {
    switch (key) {
      case 'WELCOME_SCREEN':
        return (
          <Intro
            onContinue={() => {
              track(OnboardingStepCompleted('welcome', ['continue'], 'continue'))
              setCurrentStep('CREATE_ACCOUNT')
            }}
          />
        )

      case 'CREATE_ACCOUNT':
        return (
          <CreateAccount
            flowId={flowId}
            onLogin={() => {
              track(SignupStepCompleted({ step: 'emailAndPassword', answer: 'login' }))
              redirect(true)
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

  // No longer needed since we removed the steps with dynamic button labels
  const modifyStepWithNextButtonLabel = (step: OnboardingStepItem): OnboardingStepItem => {
    return step
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
            clearSelection()
          }
          setCurrentStep(key as OnboardingStepKey)
        }}
        paddingTop={safeAreaTop ? safeAreaTop : Spacing.xxs}
        paddingBottom={safeAreaBottom ? safeAreaBottom : Spacing.xxs}
        testID="onboarding-stepper"
      />
      {currentStep === 'CREATE_ACCOUNT' && (
        <View style={styles.footer}>
          <HoliDivider />
          <HoliContainer>
            <DocumentsFooter />
          </HoliContainer>
        </View>
      )}
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
  footer: {
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
})

export default Onboarding
