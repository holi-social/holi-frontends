import { useApolloClient } from '@apollo/client'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { doBrowserLogin, doLogin, hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { usePathToRedirect, useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { Screen } from '@holi/core/components/Screen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { Spacing } from 'holi-bricks/foundations'
import { HoliTextLinkTracked } from '@holi/core/components/Trackable'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ArrowLeft, Close, Edit2, Key2, Mail } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Text } from 'holi-bricks/components/text'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { Button } from 'holi-bricks/components/button'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { getNodesByStep } from '@holi/core/screens/onboarding/helpers/getNodesByStep'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import { testIdContinueAsGuest } from '@holi/e2e-mobile/helpers/auth'
import { getRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'

export type LoginParams = {
  flow?: string
}

const { useParam } = createParamHooks<LoginParams>()

const Login = () => {
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const client = useApolloClient()
  const { track } = useTracking()
  const redirect = useRedirect('/')
  const { navigate, navigateBack } = useRouting()
  const [flowId] = useParam('flow')
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [step, setStep] = useState<'oidc' | 'email-password' | 'email-code' | 'code'>('oidc')
  const { theme } = useTheme()
  const isWeb = Platform.OS === 'web'
  const styles = useMemo(() => createStyles(theme), [theme])
  const pathToRedirect = usePathToRedirect()

  const handleMessage = useCallback(
    (messageId: number) => {
      // Not displaying info message that an OTP code was sent via e-mail, as it's displayed using text on the screen instead.
      if (messageId === 1010014) {
        if (step === 'email-code') {
          setStep('code')
        }
        return true
      }
      return false
    },
    [step]
  )

  const initializeFlow = useCallback(
    () =>
      initLoginFlow(flowId)
        .then(safeSetFlow)
        .catch((error) =>
          displayError(error, 'Failed to initialize login flow', {
            displayMessage: t('auth.login.error.initialization'),
            location: 'Login.initializeFlow',
          })
        ),
    [t, safeSetFlow, displayError, flowId]
  )

  useEffect(() => {
    if (flow?.ui?.messages?.find((message) => message.id === 4000007 || message.id === 1010016)) {
      initializeFlow()?.then(() => {
        setStep('oidc')
      })
    }

    if (isLoggedOut && !flow) {
      initializeFlow()
    } else if (!isLoggedOut) {
      const redirect = getRedirectAfterSocialLogin()
      navigate(redirect || pathToRedirect || '/')
    }
  }, [isLoggedOut, initializeFlow, flow, navigate, displayError, t, pathToRedirect])

  const performLogin = async (payload: UpdateLoginFlowBody & { identifier?: string }, provider?: string) => {
    if (payload.identifier) {
      setEmail(payload.identifier)
    }
    // TODO(SF) differentiate buttons when tracking: if (payload.method === 'code') / if (!!payload.code)
    track(provider ? TrackingEvent.Auth.SocialLoginButtonPressed(provider) : TrackingEvent.Auth.LoginButtonPressed)
    if (!flow) return

    showLoader()

    try {
      const { data }: { data: OrySessionContext } = await submitLoginFlow(flow, payload, provider, undefined)
      await doLogin(client, data)
      storeOnboardingState('finished')
      redirect(true)
    } catch (err) {
      if (
        (
          err as { response?: { data?: { ui?: { messages?: { id?: number }[] } } } }
        )?.response?.data?.ui?.messages?.find((message) => message.id === 4000007 || message.id === 1010016)
      ) {
        displayError(err, 'Failed to submit form', {
          displayMessage: t('auth.login.message.1010016'),
          location: 'CreateAccount.onSubmit',
        })
        initializeFlow()?.then(() => {
          setStep('email-code')
        })
        return
      }
      if (err instanceof HoliLoginCancelledError) {
        // Do not display error if user cancelled the login
        return
      }
      const url = getBrowserRedirect(err)
      if (url) {
        if (Platform.OS === 'web') {
          navigate(url)
        } else {
          const data = await doBrowserLogin(url, flow).catch((error) => {
            handleFormSubmitError(
              safeSetFlow,
              initializeFlow,
              (err) =>
                displayError(err, 'Failed to login user', {
                  displayMessage: t('auth.login.error.login'),
                  location: 'Login.doBrowserLogin',
                }),
              error
            )
          })
          if (data) {
            await doLogin(client, data)
            storeOnboardingState('finished')
            redirect(true)
          }
        }
      } else {
        if (hasIdentifier(payload) && isUnverifiedUserError(err)) {
          setVerificationFlowData(payload)
          storeOnboardingState('emailVerification')
        } else {
          handleFormSubmitError(
            safeSetFlow,
            initializeFlow,
            (err) =>
              displayError(err, 'Failed to login user', {
                displayMessage: t('auth.login.error.login'),
                location: 'Login.performLogin',
              }),
            err
          )
        }
      }
    } finally {
      hideLoader()
    }
  }
  const nodesToShow = getNodesByStep(step)

  return (
    <View style={styles.wrapper}>
      <Screen
        style={styles.wrapper}
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
                          // re-initialize flow to reset the form and include the oidc nodes
                          initializeFlow()
                        } else if (step === 'code') {
                          showLoader()
                          initializeFlow().then(() => {
                            setStep('email-code')
                            hideLoader()
                          })
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
            {step !== 'code' && (
              <>
                <Text headingLevel="1" size="4xl" textAlign="center">
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
                <Text size="md" textAlign="center">
                  {t('registration.signUp.description')}
                </Text>
              </>
            )}
            {step === 'code' && (
              <View style={styles.mailImage}>
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/illustrations/illustration_new_mail.svg')}
                  width={251}
                  height={181}
                  label={t('profile.loggedOut.image')}
                  isSvg
                />
                <Text size="3xl" textAlign="center">
                  {t('registration.emailVerification.heading')}
                </Text>
                <Text size="md" textAlign="center">
                  {t('registration.emailVerification.body')}
                </Text>
                <View style={styles.changeEmailContainer}>
                  <Text size="md">{email}</Text>
                  <Button
                    icon={Edit2}
                    transparent
                    size="lg"
                    label={t('global.edit')}
                    onPress={() => {
                      showLoader()
                      initializeFlow().then(() => {
                        setStep('email-code')
                        hideLoader()
                      })
                    }}
                  />
                </View>
              </View>
            )}
            <FormBuilder
              flow={flow}
              onSubmit={performLogin}
              style={styles.form}
              nodesToShow={nodesToShow}
              handleMessage={handleMessage}
              isSignin
            />

            {!isLoaderShown && step === 'oidc' && (
              <>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider}>
                    <HoliDivider />
                  </View>
                  <View style={styles.dividerContainer}>
                    <Text size="md" textAlign="center" color="greyDark">
                      {t('auth.divider.email')}
                    </Text>
                  </View>
                  <View style={styles.divider}>
                    <HoliDivider />
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    label={t('auth.CTA.OTP')}
                    variant="secondary"
                    size="lg"
                    onPress={() => setStep('email-code')}
                    icon={Mail}
                    testID="ory-submit-email-button"
                  />

                  <Button
                    label={t('auth.CTA.emailPassword')}
                    testID="btn-to-email-password-form"
                    variant="secondary"
                    size="lg"
                    onPress={() => setStep('email-password')}
                    icon={Key2}
                  />
                </View>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider}>
                    <HoliDivider />
                  </View>
                  <View style={styles.dividerContainer}>
                    <Text size="md" textAlign="center" color="greyDark" testID={testIdContinueAsGuest}>
                      {t('auth.divider.guest')}
                    </Text>
                  </View>
                  <View style={styles.divider}>
                    <HoliDivider />
                  </View>
                </View>
                <Button
                  variant="secondary"
                  label={t('auth.loginProtection.continueAsGuest')}
                  onPress={() => navigateBack()}
                  size="lg"
                />
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
            {!isLoaderShown && step === 'oidc' && (
              <>
                <HoliGap size="m" />
                <Text headingLevel="2" size="xxl" textAlign="center">
                  {t('auth.login.signUp.link.headline')}
                </Text>

                <View style={styles.formItemContainer}>
                  <RegistrationButton size="lg" trackingEvent={TrackingEvent.Auth.RegisterButtonPressed} />
                </View>
              </>
            )}
          </HoliContainer>
          {isLoaderShown && <HoliLoader testID="loader" />}
        </View>
      </Screen>
      {(step === 'oidc' || step === 'email-password' || step === 'email-code') && (
        <View style={styles.footer}>
          <HoliDivider />

          <HoliContainer>
            <DocumentsFooter />
          </HoliContainer>
        </View>
      )}
    </View>
  )
}

export default memo(Login)

const createStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    container: {
      paddingVertical: Spacing.md,
      flex: 1,
    },
    form: {
      marginTop: Spacing.sm,
      width: '100%',
    },
    formItemContainer: {
      marginTop: Spacing.sm,
    },
    mailImage: {
      marginTop: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
    },
    changeEmailContainer: {
      gap: Spacing['3xs'],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
    footer: {
      paddingBottom: Spacing.sm,
      gap: Spacing.xs,
      backgroundColor: theme.colors.background20,
    },
  })
