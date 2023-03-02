import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

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

const Onboarding: React.VFC = () => {
  const { onFinish } = useOnboarding()
  const [registrationStep = RegistrationStep.PRE_REGISTATION_LOGIN] = useParam('registrationStep')
  const { currentStep, goNext, goBack } = useStepper(+registrationStep)
  const { width: screenWidth } = useWindowDimensions()

  return (
    <View style={styles.container}>
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
          <Registration style={[styles.stepContent, { width: screenWidth }]} key="registration" />,
        ]}
        scrollEnabled={false}
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
