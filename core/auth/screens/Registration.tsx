import { SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client'
import React, { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import { initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { displayError } from '@holi/core/errors/helpers'
import { useSafeDispatch } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks//useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const isWeb = Platform.OS === 'web'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Registration: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { setUserLoggedIn, isLoggedIn } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | undefined>(undefined)
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  // use safe versions of this function to prevent updating state of destroyed component
  const safeSetFlow = useSafeDispatch(setFlow)

  const initializeFlow = useCallback(() => {
    if (isLoggedIn) return

    initRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error) => displayError(error, t('auth.registration.error.initialization')))
  }, [safeSetFlow, t, isLoggedIn])

  // When the component is mounted, we initialize a new use login flow:
  useLayoutEffect(() => initializeFlow(), [initializeFlow])

  const title = t('auth.register')
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

  // This will update the registration flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceRegistrationFlowBody): Promise<void> =>
    flow
      ? newKratosSdk()
          .submitSelfServiceRegistrationFlow(flow.id, payload)
          .then(({ data }) => {
            // ORY Kratos can be configured in such a way that it requires a login after
            // registration. You could handle that case by navigating to the Login screen
            // but for simplicity we'll just print an error here:
            if (isWeb ? !data.session : !data.session_token) {
              const err = new Error(
                'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
              )
              return Promise.reject(err)
            }
            console.info('[Registration.tsx] registration was successful.')
            setUserLoggedIn({
              session: data.session,
              session_token: data.session_token,
            } as OrySessionContext)
          })
          .catch(handleFormSubmitError(setFlow, initializeFlow))
          .catch((error) => displayError(error, t('auth.registration.error.registration')))
      : Promise.resolve()

  return (
    <DefaultLayout>
      <LoginRegistrationContainer>
        <FormBuilder flow={flow} onSubmit={onSubmit} style={styles.loginForm} />

        <HoliHeading level="3" size="xSmall" style={styles.headline3}>
          {t('auth.registration.alreadyHasAccount')}{' '}
          <HoliButton
            transparent
            inline
            variant="small"
            label={t('auth.login')}
            style={mixins.inlineButtonFixSmall}
            onPress={() => navigate('/login')}
            testID="btn-to-login-form"
          >
            <HoliText size="small" style={styles.loginLinkText}>
              {t('auth.login')}
            </HoliText>
          </HoliButton>
        </HoliHeading>
      </LoginRegistrationContainer>
    </DefaultLayout>
  )
}

export default Registration

const styles = StyleSheet.create({
  loginForm: {
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 235,
    width: '100%',
  },
  headline3: {
    marginTop: 16,
  },
  loginLinkText: {
    color: colors.positivepurple,
  },
})
