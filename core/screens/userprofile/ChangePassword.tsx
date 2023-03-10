import { SelfServiceSettingsFlow, SubmitSelfServiceSettingsFlowBody } from '@ory/kratos-client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { getSessionFromStorage, initSettingsFlow, submitSettingsFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout, useSafeDispatch } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChangePassword: React.VFC = () => {
  const { isLoggedIn } = useAuth()
  const logout = useLogout()
  const { setOptions, navigate } = useUnifiedNavigation()
  const { openLoginDialog } = useLoginRedirect()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const mixins = useStyleMixins()

  const [flow, setFlow] = useState<SelfServiceSettingsFlow>()
  const [sessionToken, setSessionToken] = useState<string>()
  const safeSetFlow = useSafeDispatch(setFlow)
  const setCustomFlow = useCallback(
    (flow: SelfServiceSettingsFlow) => {
      // Hide email input and email-change button
      // https://www.ory.sh/nextjs-authentication-spa-custom-flows-open-source/#rendering-the-account-settings-page
      const NODE_GROUP_TO_HIDE = 'profile'
      const filteredNodes = flow.ui.nodes.filter(({ group }) => group !== NODE_GROUP_TO_HIDE)
      const adjustedFlow = { ...flow, ui: { ...flow.ui, nodes: filteredNodes } }

      // TODO: Change password input label

      safeSetFlow(adjustedFlow)
    },
    [safeSetFlow]
  )

  const initForm = useCallback(async () => {
    if (isLoggedIn) {
      const session = await getSessionFromStorage()
      if (session) {
        setSessionToken(session.session_token)
        initSettingsFlow(session)
          .then(({ data: flow }) => setCustomFlow(flow))
          .catch((error: Error) => displayError(error, '## Retrieve flow ##'))
      }
    }
  }, [setCustomFlow, isLoggedIn, displayError])

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          Change Password
        </HoliHeading>
      ),
    })

    initForm()
  }, [setOptions, initForm])

  const performPasswordChange = (flowBody: SubmitSelfServiceSettingsFlowBody): Promise<void> => {
    if (flow)
      return submitSettingsFlow(flow.id, flowBody, sessionToken)
        .then(() => {
          initForm()
          openToast('Du hast dein Passwort erfolgreich geändert.', HoliToastType.SUCCESS, 4000)
          navigate('/profile')
        })
        .catch(handleFormSubmitError(setCustomFlow, initForm))
        .catch((error) => {
          // https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/updateSettingsFlow
          if (error.response.data.error.id === 'session_refresh_required') {
            openLoginDialog({
              title: 'Login veraltet',
              description:
                'Ihr letzter Login ist veraltet. Bitte melden sich sich ab und wieder an, um das Passwort ändern zu können',
              confirmText: 'Erneut einloggen',
              onConfirm: logout,
            })
            return
          }

          // technical error
          displayError(error, '## Change password ##')
        })
    return Promise.resolve()
  }

  return (
    <DefaultLayout style={styles.layout}>
      <View style={[mixins.container, styles.formContainer]}>
        <FormBuilder flow={flow} autofocusField="password" onSubmit={performPasswordChange} style={styles.loginForm} />
      </View>
    </DefaultLayout>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
  layout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    paddingTop: vars.topBarHeight,
    justifyContent: 'center',
  },
  formContainer: {
    maxWidth: vars.maxButtonWidth,
    paddingBottom: vars.topBarHeight,
  },
  loginForm: {
    // reserves space for the form until ory flow is done
    minHeight: 235,
    width: '100%',
  },
})
