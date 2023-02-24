import React from 'react'
import { StyleSheet, View } from 'react-native'

import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'

const Onboarding: React.VFC = () => {
  const { onFinish } = useOnboarding()

  return (
    <View style={styles.container}>
      <LoginRegistration onDismiss={onFinish} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Onboarding
