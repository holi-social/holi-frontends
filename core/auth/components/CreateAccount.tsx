import { useApolloClient } from '@apollo/client'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Keyboard, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { getVerificationFlowFromRegistration, initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { type OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { HoliButtonTracked } from '@holi/core/components/Trackable'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { Text } from 'holi-bricks/components/text'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import GiveFiveFilledPng from '@holi/ui/assets/img/icons/give-five-filled.png'
import GiveFiveFilled from '@holi/ui/assets/img/icons/give-five-filled.svg'
import { Spacing } from 'holi-bricks/tokens'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'

const logger = getLogger('CreateAccount')

const isWeb = Platform.OS === 'web'

interface CreateAccountProps {
  onRegister: () => Promise<void>
  onDismiss: () => void
}

// TODO: remove this constant after connecting onboarding and registration
const show_continueAsGuest_warning = false

const CreateAccount = ({ onRegister, onDismiss }: CreateAccountProps) => {
  const { isLoggedIn } = useLoginState()
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const { t } = useTranslation()
  const client = useApolloClient()
  // use safe versions of this function to prevent updating state of destroyed component
  const safeSetFlow = useSafeDispatch(setFlow)
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { track } = useTracking()

  const initializeFlow = useCallback(() => {
    if (isLoggedIn) return

    initRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error) =>
        displayError(error, 'Failed to initialize registration flow', {
          displayMessage: t('auth.registration.error.initialization'),
          location: 'CreateAccount.initRegistrationFlow',
        })
      )
  }, [isLoggedIn, t, safeSetFlow, displayError])

  // When the component is mounted, we initialize a new use login flow:
  useIsomorphicLayoutEffect(() => {
    initializeFlow()
  }, [initializeFlow])

  const onSubmit = async (payload: UpdateRegistrationFlowBody) => {
    track(TrackingEvent.Auth.RegisterButtonPressed)
    if (flow) {
      showLoader()
      Keyboard.dismiss()

      try {
        const { data } = await newKratosSdk().updateRegistrationFlow({
          flow: flow.id,
          updateRegistrationFlowBody: payload,
        })
        // ORY Kratos can be configured in such a way that it requires a login after
        // registration. You could handle that case by navigating to the Login screen
        // but for simplicity we'll just print an error here:
        if (isWeb ? !data.session : !data.session_token) {
          const err = new HoliOnboardingError(
            'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
          )
          throw err
        }

        logger.debug('CreateAccount', 'registration was successful')

        const verificationFlowData = getVerificationFlowFromRegistration(data)
        // verification flow is disabled in Ory if `verificationFlowData` is `undefined`
        setVerificationFlowData(verificationFlowData ?? 'verification-disabled')

        await client.clearStore()

        // update Onboarding state before loading a user
        await onRegister()
        // and only then load user
        await setLoginStateLoggedIn({
          session: data.session,
          session_token: data.session_token,
        } as OrySessionContext)
      } catch (err) {
        handleFormSubmitError(
          setFlow,
          initializeFlow,
          (error) =>
            displayError(error, 'Failed to submit form', {
              displayMessage: t('auth.registration.error.registration'),
              location: 'CreateAccount.onSubmit',
            }),
          err
        )
      } finally {
        hideLoader()
      }
    }
  }

  // in Web we navigate to the legal document page in profile settings
  // but on mobile we navigate to a scrren in the RootNavigator to open it as a modal
  const legalDocPath =
    Platform.OS === 'web' ? '/profile/settings/legalDocuments/document' : 'onboarding/registration/legalDocuments'

  return (
    <HoliKeyboardSaveView>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <HoliContainer flex={1}>
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <View>
              <HoliGap size="xs" />
              <HoliTransition.FadeDown visible style={styles.logo}>
                <HoliLogo color={theme.colors.black300} />
              </HoliTransition.FadeDown>

              <HoliGap size="m" />

              <HoliTransition.FadeDown visible index={1}>
                <View style={styles.title}>
                  <Text headingLevel="1" size="4xl">
                    {t('registration.signUp.heading')}
                  </Text>

                  <HoliLocalImage
                    imageSource={Platform.OS === 'android' ? GiveFiveFilledPng : GiveFiveFilled}
                    width={50}
                    height={40}
                    label={''}
                    isSvg={Platform.OS !== 'android'}
                  />
                </View>

                <HoliGap size="xs" />
                <Text size="md">{t('registration.signUp.description')}</Text>
              </HoliTransition.FadeDown>

              <HoliTransition.FadeDown visible index={2}>
                <FormBuilder
                  flow={flow}
                  onSubmit={onSubmit}
                  style={styles.loginForm}
                  scrollToInputWithId={scrollToInputWithId}
                />
              </HoliTransition.FadeDown>

              <HoliGap size="s" />
              <HoliTransition.FadeDown visible index={3}>
                <HoliButtonTracked
                  label={t('auth.loginProtection.continueAsGuest')}
                  onPress={onDismiss}
                  type="secondary"
                  testID="btn-to-continue-as-guest"
                  trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
                >
                  {t('auth.loginProtection.continueAsGuest')}
                </HoliButtonTracked>

                {/* TODO: remove this condition after connecting onboarding and registration */}
                {show_continueAsGuest_warning && (
                  <>
                    <HoliGap size="xxs" />
                    <Text size="xs" variant="secondary" textAlign="center">
                      {t('auth.loginProtection.continueAsGuest.warning')}
                    </Text>
                  </>
                )}

                <HoliGap size="m" />
                <AlreadyHaveAccountText trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
              </HoliTransition.FadeDown>
            </View>

            <HoliTransition.FadeDown visible index={4}>
              <HoliGap size="xs" />
              <Text size="sm" textAlign="center">
                <Trans t={t} i18nKey={'auth.registration.privacyPolicyAndTermsOfUse'}>
                  <HoliTextLink
                    label={t('auth.registration.privacyPolicy')}
                    href={`${legalDocPath}?type=privacyPolicy`}
                    size="sm"
                    external={isWeb}
                  />

                  <HoliTextLink
                    label={t('auth.registration.termsOfUse')}
                    href={`${legalDocPath}?type=termsOfUse`}
                    size="sm"
                    external={isWeb}
                  />
                </Trans>
              </Text>
              <HoliGap size="xs" />
            </HoliTransition.FadeDown>
          </View>

          {isLoaderShown && <HoliLoader />}
        </HoliContainer>
      </ScrollView>
    </HoliKeyboardSaveView>
  )
}

export default memo(CreateAccount)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    logo: {
      alignItems: 'center',
    },
    title: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
      justifyContent: 'center',
    },
    description: {
      color: theme.colors.foreground20,
      marginTop: 16,
    },
    loginForm: {
      // reserves space for inputs plus submit until ory flow is done
      minHeight: 235,
      width: '100%',
    },
    headline3: {
      marginTop: 16,
    },
  })
