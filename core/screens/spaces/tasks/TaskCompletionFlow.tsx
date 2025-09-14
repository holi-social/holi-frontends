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
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { StyleSheet } from 'react-native'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import TaskCompletionSteps from '@holi/core/screens/spaces/tasks/components/TaskCompletionSteps'
import { doLogin, getVerificationFlowFromRegistration, initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { useLoginState } from '@holi/core/auth/loginState'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import { useSafeDispatch } from '@holi/core/helpers/useSafeDispatch'
import { useErrorHandling } from '@holi/core/errors/hooks/useErrorHandling'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { doBrowserLogin, retrieveSubmitFlowBody } from '@holi/core/auth/helpers/auth/helpers'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { TrackingEvent } from '@holi/core/tracking'
import { newKratosSdk, type OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { getLogger } from '@holi/core/helpers/logging'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useApolloClient } from '@apollo/client'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { GoodDeedMoreCard } from '@holi/core/screens/spaces/tasks/components/GoodDeedMoreCard'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { storeWelcomeGoodDeedsCounterModal } from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounterModal/useDisplayWelcomeGoodDeedsCounterModal'
import { Edit2 } from '@holi/icons/src/generated'
import { setRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers.web'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { getTrackingEventForRegistrationFlowSubmit } from '@holi/core/auth/helpers/auth/tracking'
import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'

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
  const [step, setStep] = useState<'code' | 'email'>('email')
  const [email, setEmail] = useState<string | undefined>(undefined)

  const { refetch, data, id, spaceId, totalCompletions } = useTaskDetailsData()

  useEffect(() => {
    if (isLoggedIn && spaceId && id) {
      navigate(`/spaces/${spaceId}/tasks/${id}/callback`)
    }
  }, [isLoggedIn, spaceId, id, navigate])

  const handleCompleteTask = () => {
    storeWelcomeGoodDeedsCounterModal(true)
  }

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
      setPathToRedirect(`/spaces/${spaceId}/tasks/${id}/callback`)
      setRedirectAfterSocialLogin(`/spaces/${spaceId}/tasks/${id}/callback`)
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
    track(getTrackingEventForRegistrationFlowSubmit({ payload, provider, screen: 'taskRegistration' }))
    if (flow) {
      showLoader()
      Keyboard.dismiss()

      try {
        const updateRegistrationFlowBody = await retrieveSubmitFlowBody(payload, provider)
        const extraBody: { 'traits.given_name'?: string } = {}
        if (name) {
          extraBody['traits.given_name'] = name
        }
        const { data } = await newKratosSdk().updateRegistrationFlow({
          flow: flow.id,
          updateRegistrationFlowBody: {
            ...updateRegistrationFlowBody,
            ...extraBody,
          },
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
                      return initializeFlow()?.then(() => {
                        setStep('email')
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
          step === 'email' &&
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
                {step === 'email' && (
                  <>
                    <View style={styles.titleContainer}>
                      <Text size="3xl">{t('tasks.register.unlogged.title')}</Text>
                      <Text size="md">{t('tasks.register.unlogged.subtitle')}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <FormBuilder
                        flow={flow}
                        onSubmit={onSubmit}
                        nodesToShow={['oidc']}
                        oidcProviders={['Google']}
                        noAutofocusForEmail
                        withLoader={false}
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
                      <Text size="md" ellipsizeMode="tail" numberOfLines={1}>
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
                            setStep('email')
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
                <FormBuilder
                  flow={flow}
                  onSubmit={onSubmit}
                  nodesToShow={step === 'email' ? ['code', 'email'] : ['code']}
                  withLoader={false}
                  noAutofocusForEmail
                />
              </View>
              {
                <AlreadyHaveAccountText
                  onPress={() => navigate('/login')}
                  trackingEvent={TrackingEvent.Auth.LoginButtonPressed}
                />
              }
            </View>
          </View>
        </>
      </Screen>
      {step === 'email' && Platform.OS !== 'web' && (
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
  })

export default memo(TaskCompletionFlow)
