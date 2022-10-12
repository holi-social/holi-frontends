// import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
// import { navigateBackToHomeScreen } from 'e2e/mobile/helpers/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

// import client from '@holi/api/graphql/client'
// import DefaultLayout from '@holi/core/DefaultLayout'
// import { AuthContext } from '@holi/core/auth/AuthContextProvider'
// import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
// import { initLoginFlow } from '@holi/core/auth/helpers/auth'
// import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
// import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
// import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
// import { displayError } from '@holi/core/errors/helpers'
import DefaultLayout from '@holi/core/DefaultLayout'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const ForgotPassword: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

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

  return (
    <DefaultLayout>
      <LoginRegistrationContainer>
        <HoliHeading level="2" style={styles.headline2}>
          {t('auth.login.signUp.link.headline')}
        </HoliHeading>

        <HoliButton
          onPress={() => navigate('/registration')}
          label={t('auth.loginProtection.registration')}
          type="secondary"
          style={styles.button}
          testID="btn-to-registration-form"
        >
          {t('auth.loginProtection.registration')}
        </HoliButton>
      </LoginRegistrationContainer>
    </DefaultLayout>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 34,
    ...Platform.select({
      native: {
        // enables scroll up when keyboard overlaps submit button
        marginBottom: 500,
      },
    }),
    minHeight: '100%',
    paddingTop: 60,
    alignItems: 'center',
  },
  formContainer: {
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
  },
  loginForm: {
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 235,
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  headline2: {
    marginTop: 40,
  },
  headline3: {
    marginTop: 16,
  },
  loginLinkText: {
    color: colors.positivepurple,
  },
})
