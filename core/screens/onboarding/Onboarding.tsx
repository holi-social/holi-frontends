import { withProfiler } from '@sentry/react'
import React, { useCallback, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import AccountSetup from '@holi/core/auth/components/AccountSetup'
import EmailVerification from '@holi/core/auth/components/AccountSetup/EmailVerification'
import CommunityGuidelines from '@holi/core/auth/components/CommunityGuidelines'
import CreateAccount from '@holi/core/auth/components/CreateAccount'
import DataConsent from '@holi/core/auth/components/DataConsent'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { useVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import createParam from '@holi/core/navigation/hooks/useParam'
import { OnboardingStateValue, useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import { HoliStepperController } from '@holi/ui/components/organisms/HoliStepper'
import { colors } from '@holi/ui/styles/globalVars'

const { useParam } = createParam()

export enum RegistrationStep {
  'PRE_REGISTRATION_LOGIN',
  'COMMUNITY_GUIDELINES',
  'PRIVACY_POLICY',
  'CREATE_ACCOUNT',
  'EMAIL_VERIFICATION',
  'ACCOUNT_SETUP',
}

interface OnboardingStepperProps {
  style?: StyleProp<ViewStyle>
  onOnboardingStateChange: (value?: OnboardingStateValue) => Promise<void>
  afterAccountCreated?: () => void
}

const OnboardingStepper = ({ style, onOnboardingStateChange }: OnboardingStepperProps) => {
  const { currentStep, goNext, goBack, setStep } = useStepper()
  const verificationFlowData = useVerificationFlowData()
  const [{ communityGuidelines, privacyPolicy }, setOnboardingState] = useState({
    communityGuidelines: false,
    privacyPolicy: false,
  })

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

  const goToNextStep = useCallback(async () => {
    switch (currentStep) {
      case RegistrationStep.PRE_REGISTRATION_LOGIN:
        goNext()
        break
      case RegistrationStep.COMMUNITY_GUIDELINES:
        communityGuidelines && goNext()
        break
      case RegistrationStep.PRIVACY_POLICY:
        privacyPolicy && goNext()
        break
      case RegistrationStep.CREATE_ACCOUNT:
        if (verificationFlowData === 'verification-disabled') {
          setStep(5)
          await onOnboardingStateChange('accountSetup')
          return
        }
        goNext()
        await onOnboardingStateChange('emailVerification')

        break
      case RegistrationStep.EMAIL_VERIFICATION:
        await onOnboardingStateChange('accountSetup')
        goNext()
        break
      default:
        return
    }
  }, [onOnboardingStateChange, communityGuidelines, currentStep, goNext, privacyPolicy, setStep, verificationFlowData])

  return (
    <View style={[styles.container, style]}>
      <HoliStepper
        scrollEnabled={false}
        steps={[
          <LoginRegistration
            onRegistration={goNext}
            onDismiss={onOnboardingStateChange}
            key={RegistrationStep.PRE_REGISTRATION_LOGIN}
          />,
          <CommunityGuidelines
            onNextPress={goToNextStep}
            onBackPress={goBack}
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
          <CreateAccount onRegister={goToNextStep} key={RegistrationStep.CREATE_ACCOUNT} />,
          <EmailVerification
            onDismiss={onOnboardingStateChange}
            handleNextStep={goToNextStep}
            key={RegistrationStep.EMAIL_VERIFICATION}
          />,
          <AccountSetup onFinish={onOnboardingStateChange} key="account-setup" />,
        ]}
        lazy
      />
    </View>
  )
}

export interface OnboardingProps {
  afterAccountCreated?: () => void
  style?: StyleProp<ViewStyle>
}

const Onboarding = ({ afterAccountCreated, style }: OnboardingProps) => {
  // "onOnboardingStateChange" has default argument "finished" to dismiss onboarding
  const { storedOnboardingState, storeOnboardingState } = useStoredOnboardingState()
  const [toRegistration] = useParam('registrationStep')

  let initialStep = RegistrationStep.PRE_REGISTRATION_LOGIN

  if (storedOnboardingState === 'emailVerification') {
    initialStep = RegistrationStep.EMAIL_VERIFICATION
  } else if (storedOnboardingState === 'accountSetup') {
    initialStep = RegistrationStep.ACCOUNT_SETUP
  } else if (toRegistration) {
    initialStep = RegistrationStep.COMMUNITY_GUIDELINES
  }

  return (
    <HoliStepperController initialStep={initialStep} stepCount={6}>
      <OnboardingStepper
        style={style}
        onOnboardingStateChange={storeOnboardingState}
        afterAccountCreated={afterAccountCreated}
      />
    </HoliStepperController>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background20,
    flex: 1,
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  },
})

export default withProfiler(Onboarding, { name: 'Onboarding' })
