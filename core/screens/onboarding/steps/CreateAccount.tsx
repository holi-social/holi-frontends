import { useApolloClient } from '@apollo/client'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { getVerificationFlowFromRegistration, initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { type OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import GiveFiveFilledPng from '@holi/ui/assets/img/icons/give-five-filled.png'
import GiveFiveFilled from '@holi/ui/assets/img/icons/give-five-filled.svg'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'

const logger = getLogger('CreateAccount')

const isWeb = Platform.OS === 'web'
const isAndroid = Platform.OS === 'android'

interface CreateAccountProps {
  onRegister: () => void
  onContinueAsGuest: () => void
  onLogin: () => void
  testID?: string
}

export const CreateAccount = ({
  onRegister,
  onContinueAsGuest,
  onLogin,
  testID = 'create-account',
}: CreateAccountProps) => {
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const { t } = useTranslation()
  const client = useApolloClient()
  // use safe versions of this function to prevent updating state of destroyed component
  const safeSetFlow = useSafeDispatch(setFlow)
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { track } = useTracking()

  const initializeFlow = useCallback(() => {
    if (!isLoggedOut) return

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
  }, [isLoggedOut, t, safeSetFlow, displayError])

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
        setVerificationFlowData(verificationFlowData)

        await client.clearStore()
        await setLoginStateLoggedIn({
          session: data.session,
          session_token: data.session_token,
        } as OrySessionContext)

        onRegister()
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

  return (
    <View style={styles.contentContainer} testID={testID}>
      <View>
        <HoliGap size="xs" />
        <View style={styles.logo}>
          <HoliLogo color={theme.colors.black300} />
        </View>
        <HoliGap size="m" />
        <Text headingLevel="1" size="4xl" textAlign="center">
          {t('registration.signUp.heading')}

          <HoliLocalImage
            imageSource={isAndroid ? GiveFiveFilledPng : GiveFiveFilled}
            width={50}
            height={40}
            label={''}
            isSvg={!isAndroid}
          />
        </Text>
        <HoliGap size="xs" />
        <Text size="md">{t('registration.signUp.description')}</Text>
        <FormBuilder flow={flow} onSubmit={onSubmit} style={styles.loginForm} />
        <HoliGap size="s" />
        <ButtonTracked
          label={t('auth.loginProtection.continueAsGuest')}
          onPress={onContinueAsGuest}
          variant="secondary"
          testID={`${testID}-btn-continue-as-guest`}
          trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
        />

        <HoliGap size="xxs" />
        <Text size="xs" variant="secondary" textAlign="center">
          {t('auth.loginProtection.continueAsGuest.warning')}
        </Text>
        <HoliGap size="m" />
        <AlreadyHaveAccountText onPress={onLogin} trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
      </View>

      <View>
        <HoliGap size="xs" />
        <DocumentsFooter />
        <HoliGap size="xs" />
      </View>

      {isLoaderShown && <HoliLoader />}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    contentContainer: {
      justifyContent: 'space-between',
      flex: 1,
    },
    logo: {
      alignItems: 'center',
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
  })
