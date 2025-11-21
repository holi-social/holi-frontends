import React, { memo, useCallback, useEffect, useState } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import TaskCompletionSteps from '@holi/core/screens/spaces/tasks/components/TaskCompletionSteps'
import { doLogin, getVerificationFlowFromRegistration, initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { useLoginState } from '@holi/core/auth/loginState'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import { useSafeDispatch } from '@holi/core/helpers/useSafeDispatch'
import { useErrorHandling } from '@holi/core/errors/hooks/useErrorHandling'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliOryRegistrationConfigError } from '@holi/core/errors/classes/HoliOnboardingError'
import { doBrowserLogin, retrieveSubmitFlowBody } from '@holi/core/auth/helpers/auth/helpers'
import { extractValue } from '@holi/core/auth/helpers/helper'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { TrackingEvent } from '@holi/core/tracking'
import { newKratosSdk, type OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { getLogger } from '@holi/core/helpers/logging'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useApolloClient } from '@apollo/client/react'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { GoodDeedMoreCard } from '@holi/core/screens/spaces/tasks/components/GoodDeedMoreCard'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { storeWelcomeGoodDeedsCounterModal } from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounterModal/useDisplayWelcomeGoodDeedsCounterModal'
import { Edit2, HoliLogo } from '@holi/icons/src/generated'
import { removeRedirectAfterSocialLogin, setRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { SocialLoginButton } from 'holi-bricks/components/button'
import { getTrackingEventForRegistrationFlowSubmit } from '@holi/core/auth/helpers/auth/tracking'
import { getNodeProviderId, getNodeProviderName } from '@holi/core/auth/helpers/auth'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { SocialLoginButtonProvider } from 'holi-bricks/components/button/SocialLoginButton'
import { OryErrorCode } from '@holi/core/auth/helpers/auth/errorCodes'

const logger = getLogger('TaskCompletionFlow')

export type TaskCompletionFlowParams = {
  taskId: string
}

const TaskCompletionFlow = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = getStyles(theme)
  const { isLoggedOut, isLoggedIn } = useLoginState()
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { displayError } = useErrorHandling()
  const [name, setName] = useState<string | undefined>(undefined)
  const { track } = useTracking()
  const { showLoader, hideLoader, isLoaderShown } = useLoader()
  const client = useApolloClient()
  const { navigate } = useRouting()
  const [step, setStep] = useState<'oidc' | 'email-password' | 'email-code' | 'code'>('oidc')
  const [email, setEmail] = useState<string | undefined>(undefined)
  const { refetch, data, id, spaceId, totalCompletions } = useTaskDetailsData()

  const handleMessage = useCallback(
    (messageId: number) => {
      // Not displaying info message that an OTP code was sent via e-mail, as it's displayed using text on the screen instead.
      if (messageId === 1040005) {
        if (step === 'email-code') {
          setStep('code')
        }
        return true
      }
      return false
    },
    [step]
  )

  useEffect(() => {
    if (isLoggedIn && spaceId && id) {
      navigate(`/spaces/${spaceId}/tasks/${id}/callback`)
    }
  }, [isLoggedIn, spaceId, id, navigate])

  const handleCompleteTask = () => {
    storeWelcomeGoodDeedsCounterModal(true)
  }

  const handleOidcLogin = (provider: string) => {
    const oidcNode = flow?.ui?.nodes?.find((node) => node.group === 'oidc' && getNodeProviderName(node) === provider)

    if (oidcNode) {
      const providerId = getNodeProviderId(oidcNode)
      if (providerId) {
        onSubmit({ method: 'oidc', provider: providerId }, provider)
      }
    }
  }

  const initializeFlow = useCallback(() => {
    if (!isLoggedOut) {
      return
    }
    showLoader()

    return (
      initRegistrationFlow()
        // The flow was initialized successfully, let's set the form data:
        .then((flow) => {
          safeSetFlow(flow)
        })
        .catch((error) =>
          displayError(error, 'Failed to initialize registration flow', {
            displayMessage: t('auth.registration.error.initialization'),
            location: 'TaskCompletionFlow.initRegistrationFlow',
          })
        )
        .finally(hideLoader)
    )
  }, [isLoggedOut, safeSetFlow, displayError, t, hideLoader, showLoader])

  // When the component is mounted, we initialize a new use login flow:
  useIsomorphicLayoutEffect(() => {
    initializeFlow()
  }, [initializeFlow])

  useEffect(() => {
    if (spaceId && id) {
      setPathToRedirect(`/spaces/${spaceId}/tasks/${id}/callback`)
      setRedirectAfterSocialLogin(`/spaces/${spaceId}/tasks/${id}/callback`)
    }
  }, [spaceId, id])

  useEffect(() => {
    if (flow?.state === 'sent_email') {
      setStep('code')
    } else if (flow?.state === 'choose_method') {
      setStep('oidc')
    }
  }, [flow])

  const onSubmit = async (payload: UpdateRegistrationFlowBody & { 'traits.email'?: string }, provider?: string) => {
    if (!flow) return

    if (payload['traits.email']) {
      setEmail(payload['traits.email'])
    }

    track(getTrackingEventForRegistrationFlowSubmit({ payload, provider, screen: 'taskRegistration' }))
    // Check if flow is still valid before submitting
    if (!flow.id || (flow.expires_at && new Date(flow.expires_at) < new Date())) {
      initializeFlow()?.then(() => {
        setStep('oidc')
      })
      return
    }

    showLoader()
    Keyboard.dismiss()

    try {
      const updateRegistrationFlowBody = await retrieveSubmitFlowBody(payload, provider)
      const extraBody: { 'traits.given_name'?: string } = {}
      if (name) {
        extraBody['traits.given_name'] = name
      }

      // Extract CSRF token from the flow
      const csrf_token = extractValue(flow, 'csrf_token')

      const { data } = await newKratosSdk().updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: {
          ...updateRegistrationFlowBody,
          ...extraBody,
          csrf_token,
        },
      })

      // Update the flow state with the response
      safeSetFlow(data)

      // ORY Kratos can be configured in such a way that it requires a login after
      // registration. You could handle that case by navigating to the Login screen
      // but for simplicity we'll just print an error here:
      if (Platform.OS === 'web' ? !data.session : !data.session_token) {
        throw new HoliOryRegistrationConfigError()
      }

      logger.debug('TaskCompletionFlow', 'registration was successful')

      const verificationFlowData = getVerificationFlowFromRegistration(data)
      setVerificationFlowData(verificationFlowData)

      await doLogin(client, {
        session: data.session,
        session_token: data.session_token,
      } as OrySessionContext)

      await handleCompleteTask()
    } catch (err) {
      if (
        (
          err as { response?: { data?: { ui?: { messages?: { id?: number }[] } } } }
        )?.response?.data?.ui?.messages?.find((message) => message.id === OryErrorCode.ACCOUNT_ALREADY_EXISTS)
      ) {
        displayError(err, 'Failed to submit registration form as e-mail is already used', {
          displayMessage: t('auth.login.message.1010016'),
          location: 'TaskCompletionFlow.onSubmit',
        })
        initializeFlow()?.then(() => {
          setStep('oidc')
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
                  location: 'TaskCompletionFlow.doBrowserLogin',
                }),
              error
            )
          })

          if (data) {
            await doLogin(client, data)
            await handleCompleteTask()
          }
        }
      } else {
        // Check if this is a flow expiration error (4040003)
        if (
          (
            err as { response?: { data?: { ui?: { messages?: { id?: number }[] } } } }
          )?.response?.data?.ui?.messages?.find((message) => message.id === 4040003)
        ) {
          displayError(err, 'Flow expired', {
            displayMessage: t('auth.login.message.4040003'),
            location: 'TaskCompletionFlow.onSubmit',
          })
          // Re-initialize the flow when it expires
          initializeFlow()?.then(() => {
            setStep('oidc')
          })
          return
        }

        handleFormSubmitError(
          safeSetFlow,
          initializeFlow,
          (error) =>
            displayError(error, 'Failed to submit form', {
              displayMessage: t('auth.registration.error.registration'),
              location: 'TaskCompletionFlow.onSubmit',
            }),
          err
        )
      }
    } finally {
      hideLoader()
    }
  }

  return (
    <>
      <Screen
        onRefresh={refetch}
        preset="scroll"
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        headerOptions={{
          headerBackVisible: false,
          headerTitleAlign: 'center',
          title: t('tasks.register.unlogged.header'),
          headerStyle: {
            backgroundColor: Platform.OS === 'web' ? theme.colors.background10 : theme.colors.brandB100,
          },
          headerLeft: () => (
            <HeaderBackButton
              {...(step === 'code'
                ? {
                    onPress: () => {
                      track(
                        TrackingEvent.Auth.HoliRegisterPressed({
                          method: 'back',
                          screen: 'taskRegistration',
                        })
                      )
                      setPathToRedirect(null)
                      removeRedirectAfterSocialLogin()
                      return initializeFlow()?.then(() => {
                        setStep('oidc')
                      })
                    },
                  }
                : {})}
            />
          ),
          navigationCustomOptions: {
            footerShown: false,
          },
        }}
        StickyBottomComponent={
          step === 'oidc' &&
          Platform.OS === 'web' && (
            <View style={styles.footer}>
              <HoliDivider />
              <HoliContainer>
                <DocumentsFooter />
              </HoliContainer>
            </View>
          )
        }
      >
        <>
          {/* Header */}
          <View style={styles.header}>
            <SafeArea style={styles.globalPadding}>
              <TaskCompletionSteps />
              <GoodDeedMoreCard
                title={data.title}
                imageSrc={data.coverImage?.uri}
                completedCount={totalCompletions || 0}
              />
            </SafeArea>
          </View>

          {isLoaderShown && (
            <View style={styles.loader}>
              <HoliLoader />
            </View>
          )}
          <View style={[styles.container, styles.extraPaddingBottom]}>
            <View style={styles.nativePadding}>
              {/* Body */}
              <View style={styles.body}>
                {step === 'oidc' && (
                  <>
                    <View style={styles.titleContainer}>
                      <Text size="3xl">{t('tasks.register.unlogged.title.v2')}</Text>
                      <Text>{t('tasks.register.unlogged.subtitle.v2')}</Text>
                      <View style={styles.animationContainer}>
                        <HoliLottie animType="goodDeedsVerify" loop={false} />
                      </View>
                    </View>
                  </>
                )}
                {step === 'code' && (
                  <View style={styles.codeInputContainer}>
                    <Text size="3xl">{t('registration.emailVerification.heading')}</Text>
                    <Text>{t('registration.emailVerification.body')}</Text>
                    <View style={styles.changeEmailContainer}>
                      <Text ellipsizeMode="tail" numberOfLines={1}>
                        {email}
                      </Text>
                      <ButtonTracked
                        icon={Edit2}
                        transparent
                        size="lg"
                        label={t('global.edit')}
                        onPress={() => {
                          showLoader()
                          initializeFlow()?.then(() => {
                            setStep('oidc')
                            hideLoader()
                          })
                        }}
                        trackingEvent={TrackingEvent.Auth.OneTimeCodePressed({
                          step: 'edit',
                          screen: 'taskRegistration',
                        })}
                      />
                    </View>
                  </View>
                )}
                {step === 'oidc' && (
                  <View style={styles.buttonContainer}>
                    {flow?.ui?.nodes
                      ?.filter((node) => node.group === 'oidc')
                      .map((node) => {
                        const provider = getNodeProviderName(node)
                        const providerId = getNodeProviderId(node)

                        if (!provider || !providerId) return null

                        return (
                          <View key={provider} style={styles.buttonWrapper}>
                            <SocialLoginButton
                              provider={provider as SocialLoginButtonProvider}
                              onPress={() => handleOidcLogin(provider)}
                              testID={`${provider.toLowerCase()}-login-button`}
                            />
                          </View>
                        )
                      })}
                    <View style={styles.buttonWrapper}>
                      <SocialLoginButton
                        provider="Email"
                        onPress={() => setStep('email-code')}
                        testID="email-login-button"
                      />
                    </View>
                  </View>
                )}
                {step === 'email-code' && (
                  <>
                    <HoliTextInput
                      style={{ marginTop: Spacing.xs }}
                      placeholder={t('tasks.register.unlogged.user.placeholder')}
                      value={name}
                      aria-label={t('tasks.register.unlogged.user.name')}
                      inputLabel={t('tasks.register.unlogged.user.name')}
                      onChange={setName}
                    />
                    <FormBuilder
                      flow={flow}
                      onSubmit={onSubmit}
                      nodesToShow={['email', 'code']}
                      withLoader={false}
                      handleMessage={handleMessage}
                      disabled={!name}
                    />
                  </>
                )}
                {step === 'code' && (
                  <FormBuilder
                    flow={flow}
                    onSubmit={onSubmit}
                    nodesToShow={['code']}
                    withLoader={false}
                    handleMessage={handleMessage}
                  />
                )}
              </View>
            </View>
            {step === 'oidc' && (
              <HoliLink href="/login" label={t('tasks.register.unlogged.verify.holi.v2')} testID="verify-holi-link">
                <View style={styles.verifyHoliContainer}>
                  <Text>{t('tasks.register.unlogged.verify.holi.v2')}</Text>
                  <HoliIcon icon={HoliLogo} />
                </View>
              </HoliLink>
            )}
          </View>
        </>
      </Screen>
      {step === 'oidc' && Platform.OS !== 'web' && (
        <View style={styles.footer}>
          <HoliDivider />
          <HoliContainer>
            <DocumentsFooter />
          </HoliContainer>
        </View>
      )}
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background20 },
    nativePadding: { paddingHorizontal: Platform.OS !== 'web' ? Spacing.xs : 0 },
    globalPadding: { paddingHorizontal: Spacing.xs },
    header: {
      backgroundColor: theme.colors.brandB100,
      borderBottomStartRadius: BorderRadius.xl,
      borderBottomEndRadius: BorderRadius.xl,
      paddingBottom: Spacing['xxs'],
    },
    learnMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: Spacing['4xs'] },
    body: { paddingTop: Spacing.md, paddingBottom: Spacing.lg, flex: 1 },
    loader: { paddingTop: Spacing['4xl'], position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000 },
    titleContainer: { gap: Spacing.xxs, marginBottom: Spacing.xs },
    buttonContainer: {
      width: '100%',
      gap: Spacing['3xs'],
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonWrapper: {
      flex: 1,
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
    divider: { flex: 1 },
    footer: {
      backgroundColor: theme.colors.background20,
      paddingBottom: Spacing.md,
      gap: Spacing.xs,
    },
    codeInputContainer: {
      marginTop: Spacing.md,
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: Spacing['3xs'],
    },
    changeEmailContainer: {
      flex: 1,
      marginTop: -Spacing.xxs,
      gap: Spacing['3xs'],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    extraPaddingBottom: {
      paddingBottom: Spacing['4xl'] * 2,
    },
    animationContainer: {
      marginVertical: Spacing.sm,
    },
    emailFormContainer: {
      gap: Spacing.xxs,
      marginBottom: Spacing.xs,
    },
    verifyHoliContainer: {
      padding: Spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xxs,
    },
  })

export default memo(TaskCompletionFlow)
