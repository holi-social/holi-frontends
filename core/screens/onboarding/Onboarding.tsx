import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import DataConsent from '@holi/core/auth/components/DataConsent'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import Registration from '@holi/core/auth/screens/Registration'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'

const { useParam } = createParam()

export enum RegistrationStep {
  'PRE_REGISTATION_LOGIN',
  'PRIVACY_POLICY',
  'CREATE_ACCOUNT',
}

export interface OnboardingProps {
  style?: StyleProp<ViewStyle>
}

const Onboarding: React.VFC<OnboardingProps> = ({ style }) => {
  const { onFinish } = useOnboarding()
  const [toRegistration] = useParam('registrationStep')
  const { currentStep, goNext, goBack } = useStepper(toRegistration ? RegistrationStep.PRIVACY_POLICY : 0)
  const { width: screenWidth } = useWindowDimensions()

  return (
    <View style={[styles.container, style]}>
      <HoliStepper
        currentStep={currentStep}
        steps={[
          // Login-Registration-Continue as a Guest step
          <LoginRegistration
            onRegistration={goNext}
            onDismiss={onFinish}
            style={[styles.stepContent, { width: screenWidth }]}
            key="pre-login-registration"
          />,
          // Privacy Policy step
          <DataConsent
            onNextPress={goNext}
            onBackPress={goBack}
            style={[styles.stepContent, { width: screenWidth }]}
            key="privacy-policy"
          />,
          // Create Account step
          <Registration style={[styles.stepContent, { width: screenWidth }]} key="registration" />,
        ]}
        scrollEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
  },
})

export default Onboarding
