import type { LoginFlow, UpdateLoginFlowBody, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import FormBuilder, { NodeType } from '@holi/core/auth/components/FormBuilder'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { useLoginState } from '@holi/core/auth/loginState'
import { HoliTextLinkTracked } from '@holi/core/components/Trackable'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { TrackingEvent } from '@holi/core/tracking'
import { ArrowDownS, ArrowLeft, Close, Key2, Mail } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { Screen } from '@holi/core/components/Screen'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Text } from 'holi-bricks/components/text'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { useTheme } from '@holi/ui/styles/theme'
import { Spacing } from 'holi-bricks/foundations'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { Button } from 'holi-bricks/components/button'
import { initLoginFlow } from '@holi/core/auth/helpers/auth'

const getNodesByStep = (step: 'oidc' | 'email-password' | 'email-code' | 'code'): NodeType[] => {
  switch (step) {
    case 'oidc':
      return ['oidc']
    case 'email-password':
      return ['email', 'password']
    case 'email-code':
      return ['email', 'code']
    case 'code':
      return ['code']
  }
}

interface AuthScreenProps<T> {
  isSignin: boolean
  flowId?: string
  onSubmit: (payload: T, provider?: string) => Promise<void>
  step: 'oidc' | 'email-password' | 'email-code' | 'code'
  setStep: (step: 'oidc' | 'email-password' | 'email-code' | 'code') => void
}

const AuthScreen = <T extends UpdateLoginFlowBody | UpdateRegistrationFlowBody>({
  flowId,
  onSubmit,
  isSignin = false,
  step = 'oidc',
  setStep,
}: AuthScreenProps<T>) => {
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { isLoaderShown } = useLoader()
  const { navigate } = useRouting()
  const { theme } = useTheme()

  const isWeb = Platform.OS === 'web'

  const initializeFlow = useCallback(() => {
    initLoginFlow(flowId)
      .then(safeSetFlow)
      .catch((error) =>
        displayError(error, 'Failed to initialize login flow', {
          displayMessage: t('auth.login.error.initialization'),
          location: 'Login.initializeFlow',
        })
      )
  }, [t, safeSetFlow, displayError, flowId])

  useEffect(() => {
    if (isLoggedOut && !flow) {
      initializeFlow()
    } else if (!isLoggedOut) {
      navigate('/')
    }
  }, [isLoggedOut, initializeFlow, flow, navigate])

  const nodesToShow = getNodesByStep(step)

  return (
    <Screen
      preset="scroll"
      keyboardShouldPersistTaps="always"
      headerOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.colors.background20,
        },
        headerTitle: () => <HoliLogo color={theme.colors.black300} />,
        headerLeft: () => {
          if (isWeb && step === 'oidc') return null
          return (
            <HeaderBackButton
              icon={ArrowLeft}
              {...(step !== 'oidc'
                ? {
                    onPress: () => {
                      if (step === 'email-password' || step === 'email-code') {
                        setStep('oidc')
                      } else if (step === 'code') {
                        setStep('email-code')
                      }
                    },
                  }
                : {})}
            />
          )
        },
        headerRight: () => (isWeb ? <HeaderBackButton icon={Close} /> : null),
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
    >
      <View style={styles.container}>
        <HoliContainer>
          <Text headingLevel="1" size="4xl">
            {t('registration.signUp.heading')}

            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/icons/give-five-filled.svg')}
              width={50}
              height={40}
              label={''}
              isSvg
            />
          </Text>
          <HoliGap size="xs" />
          <Text size="md">{t('registration.signUp.description')}</Text>
          <FormBuilder
            flow={flow}
            onSubmit={onSubmit}
            style={styles.loginForm}
            isSignin={isSignin}
            nodesToShow={nodesToShow}
          />

          {!isLoaderShown && step === 'oidc' && (
            <>
              <View style={styles.dividerContainer}>
                <View style={styles.divider}>
                  <HoliDivider />
                </View>
                <View style={styles.dividerContainer}>
                  <Text size="md" textAlign="center" color="greyDark">
                    {t('registration.emailOption')}
                  </Text>
                </View>
                <View style={styles.divider}>
                  <HoliDivider />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  label={t('auth.login.input.placeholder-InputSignInCode')}
                  variant="secondary"
                  size="lg"
                  onPress={() => setStep('email-code')}
                  icon={Mail}
                  testID={`ory-submit-email-button`}
                />

                <Button
                  label={'Continue with email and password'}
                  variant="secondary"
                  size="lg"
                  onPress={() => setStep('email-password')}
                  icon={Key2}
                  testID={`ory-submit-email-button`}
                />
              </View>
            </>
          )}

          {step === 'email-password' && (
            <View style={styles.formItemContainer} testID="btn-to-forgot-password-form">
              <HoliTextLinkTracked
                label={t('auth.login.link.forgotPassword')}
                href="/forgotPassword"
                size="sm"
                textAlign="center"
                trackingEvent={TrackingEvent.Auth.ForgotPasswordButtonPressed}
              >
                {t('auth.login.link.forgotPassword')}
              </HoliTextLinkTracked>
            </View>
          )}

          {/* Sign in only fields */}
          {!isLoaderShown &&isSignin && (
            <>
              <HoliGap size="l" />
              <Text headingLevel="2" size="xxl" textAlign="center">
                {t('auth.login.signUp.link.headline')}
              </Text>

              <View style={styles.formItemContainer}>
                <RegistrationButton trackingEvent={TrackingEvent.Auth.RegisterButtonPressed} />
              </View>
            </>
          )}
        </HoliContainer>
        {isLoaderShown && <HoliLoader testID="loader" />}
      </View>
    </Screen>
  )
}

// export default memo(AuthScreen)
export default AuthScreen

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  loginForm: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  formItemContainer: {
    marginTop: 20,
  },
  dividerContainer: {
    marginTop: Spacing['3xs'],
    marginBottom: Spacing['3xs'],
    gap: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  divider: {
    flex: 1,
  },
  buttonContainer: {
    gap: Spacing['3xs'],
  },
})
