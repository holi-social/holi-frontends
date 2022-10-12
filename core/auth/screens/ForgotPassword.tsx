import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import RecoverPasswordForm from '@holi/core/auth/components/RecoverPasswordForm'
import RecoverPasswordSent from '@holi/core/auth/components/RecoverPasswordSent'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const ForgotPassword: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const [success, setSuccuss] = useState(false)

  const title = t('auth.forgotPassword')
  useNavigationHeader(navigation, {
    title: title,
    headerCenter: () => (
      <HoliHeading level="1" size="small">
        {title}
      </HoliHeading>
    ),
    headerLeft: () => (Platform.OS === 'web' ? <HoliText /> : <BackButton icon="arrow-down-s" />),
    headerRight: () => (Platform.OS === 'web' ? <BackButton icon="close" /> : <HoliText />),
  })

  const onSubmit = useCallback(setSuccuss, [setSuccuss])

  return (
    <DefaultLayout>
      <LoginRegistrationContainer>
        {success ? <RecoverPasswordSent /> : <RecoverPasswordForm onSubmit={onSubmit} />}
      </LoginRegistrationContainer>
    </DefaultLayout>
  )
}

export default ForgotPassword
