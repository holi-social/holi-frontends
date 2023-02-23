import React from 'react'
import { View } from 'react-native'

import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { colors } from '@holi/ui/styles/globalVars'

const Onboarding = ({ children }: React.PropsWithChildren<unknown>) => {
  const { finished, onFinish } = useOnboarding()

  return finished ? (
    <>{children}</>
  ) : (
    <View style={{ flex: 1 }}>
      <LoginRegistration onDismiss={onFinish} style={{ backgroundColor: colors.background20 }} />
    </View>
  )
}

export default Onboarding
