import { useApolloClient } from '@apollo/client'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { doLogin, hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import { confirmOAuth2Login, type OAuth2DefaultProps } from '@holi/core/auth/helpers/oauth2'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { useLoginState } from '@holi/core/auth/loginState'
import { OAuth2Redirect, type OAuth2RedirectProps } from '@holi/core/auth/screens/OAuth2Redirect'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { Text } from 'holi-bricks/components/text'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Screen } from '@holi/core/components/Screen'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'

export interface OAuth2LoginProps extends OAuth2DefaultProps, OAuth2RedirectProps {
  returnTo?: string
}

// Only used for OAuth2 login flow on web, see apps/web/pages/oauth2/login.tsx
// Performing direct redirects by changing window.location.href
export const OAuth2Login: React.FC<OAuth2LoginProps> = ({ returnTo = '', isInWebview = false, ...redirectProps }) => {
  const { isLoggedIn } = useLoginState()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const setScreenOptions = useSetScreenOptions()
  const client = useApolloClient()
  const { track } = useTracking()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('auth.login')}
        </Text>
      ),
      headerLeft: () => null,
      navigationCustomOptions: {
        footerShown: !isInWebview,
      },
    })
  }, [isInWebview, returnTo, setScreenOptions, t])

  useIsomorphicLayoutEffect(() => {
    if (isLoggedIn) {
      confirmOAuth2Login()
      window.location.href = returnTo
    }
  }, [returnTo, isLoggedIn])

  const initializeFlow = useCallback(() => {
    initLoginFlow()
      .then(safeSetFlow)
      .catch((error) =>
        displayError(error, 'Failed to initialize login flow', {
          displayMessage: t('auth.login.error.initialization'),
          location: 'OAuth2Login.initializeFlow',
        })
      )
  }, [safeSetFlow, displayError, t])

  useEffect(() => {
    if (!isLoggedIn && !flow) {
      initializeFlow()
    }
  }, [isLoggedIn, initializeFlow, flow])

  const performLogin = async (payload: UpdateLoginFlowBody, provider?: string) => {
    track(provider ? TrackingEvent.Auth.SocialLoginButtonPressed(provider) : TrackingEvent.Auth.LoginButtonPressed)

    if (!flow) return

    showLoader()

    try {
      const { data } = (await submitLoginFlow(flow, payload, provider, undefined)) as { data: OrySessionContext }
      await doLogin(client, data)
      confirmOAuth2Login()
      window.location.href = returnTo
    } catch (err) {
      const url = getBrowserRedirect(err)
      if (url) {
        window.location.href = url
      } else if (hasIdentifier(payload) && isUnverifiedUserError(err)) {
        // Let the OAuth2 flow fail if it's not just a form error
        const [returnUrl, queryParams = ''] = returnTo.split('?')
        const searchParams = new URLSearchParams(queryParams)
        searchParams.append('error', 'Account not verified yet')
        window.location.href = returnUrl + '?' + searchParams.toString()
      } else {
        handleFormSubmitError(
          safeSetFlow,
          initializeFlow,
          (err) =>
            displayError(err, 'Failed to login user', {
              displayMessage: t('auth.login.error.login'),
              location: 'OAuth2Login.performLogin',
            }),
          err
        )
      }
    } finally {
      hideLoader()
    }
  }

  if (isLoggedIn || redirectProps.error) {
    return <OAuth2Redirect {...redirectProps} />
  }

  return (
    <Screen preset="scroll" backgroundColor="support" keyboardShouldPersistTaps="always">
      <DefaultLayout>
        <HoliContainer>
          <FormBuilder flow={flow} onSubmit={performLogin} style={styles.loginForm} isSignin={true} />
        </HoliContainer>
        {isLoaderShown && <HoliLoader testID="loader" />}
      </DefaultLayout>
    </Screen>
  )
}

const styles = StyleSheet.create({
  loginForm: {
    minHeight: 235,
    width: '100%',
  },
})
