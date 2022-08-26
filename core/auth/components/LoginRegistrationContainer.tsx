import { SelfServiceLoginFlow, SelfServiceRegistrationFlow } from '@ory/kratos-client'
import React, { useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface LoginRegistrationContainerProps {
  flow: SelfServiceLoginFlow | SelfServiceRegistrationFlow | undefined
  mode?: 'registration' | 'login'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (payload: any) => Promise<void>
}

const LoginRegistrationContainer: React.VFC<LoginRegistrationContainerProps> = ({ flow, mode = 'login', onSubmit }) => {
  const { userId, isLoggedIn } = useContext(AuthContext)
  const { t } = useTranslation()
  const { navigate, navigateBack } = useRouting()
  const mixins = useStyleMixins()
  const isLogin = mode === 'login'
  const isWeb = Platform.OS === 'web'

  const toggleLoginRegistration = () => {
    const toggle = () => navigate(isLogin ? '/registration' : '/login')

    if (isWeb) {
      toggle()
    } else {
      navigateBack()
      setTimeout(toggle, 250)
    }
  }

  useLayoutEffect(() => {
    isLoggedIn && navigate(`/profile/${userId}`)
  }, [isLoggedIn, navigate, userId])

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <HoliText>{t('auth.login.alreadyLoggedIn')}</HoliText>
      ) : (
        <View style={styles.formContainer}>
          {Platform.OS === 'web' && (
            <HoliHeading>{isLogin ? t('auth.login') : t('auth.registration.heading')}</HoliHeading>
          )}
          <FormBuilder flow={flow} onSubmit={onSubmit} style={styles.loginForm} />

          {isLogin ? (
            <>
              <HoliButton
                disabled
                transparent
                inline
                label={t('auth.login.link.forgotPassword')}
                variant="small"
                style={styles.button}
              >
                {t('auth.login.link.forgotPassword')}
              </HoliButton>

              <HoliHeading level="2" style={styles.headline2}>
                {t('auth.login.signUp.link.headline')}
              </HoliHeading>

              <HoliButton
                onPress={toggleLoginRegistration}
                label={t('auth.loginProtection.registration')}
                type="secondary"
                style={styles.button}
                testID="btn-to-registration-form"
              >
                {t('auth.loginProtection.registration')}
              </HoliButton>
            </>
          ) : (
            <HoliHeading level="3" size="xSmall" style={styles.headline3}>
              {t('auth.registration.alreadyHasAccount')}{' '}
              <HoliButton
                transparent
                inline
                label={t('auth.login')}
                variant="small"
                style={mixins.inlineButtonFixSmall}
                onPress={toggleLoginRegistration}
              >
                <HoliText size="small" style={styles.loginLinkText}>
                  {t('auth.login')}
                </HoliText>
              </HoliButton>
            </HoliHeading>
          )}
        </View>
      )}
    </View>
  )
}

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

export default LoginRegistrationContainer
