import React, { memo, useCallback, useEffect, useState } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { Keyboard, Platform } from 'react-native'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { View } from 'react-native'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { StyleSheet } from 'react-native'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import TaskCompletionSteps from '@holi/core/screens/spaces/tasks/components/TaskCompletionSteps'
import { doLogin, getVerificationFlowFromRegistration, initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { useLoginState } from '@holi/core/auth/loginState'
import { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import { useSafeDispatch } from '@holi/core/helpers/useSafeDispatch'
import { useErrorHandling } from '@holi/core/errors/hooks/useErrorHandling'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { doBrowserLogin, retrieveSubmitFlowBody } from '@holi/core/auth/helpers/auth/helpers'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { SocialLoginButton } from 'holi-bricks/components/button/SocialLoginButton'
import { TrackingEvent } from '@holi/core/tracking'
import { newKratosSdk, OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { getLogger } from '@holi/core/helpers/logging'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useApolloClient, useMutation } from '@apollo/client'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import {
  updateAuthenticatedUserV2Mutation,
  UpdateAuthenticatedUserV2Response,
} from '@holi/core/screens/userprofile/queries'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { useCompleteTask } from '@holi/core/screens/spaces/tasks/useCompleteTask'
import { GoodDeedMoreCard } from 'holi-bricks/patterns/good-deed-card/GoodDeedMoreCard'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { storeWelcomeGoodDeedsCounter } from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounter'
import { Button } from 'holi-bricks/components/button'
import { Edit2 } from '@holi/icons/src/generated'

const logger = getLogger('TaskCompletionFlow')

export type TaskCompletionFlowParams = {
  taskId: string
}

const TaskCompletionFlow = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = getStyles(theme)
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { displayError } = useErrorHandling()
  const [name, setName] = useState<string | undefined>(undefined)
  const { track } = useTracking()
  const { showLoader, hideLoader, isLoaderShown } = useLoader()
  const client = useApolloClient()
  const { navigate } = useRouting()
  const [step, setStep] = useState<'code' | 'email'>('email')
  const [email, setEmail] = useState<string | undefined>(undefined)

  const { refetch, data, id, spaceId, totalCompletions } = useTaskDetailsData()

  const [updateUser] = useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)
  const { completeTask } = useCompleteTask()

  const handleCompleteTask = useCallback(async () => {
    await completeTask(id as string)

    try {
      if (name) {
        await updateUser({
          variables: { input: { firstName: name, lastName: '', pronouns: '' } },
        })
      }
    } catch (error) {
      logger.debug('TaskCompletionFlow', 'Failed to update user', { error })
      // ignore error - there is an async flow happening on ory and this can be unstable
      // later on the user will be automatically redirect to the name input again if this fails
    }

    storeWelcomeGoodDeedsCounter(true)
    navigate(`/spaces/${spaceId}/tasks/${id}/completed`)
  }, [id, name, spaceId, completeTask, updateUser, navigate])

  const initializeFlow = useCallback(() => {
    if (!isLoggedOut) {
      return
    }
    showLoader()

    return (
      initRegistrationFlow()
        // The flow was initialized successfully, let's set the form data:
        .then(({ data: flow }) => {
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
      setPathToRedirect(`/spaces/${spaceId}/tasks/${id}/complete`)
    }
  }, [spaceId, id])

  useEffect(() => {
    if (flow?.state === 'sent_email') {
      setStep('code')
    }
  }, [flow])

  const onSubmit = async (payload: UpdateRegistrationFlowBody & { 'traits.email'?: string }, provider?: string) => {
    if (payload['traits.email']) {
      setEmail(payload['traits.email'])
    }
    track(
      provider ? TrackingEvent.Auth.SocialRegisterButtonPressed(provider) : TrackingEvent.Auth.RegisterButtonPressed
    )
    if (flow) {
      showLoader()
      Keyboard.dismiss()

      try {
        const updateRegistrationFlowBody = await retrieveSubmitFlowBody(payload, provider)
        const { data } = await newKratosSdk().updateRegistrationFlow({
          flow: flow.id,
          updateRegistrationFlowBody,
        })
        // ORY Kratos can be configured in such a way that it requires a login after
        // registration. You could handle that case by navigating to the Login screen
        // but for simplicity we'll just print an error here:
        if (Platform.OS === 'web' ? !data.session : !data.session_token) {
          const err = new HoliOnboardingError(
            'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
          )
          throw err
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
          )?.response?.data?.ui?.messages?.find((message) => message.id === 4000007)
        ) {
          displayError(err, 'Failed to submit form', {
            displayMessage: t('auth.login.message.1010016'),
            location: 'TaskCompletionFlow.onSubmit',
          })
          initializeFlow()?.then(() => {
            setStep('email')
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
  }

  return (
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
                  onPress: () =>
                    initializeFlow()?.then(() => {
                      setStep('email')
                    }),
                }
              : {})}
          />
        ),
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
    >
      <>
        {/* Header */}
        <View style={styles.header}>
          <SafeArea>
            <HoliContainer>
              <TaskCompletionSteps />
              <GoodDeedMoreCard
                title={data.title}
                imageSrc={data.coverImage?.uri}
                completedCount={totalCompletions || 0}
              />
            </HoliContainer>
          </SafeArea>
        </View>

        <View style={styles.container}>
          {!isLoaderShown && (
            <HoliContainer>
              {/* Body */}
              <View style={styles.body}>
                {step === 'email' && (
                  <>
                    <View style={styles.titleContainer}>
                      <Text size="4xl">{t('tasks.register.unlogged.title')}</Text>
                      <Text size="md">{t('tasks.register.unlogged.subtitle')}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <FormBuilder
                        flow={flow}
                        onSubmit={onSubmit}
                        nodesToShow={['oidc']}
                        oidcProviders={['Google']}
                        noAutofocusForEmail
                      />

                      <SocialLoginButton
                        label={t('tasks.register.unlogged.verify.holi')}
                        provider="Holi"
                        testID={'ory-submit-email-button'}
                        onPress={() => {
                          navigate('/login')
                        }}
                      />
                    </View>
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
                  </>
                )}
                {step === 'email' && (
                  <HoliTextInput
                    placeholder={t('onboarding.names.firstName.input.placeHolder')}
                    value={name}
                    aria-label={t('user.profileForm.firstName')}
                    inputLabel={t('user.profileForm.firstName')}
                    onChange={setName}
                  />
                )}
                {step === 'code' && (
                  <View style={styles.codeInputContainer}>
                    <Text size="3xl">{t('registration.emailVerification.heading')}</Text>
                    <Text size="md">{t('registration.emailVerification.body')}</Text>
                    <View style={styles.changeEmailContainer}>
                      <Text size="md">{email}</Text>
                      <Button
                        icon={Edit2}
                        transparent
                        size="lg"
                        label={t('global.edit')}
                        onPress={() => {
                          showLoader()
                          initializeFlow()?.then(() => {
                            setStep('email')
                            hideLoader()
                          })
                        }}
                      />
                    </View>
                  </View>
                )}
                <FormBuilder
                  flow={flow}
                  onSubmit={onSubmit}
                  nodesToShow={step === 'email' ? ['code', 'email'] : ['code']}
                  withLoader={false}
                  noAutofocusForEmail
                />
              </View>
              {step === 'email' && (
                <View style={styles.footer}>
                  <HoliDivider />
                  <DocumentsFooter />
                </View>
              )}
            </HoliContainer>
          )}
        </View>
      </>
    </Screen>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background20 },
    header: {
      backgroundColor: theme.colors.brandB100,
      borderBottomStartRadius: BorderRadius.xl,
      borderBottomEndRadius: BorderRadius.xl,
      paddingBottom: Spacing['xxs'],
    },
    learnMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: Spacing['4xs'] },
    body: { paddingTop: Spacing.md, paddingBottom: Spacing.lg, flex: 1 },
    titleContainer: { gap: Spacing.xxs, marginBottom: Spacing.xs },
    buttonContainer: { gap: Spacing['3xs'] },
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
      paddingBottom: Spacing.sm,
      gap: Spacing.xs,
    },
    codeInputContainer: {
      marginTop: Spacing.md,
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: Spacing['3xs'],
    },
    changeEmailContainer: {
      marginTop: -Spacing.xxs,
      gap: Spacing['3xs'],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  })

export default memo(TaskCompletionFlow)
