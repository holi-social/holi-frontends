import { useApolloClient } from '@apollo/client'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, type ScrollView, StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { getVerificationFlowFromRegistration, initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { type OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import { HoliButtonTracked } from '@holi/core/components/Trackable'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const logger = getLogger('CreateAccount')

const isWeb = Platform.OS === 'web'

interface CreateAccountProps {
  onRegister: () => Promise<void>
  onDismiss: () => void
}

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
  const redirect = useRedirect()
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
  useLayoutEffect(() => {
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

        redirect()
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
    <HoliKeyboardSaveView>
      <CenteredContentLayout ref={scrollViewRef} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <HoliHeading level="1" size="m" testID="sign-up-headline">
            {t('registration.signUp.heading')}
          </HoliHeading>

          <HoliText style={styles.description}>{t('registration.signUp.description')}</HoliText>
          <FormBuilder
            flow={flow}
            onSubmit={onSubmit}
            style={styles.loginForm}
            scrollToInputWithId={scrollToInputWithId}
          />

          <HoliGap size="m" />

          <HoliButtonTracked
            label={t('auth.loginProtection.continueAsGuest')}
            onPress={onDismiss}
            type="secondary"
            testID="btn-to-continue-as-guest"
            trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
          >
            {t('auth.loginProtection.continueAsGuest')}
          </HoliButtonTracked>

          <HoliGap size="s" />

          <AlreadyHaveAccountText trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
        </View>

        {isLoaderShown && <HoliLoader />}
      </CenteredContentLayout>
    </HoliKeyboardSaveView>
  )
}

export default memo(CreateAccount)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    inner: {
      width: '100%',
    },
    description: {
      color: theme.colors.foreground20,
      marginTop: 16,
    },
    loginForm: {
      // reserves space for inputs plus submit until ory flow is done
      marginTop: 32,
      minHeight: 235,
      width: '100%',
    },
    headline3: {
      marginTop: 16,
    },
  })
