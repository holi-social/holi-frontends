import { SelfServiceSettingsFlow, SubmitSelfServiceSettingsFlowBody } from '@ory/kratos-client'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { getSessionFromStorage, initSettingsFlow, submitSettingsFlow } from '@holi/core/auth/helpers/auth'
import { getNodeById, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout, useSafeDispatch } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

const ChangePassword: React.VFC = () => {
  const { isLoggedIn } = useAuth()
  const logout = useLogout()
  const { navigate } = useRouting()
  const { openLoginDialog } = useLoginRedirect()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [flow, setFlow] = useState<SelfServiceSettingsFlow>()
  const [sessionToken, setSessionToken] = useState<string>()
  const safeSetFlow = useSafeDispatch(setFlow)
  const setCustomFlow = useCallback(
    (flow: SelfServiceSettingsFlow) => {
      // TODO: disable (hide) email field
      const emailNode = getNodeById('traits.email', flow)[0]
      if (emailNode) {
        emailNode.attributes.disabled = true
      }
      // TODO: hide email-change-button (ideally in ory config)
      safeSetFlow(flow)
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
          .catch((error: Error) => displayError(error, '## Error on retrieving the settings flow ##'))
      }
    }
  }, [setCustomFlow, isLoggedIn, displayError])

  useEffect(() => {
    initForm()
  }, [initForm])

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
          displayError(error, '## Error on submitting password change ##')
        })
    return Promise.resolve()
  }

  return (
    <DefaultLayout>
      <View style={styles.formContainer}>
        <HoliText size="extralarge">Change Password page</HoliText>
        <FormBuilder flow={flow} onSubmit={performPasswordChange} style={styles.loginForm} />
      </View>
    </DefaultLayout>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 80,
  },
  loginForm: {
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 235,
    width: '100%',
  },
})
