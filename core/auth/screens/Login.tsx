import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import client from '@holi/api/graphql/client'
import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import { initLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { displayError } from '@holi/core/errors/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Login: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { isLoggedIn, setUserLoggedIn } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { t } = useTranslation()

  const title = t('auth.login')
  useNavigationHeader(navigation, {
    title: title,
    headerCenter: () => (
      <HoliHeading level="1" size="small">
        {title}
      </HoliHeading>
    ),
    headerLeft: () => (Platform.OS === 'web' ? <HoliText /> : <BackButton icon="arrow-left-s" />),
    headerRight: () => (Platform.OS === 'web' ? <BackButton icon="close" /> : <HoliText />),
  })

  const initializeFlow = useCallback(() => {
    initLoginFlow()
      .then((response) => {
        const { data: flow } = response
        setFlow(flow)
      })
      .catch((error) => displayError(error, t('auth.login.error.initialization')))
  }, [t])

  useEffect(() => {
    !isLoggedIn && initializeFlow()
  }, [isLoggedIn, initializeFlow])

  const performLogin = (payload: SubmitSelfServiceLoginFlowBody): Promise<void> => {
    if (flow)
      return newKratosSdk()
        .submitSelfServiceLoginFlow(flow.id, undefined, payload)
        .then(({ data }) =>
          client.clearStore().then(() => {
            setUserLoggedIn(data as OrySessionContext)
          })
        )
        .catch(handleFormSubmitError(setFlow, initializeFlow))
        .catch((error) => displayError(error, t('auth.login.error.login')))
    return Promise.resolve()
  }

  return (
    <DefaultLayout>
      <LoginRegistrationContainer flow={flow} onSubmit={performLogin} />
    </DefaultLayout>
  )
}

export default Login
