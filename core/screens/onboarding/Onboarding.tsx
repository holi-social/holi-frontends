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
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

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
import { clearOnboardingUserDataAsyncStore } from './helpers/onboardingUserDataAsyncStore'
import { DocumentsFooter } from './components/DocumentsFooter'
import { useGoodDeedsIntroModalState } from './components/GoodDeedsIntroModal/helpers/useGoodDeedsIntroModalState'
import { getRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useTranslation } from 'react-i18next'
import OnboardingStepCompleted = TrackingEvent.OnboardingStepCompleted
import SignupStepCompleted = TrackingEvent.SignupStepCompleted

export type OnboardingParams = {
  flow?: string
}

const { useParam, useUpdateParams } = createParamHooks<OnboardingParams>()

const Onboarding = () => {
  const { t, i18n } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets()
  const onboardingState = useOnboardingState()
  const { track } = useTracking()
  const { isLoggedIn } = useLoggedInUser()
  const [flowId] = useParam('flow')
  const { openToast } = useToast()
  const [currentStep, setCurrentStep] = useOnboardingCurrentStepKey()
  const redirect = useRedirect('/act')
  const updateParams = useUpdateParams()

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
    redirect(true)
    showGoodDeedsIntroModal()
  }, [redirect, showGoodDeedsIntroModal])

  // Abort and clean-up onboarding if user already is logged in when entering the screen
  useEffect(() => {
    if (isLoggedIn && onboardingState === 'finished') {
      finishOnboarding()
    } else if (flowId) {
      let hasErrors = false
      getRegistrationFlow(flowId).then((flow) => {
        const messages = flow?.data?.ui?.nodes
          .filter((node) => node?.messages && node?.messages.length > 0)
          .flatMap((node) => node.messages)
        messages.forEach((message) => {
          if (message.type === 'error') {
            hasErrors = true
            const messageKey = `auth.registration.error.message.${message.id}`
            const msg = i18n.exists(messageKey) ? t(messageKey) : message.text
            openToast(msg, HoliToastType.ERROR)
          }
        })
        if (hasErrors) {
          setCurrentStep('CREATE_ACCOUNT')
          updateParams({ flow: '' })
        }
      })
      // Account creation flow already started => onboarding is finished
      storeOnboardingState('finished')
    }
  }, [finishOnboarding, flowId, isLoggedIn, onboardingState, openToast, t, i18n, setCurrentStep, updateParams])

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
            }}
            onContinueAsGuest={() => {
              track(SignupStepCompleted({ step: 'emailAndPassword', answer: 'continueAsGuest' }))
              finishOnboarding()
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
          // finish onboarding if user is on last step and clicks on continue
          if (buttonPressed === 'continue' && [key, previousKey].every((key) => key === 'GOOD_DEEDS_DO')) {
            track(OnboardingStepCompleted(key as OnboardingStepKey, ['fihish'], 'continue'))
            finishOnboarding()
            return
          }

          if (buttonPressed === 'skip') {
            track(OnboardingStepCompleted(key as OnboardingStepKey, ['skip'], 'skip'))
            clearSelection()
          }

          setCurrentStep(key as OnboardingStepKey)
        }}
        paddingTop={safeAreaTop ?? Spacing.xxs}
        paddingBottom={safeAreaBottom ?? Spacing.xxs}
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
