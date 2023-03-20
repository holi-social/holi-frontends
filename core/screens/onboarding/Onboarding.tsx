import React from 'react'
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

  return (
    <View style={[styles.container, style]}>
      <HoliStepper
        currentStep={currentStep}
        steps={[
          // Login-Registration-Continue as a Guest step
          <LoginRegistration onRegistration={goNext} onDismiss={onFinish} key="pre-login-registration" />,
          // Community Guidelines
          <CommunityGuidelines onNextPress={goNext} onBackPress={goBack} key="community-guidelines" />,
          // Privacy Policy step
          <DataConsent onNextPress={goNext} onBackPress={goBack} key="privacy-policy" />,
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
