import AsyncStore from '@react-native-async-storage/async-storage'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { colors } from '@holi/ui/styles/globalVars'

const ONBOARDING_STORAGE_NAME = 'onboarding_finished'

const Onboarding = ({ children }: React.PropsWithChildren<unknown>) => {
  const [finished, setFinished] = useState(false)

  const onFinish = useCallback(() => {
    AsyncStore.setItem(ONBOARDING_STORAGE_NAME, 'true')
    setFinished(true)
  }, [])

  return finished ? (
    <>{children}</>
  ) : (
    <View style={{ flex: 1 }}>
      <LoginRegistration onDismiss={onFinish} style={{ backgroundColor: colors.background20 }} />
    </View>
  )
}

export default Onboarding
