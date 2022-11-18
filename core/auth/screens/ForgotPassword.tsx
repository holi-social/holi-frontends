import React, { memo, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import RecoverPasswordForm from '@holi/core/auth/components/RecoverPasswordForm'
import RecoverPasswordSent from '@holi/core/auth/components/RecoverPasswordSent'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const ForgotPassword: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const [success, setSuccuss] = useState(false)
  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(
    () =>
      setOptions({
        title: t('auth.forgotPassword'),
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
        headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon="close" /> : null),
      }),
    [setOptions, t]
  )

  return (
    <DefaultLayout>
      <LoginRegistrationContainer>
        {success ? <RecoverPasswordSent /> : <RecoverPasswordForm onSubmit={setSuccuss} />}
      </LoginRegistrationContainer>
    </DefaultLayout>
  )
}

export default memo(ForgotPassword)
