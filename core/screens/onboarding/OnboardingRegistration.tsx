import { withProfiler } from '@sentry/react'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'

import AccountSetup from '@holi/core/auth/components/AccountSetup'
import EmailVerification from '@holi/core/auth/components/AccountSetup/EmailVerification'
import CommunityGuidelines from '@holi/core/auth/components/CommunityGuidelines'
import CreateAccount from '@holi/core/auth/components/CreateAccount'
import DataConsent from '@holi/core/auth/components/DataConsent'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import {
  OnboardingStateValue,
  onboardingStateVar,
  storeOnboardingState,
  useStoredOnboardingState,
} from '@holi/core/screens/onboarding/hooks/onboardingState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import { HoliStepperController } from '@holi/ui/components/organisms/HoliStepper'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const { useParam } = createParamHooks()

export enum RegistrationStep {
  'COMMUNITY_GUIDELINES',
  'PRIVACY_POLICY',
  'CREATE_ACCOUNT',
  'EMAIL_VERIFICATION',
  'ACCOUNT_SETUP',
}

interface OnboardingStepperProps {
  onOnboardingStateChange: (value: OnboardingStateValue) => Promise<void>
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ onOnboardingStateChange }) => {
  const { theme } = useTheme()
  const { track } = useTracking()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { currentStep, goNext, goBack } = useStepper()
  const [{ communityGuidelines, privacyPolicy }, setOnboardingState] = useState({
    communityGuidelines: false,
    privacyPolicy: false,
  })

  usePreventBackNavigation(true)

  const { navigate, navigateBack } = useRouting()

  const onCommunityGuidelinesChange = useCallback(
    () =>
      setOnboardingState((prevValue) => ({
        ...prevValue,
        communityGuidelines: !prevValue.communityGuidelines,
      })),
    []
  )

  const onPrivacyPolicyChange = useCallback(
    () =>
      setOnboardingState((prevValue) => ({
        ...prevValue,
        privacyPolicy: !prevValue.privacyPolicy,
      })),
    []
  )

  const onCreateAccountDismiss = useCallback(() => {
    const currentOnboardingState = onboardingStateVar()

    if (currentOnboardingState === 'finished') {
      navigateBack()
    } else {
      onOnboardingStateChange('finished')
      navigate('/')
    }
  }, [navigate, navigateBack, onOnboardingStateChange])

  const goToNextStep = useCallback(async () => {
    switch (currentStep) {
      case RegistrationStep.COMMUNITY_GUIDELINES:
        if (communityGuidelines) {
          track(TrackingEvent.Auth.CommunityGuidelinesOnboardingStepCompleted)
          goNext()
        }
        break
      case RegistrationStep.PRIVACY_POLICY:
        if (privacyPolicy) {
          track(TrackingEvent.Auth.PrivacyPolicyOnboardingStepCompleted)
          goNext()
        }
        break
      case RegistrationStep.CREATE_ACCOUNT:
        await onOnboardingStateChange('emailVerification')
        goNext()
        break
      case RegistrationStep.EMAIL_VERIFICATION:
        await onOnboardingStateChange('accountSetup')
        goNext()
        break
      default:
        return
    }
  }, [communityGuidelines, currentStep, goNext, onOnboardingStateChange, privacyPolicy, track])

  return (
    <SafeArea style={styles.container}>
      <HoliStepper
        scrollEnabled={false}
        steps={[
          <CommunityGuidelines
            onNextPress={goToNextStep}
            onBackPress={navigateBack}
            agreementValue={communityGuidelines}
            onAgreementChange={onCommunityGuidelinesChange}
            key={RegistrationStep.COMMUNITY_GUIDELINES}
          />,
          <DataConsent
            onNextPress={goToNextStep}
            onBackPress={goBack}
            agreementValue={privacyPolicy}
            onAgreementChange={onPrivacyPolicyChange}
            key={RegistrationStep.PRIVACY_POLICY}
          />,
          <CreateAccount
            onRegister={goToNextStep}
            onDismiss={onCreateAccountDismiss}
            key={RegistrationStep.CREATE_ACCOUNT}
          />,
          <EmailVerification
            onDismiss={() => onOnboardingStateChange('finished')}
            onSuccess={goToNextStep}
            key={RegistrationStep.EMAIL_VERIFICATION}
          />,
          <AccountSetup onFinish={() => onOnboardingStateChange('finished')} key={RegistrationStep.ACCOUNT_SETUP} />,
        ]}
        lazy
      />
    </SafeArea>
  )
}

const OnboardingRegistration = () => {
  const storedOnboardingState = useStoredOnboardingState()
  const [toRegistration] = useParam('registrationStep')

  let initialStep = RegistrationStep.COMMUNITY_GUIDELINES

  const setScreenOptions = useSetScreenOptions()

  const { isLoading } = useLoggedInUser()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  if (isLoading || !storeOnboardingState) return <HoliLoader />

  if (storedOnboardingState === 'emailVerification') {
    initialStep = RegistrationStep.EMAIL_VERIFICATION
  } else if (storedOnboardingState === 'accountSetup') {
    initialStep = RegistrationStep.ACCOUNT_SETUP
  } else if (toRegistration) {
    initialStep = RegistrationStep.COMMUNITY_GUIDELINES
  }

  return (
    <HoliStepperController initialStep={initialStep} stepCount={6}>
      <OnboardingStepper onOnboardingStateChange={storeOnboardingState} />
    </HoliStepperController>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      flex: 1,
    },
  })

export default withProfiler(OnboardingRegistration, { name: 'OnboardingRegistration' })
