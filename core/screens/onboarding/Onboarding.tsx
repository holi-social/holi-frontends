import React, { useCallback, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import AccountSetup from '@holi/core/auth/components/AccountSetup'
import EmailVerification from '@holi/core/auth/components/AccountSetup/EmailVerification'
import CommunityGuidelines from '@holi/core/auth/components/CommunityGuidelines'
import CreateAccount from '@holi/core/auth/components/CreateAccount'
import DataConsent from '@holi/core/auth/components/DataConsent'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'
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

export interface OnboardingProps {
  afterAccountCreated?: () => void
  style?: StyleProp<ViewStyle>
}

const Onboarding: React.VFC<OnboardingProps> = ({ afterAccountCreated, style }) => {
  // "onOnboardingStateChange" default argument is "finished" to dismiss onboarding
  const { onboardingState, onOnboardingStateChange } = useOnboarding()
  const [toRegistration] = useParam('registrationStep')
  const { width: screenWidth } = useWindowDimensions()

  let initialStep = RegistrationStep.PRE_REGISTRATION_LOGIN

  if (onboardingState === 'emailVerification') {
    initialStep = RegistrationStep.EMAIL_VERIFICATION
  } else if (onboardingState === 'accountSetup') {
    initialStep = RegistrationStep.ACCOUNT_SETUP
  } else if (toRegistration) {
    initialStep = RegistrationStep.COMMUNITY_GUIDELINES
  }

  const { currentStep, goNext, goBack, stepperRef, scrollEnabled, onScroll } = useStepper(screenWidth, initialStep)

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

  const onprivacyPolicyChange = useCallback(
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
        goNext()
        await onOnboardingStateChange('emailVerification')
        afterAccountCreated?.()
        break
      case RegistrationStep.EMAIL_VERIFICATION:
        onOnboardingStateChange('accountSetup')
        goNext()
        break
      default:
        return
    }
  }, [afterAccountCreated, communityGuidelines, currentStep, goNext, onOnboardingStateChange, privacyPolicy])

  return (
    <View style={[styles.container, style]}>
      <HoliStepper
        currentStep={currentStep}
        ref={stepperRef}
        width={screenWidth}
        steps={[
          // Login-Registration-Continue as a Guest step
          <LoginRegistration
            onRegistration={goNext}
            onDismiss={onOnboardingStateChange}
            key={RegistrationStep.PRE_REGISTRATION_LOGIN}
          />,
          // Community Guidelines
          <CommunityGuidelines
            onNextPress={goToNextStep}
            onBackPress={goBack}
            agreementValue={communityGuidelines}
            onAgreementChange={onCommunityGuidelinesChange}
            key={RegistrationStep.COMMUNITY_GUIDELINES}
          />,
          // Privacy Policy step
          <DataConsent
            onNextPress={goToNextStep}
            onBackPress={goBack}
            agreementValue={privacyPolicy}
            onAgreementChange={onprivacyPolicyChange}
            key={RegistrationStep.PRIVACY_POLICY}
          />,
          // Create Account step
          <CreateAccount onRegister={goToNextStep} key={RegistrationStep.CREATE_ACCOUNT} />,
          // Email Verification step
          <EmailVerification
            onDismiss={onOnboardingStateChange}
            onSuccess={goToNextStep}
            key={RegistrationStep.EMAIL_VERIFICATION}
          />,
          // Account Setup
          <AccountSetup onFinish={onOnboardingStateChange} key="account-setup" />,
        ]}
        scrollEnabled={scrollEnabled}
        onScroll={onScroll}
        lazy
      />
    </View>
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

export default Onboarding
