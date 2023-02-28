import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import DataConsent from '@holi/core/auth/components/DataConsent'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'

const Onboarding: React.VFC = () => {
  const { onFinish } = useOnboarding()
  const { currentStep, goNext, goBack } = useStepper()
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
            onBackPress={goBack}
            style={[styles.stepContent, { width: screenWidth }]}
            key="privacy-policy"
          />,
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
