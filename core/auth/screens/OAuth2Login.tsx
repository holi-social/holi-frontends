import { useApolloClient } from '@apollo/client'
import { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import { confirmOAuth2Login, OAuth2DefaultProps } from '@holi/core/auth/helpers/oauth2'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import OAuth2Redirect, { OAuth2RedirectProps } from '@holi/core/auth/screens/OAuth2Redirect'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'

export interface OAuth2LoginProps extends OAuth2DefaultProps, OAuth2RedirectProps {
  returnTo?: string
}

// Only used for OAuth2 login flow on web, see apps/web/pages/oauth2/login.tsx
// Performing direct redirects by changing window.location.href
const OAuth2Login: React.FC<OAuth2LoginProps> = ({ returnTo = '', isInWebview = false, ...redirectProps }) => {
  const { isLoggedIn } = useLoginState()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const setScreenOptions = useSetScreenOptions()
  const client = useApolloClient()

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('auth.login')}
        </HoliHeading>
      ),
      headerLeft: () => null,
      navigationCustomOptions: {
        footerShown: !isInWebview,
      },
    })
  }, [isInWebview, returnTo, setScreenOptions, t])

  useLayoutEffect(() => {
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
  }, [t, safeSetFlow, displayError])

  useEffect(() => {
    if (!isLoggedIn && !flow) {
      initializeFlow()
    }
  }, [isLoggedIn, initializeFlow, flow])

  const performLogin = async (payload: UpdateLoginFlowBody) => {
    if (!flow) return

    showLoader()

    try {
      const { data } = (await submitLoginFlow(flow, payload, undefined)) as { data: OrySessionContext }
      await client.clearStore()
      await setLoginStateLoggedIn(data)
      confirmOAuth2Login()
      window.location.href = returnTo
    } catch (err) {
      if (hasIdentifier(payload) && isUnverifiedUserError(err)) {
        // Let the OAuth2 flow fail if it's not just a form error
        const [returnUrl, queryParams = ''] = returnTo.split('?')
        const searchParams = new URLSearchParams(queryParams)
        if (err && typeof err === 'object') {
          searchParams.append('error', err.toString())
        }
        window.location.href = returnUrl + searchParams.toString()
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

  if (redirectProps.error) {
    return <OAuth2Redirect {...redirectProps} />
  }

  return (
    <DefaultLayout headerOverlap={true} keyboardShouldPersistTaps="always">
      <HoliBox padding={[0, 24]}>
        <FormBuilder flow={flow} onSubmit={performLogin} style={styles.loginForm} isSignin={true} />
      </HoliBox>
      {isLoaderShown && <HoliLoader />}
    </DefaultLayout>
  )
}

export default memo(OAuth2Login)

const styles = StyleSheet.create({
  loginForm: {
    marginTop: 80,
    alignSelf: 'center',
    alignItems: 'center',
    maxWidth: 500,
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 235,
    width: '100%',
  },
})
