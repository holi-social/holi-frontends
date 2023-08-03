import {
  ContinueWith,
  ContinueWithVerificationUi,
  ContinueWithVerificationUiActionEnum,
  RegistrationFlow,
  SuccessfulNativeRegistration,
  UpdateRegistrationFlowBody,
} from '@ory/kratos-client'
import React, { memo, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, ScrollView, StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { setUserLoggedIn, useAuth } from '@holi/core/auth/helpers/useAuth'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { colors, vars } from '@holi/ui/styles/globalVars'

const isWeb = Platform.OS === 'web'

interface CreateAccountProps {
  onRegister: () => void
}

const isContinueWithVerificationUi = (continueWith: ContinueWith): continueWith is ContinueWithVerificationUi => {
  return continueWith.action === ContinueWithVerificationUiActionEnum.ShowVerificationUi
}

const getVerificationFlow = ({ continue_with }: SuccessfulNativeRegistration) => {
  return continue_with?.find(isContinueWithVerificationUi)?.flow
}

const CreateAccount = ({ onRegister }: CreateAccountProps) => {
  const { userId } = useAuth()
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const { t } = useTranslation()
  // use safe versions of this function to prevent updating state of destroyed component
  const safeSetFlow = useSafeDispatch(setFlow)
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)
  const redirect = useRedirect()

  const initializeFlow = useCallback(() => {
    if (userId) return

    initRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error) => displayError(error, t('auth.registration.error.initialization')))
  }, [safeSetFlow, t, userId, displayError])

  // When the component is mounted, we initialize a new use login flow:
  useLayoutEffect(() => {
    initializeFlow()
  }, [initializeFlow])

  const onSubmit = async (payload: UpdateRegistrationFlowBody) => {
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

        console.debug('[Registration.tsx] registration was successful.')

        const verificationFlowData = getVerificationFlow(data)
        // verification flow is disabled in Ory if `verificationFlowData` is `undefined`
        setVerificationFlowData(verificationFlowData ?? 'verification-disabled')

        // !!! IMPORTANT first run `onRegister()` to update value in AsyncStorage
        await onRegister()
        // and only then load user
        await setUserLoggedIn(
          {
            session: data.session,
            session_token: data.session_token,
          } as OrySessionContext,
          undefined,
          true
        )

        redirect()
      } catch (err) {
        handleFormSubmitError(
          setFlow,
          initializeFlow,
          (error) => displayError(error, t('auth.registration.error.registration')),
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
          <HoliHeading level="1" size="medium" style={styles.headline} testID="sign-up-headline">
            {t('registration.signUp.heading')}
          </HoliHeading>

          <HoliText style={styles.description}>{t('registration.signUp.description')}</HoliText>
          <FormBuilder
            flow={flow}
            onSubmit={onSubmit}
            style={styles.loginForm}
            scrollToInputWithId={scrollToInputWithId}
          />

          <View style={{ alignItems: 'center' }}>
            <AlreadyHaveAccountText style={styles.loginHeadline} />
          </View>
        </View>

        {isLoaderShown && <HoliLoader />}
      </CenteredContentLayout>
    </HoliKeyboardSaveView>
  )
}

export default memo(CreateAccount)

const styles = StyleSheet.create({
  inner: {
    maxWidth: vars.breakpointL,
    width: '100%',
  },
  headline: {
    fontWeight: '400',
  },
  description: {
    color: colors.foreground20,
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
  loginHeadline: {
    marginTop: 16,
    textAlign: 'center',
  },
})
