import React, { useCallback, useState } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import CommunityGuidelines from '@holi/core/auth/components/CommunityGuidelines'
import DataConsent from '@holi/core/auth/components/DataConsent'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import Registration from '@holi/core/auth/screens/Registration'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'

const { useParam } = createParam()

export enum RegistrationStep {
  'PRE_REGISTRATION_LOGIN',
  'COMMUNICATION_GUIDELINES',
  'PRIVACY_POLICY',
  'CREATE_ACCOUNT',
}

export interface OnboardingProps {
  style?: StyleProp<ViewStyle>
}

const Onboarding: React.VFC<OnboardingProps> = ({ style }) => {
  const { onFinish } = useOnboarding()
  const [toRegistration] = useParam('registrationStep')
  const { currentStep, goNext, goBack } = useStepper(toRegistration ? RegistrationStep.COMMUNICATION_GUIDELINES : 0)

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

  const goToNextStep = useCallback(() => {
    switch (currentStep) {
      case RegistrationStep.PRE_REGISTRATION_LOGIN:
        goNext()
        break
      case RegistrationStep.COMMUNICATION_GUIDELINES:
        communityGuidelines && goNext()
        break
      case RegistrationStep.PRIVACY_POLICY:
        privacyPolicy && goNext()
        break
      default:
        return
    }
  }, [communityGuidelines, currentStep, goNext, privacyPolicy])

  return (
    <View style={[styles.container, style]}>
      <HoliStepper
        currentStep={currentStep}
        steps={[
          // Login-Registration-Continue as a Guest step
          <LoginRegistration onRegistration={goToNextStep} onDismiss={onFinish} key="pre-login-registration" />,
          // Community Guidelines
          <CommunityGuidelines
            onNextPress={goToNextStep}
            onBackPress={goBack}
            agreementValue={communityGuidelines}
            onAgreementChange={onCommunityGuidelinesChange}
            key="community-guidelines"
          />,
          // Privacy Policy step
          <DataConsent
            onNextPress={goToNextStep}
            onBackPress={goBack}
            agreementValue={privacyPolicy}
            onAgreementChange={onprivacyPolicyChange}
            key="privacy-policy"
          />,
          // Create Account step
          <Registration key="registration" />,
        ]}
        scrollEnabled={false}
        lazy
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        // Workaround for Safari and WEB to disable bouncing and have fixed height
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
