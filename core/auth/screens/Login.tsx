import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import client from '@holi/api/graphql/client'
import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import { initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type ScreenProps = NativeStackScreenProps<RootStackScreens>

const Login: React.VFC<ScreenProps> = () => {
  const { isLoggedIn, setUserLoggedIn } = useAuth()
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { setOptions, navigate, navigateBack, replaceRoute } = useUnifiedNavigation()
  const { displayError } = useErrorHandling()

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {t('auth.login')}
        </HoliHeading>
      ),
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
      headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon="close" /> : null),
    })
  }, [setOptions, t])

  const initializeFlow = useCallback(() => {
    initLoginFlow()
      .then((response) => {
        const { data: flow } = response
        safeSetFlow(flow)
      })
      .catch((error) => displayError(error, t('auth.login.error.initialization')))
  }, [t, safeSetFlow, displayError])

  useEffect(() => {
    !isLoggedIn && initializeFlow()
  }, [isLoggedIn, initializeFlow])

  const performLogin = (payload: SubmitSelfServiceLoginFlowBody): Promise<void> => {
    if (flow)
      return submitLoginFlow(flow.id, payload, undefined)
        .then(({ data }) =>
          client.clearStore().then(() => {
            setUserLoggedIn(data as OrySessionContext)
          })
        )
        .catch(handleFormSubmitError(safeSetFlow, initializeFlow))
        .catch((error) => displayError(error, t('auth.login.error.login')))
    return Promise.resolve()
  }

  return (
    <DefaultLayout headerOverlap={true}>
      <LoginRegistrationContainer>
        <FormBuilder flow={flow} onSubmit={performLogin} style={styles.loginForm} />
        <View style={styles.formItemContainer}>
          <HoliTextLink
            label={t('auth.login.link.forgotPassword')}
            href="/forgotPassword"
            size="small"
            variant="secondary"
            mobileNavigateBackFirst
            testID="btn-to-forgot-password-form"
          >
            {t('auth.login.link.forgotPassword')}
          </HoliTextLink>
        </View>

        <HoliHeading level="2" style={styles.headline2}>
          {t('auth.login.signUp.link.headline')}
        </HoliHeading>

        <HoliButton
          onPress={() => {
            if (Platform.OS === 'web') {
              replaceRoute('/registration')
            } else {
              navigateBack()
              setTimeout(() => navigate('/registration'), 300) // use timeout to open new modal after previous was closed
            }
          }}
          label={t('auth.loginProtection.registration')}
          type="secondary"
          style={styles.formItemContainer}
          testID="btn-to-registration-form"
        >
          {t('auth.loginProtection.registration')}
        </HoliButton>
      </LoginRegistrationContainer>
    </DefaultLayout>
  )
}

export default memo(Login)

const styles = StyleSheet.create({
  loginForm: {
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 235,
    width: '100%',
  },
  formItemContainer: {
    marginTop: 20,
  },
  headline2: {
    marginTop: 40,
  },
  headline3: {
    marginTop: 16,
  },
})
