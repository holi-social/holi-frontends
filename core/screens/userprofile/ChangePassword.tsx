import { SelfServiceSettingsFlow, SubmitSelfServiceSettingsFlowBody } from '@ory/kratos-client'
import { AxiosPromise } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import { getNodeById, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { useSafeDispatch } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

const ChangePassword: React.VFC = () => {
  const { isLoggedIn } = useAuth()
  const { navigate } = useRouting()
  const { openLoginDialog } = useLoginRedirect()
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

  // https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/createNativeSettingsFlow
  const initSettingsFlow = (session: OrySessionContext): AxiosPromise<SelfServiceSettingsFlow> => {
    if (Platform.OS === 'web') return newKratosSdk().initializeSelfServiceSettingsFlowForBrowsers()
    return newKratosSdk().initializeSelfServiceSettingsFlowWithoutBrowser(session.session_token)
  }

  const initializeFlow = useCallback(async () => {
    if (isLoggedIn) {
      const session = await getSessionFromStorage()
      if (session) {
        setSessionToken(session.session_token)
        initSettingsFlow(session)
          .then(({ data: flow }) => setCustomFlow(flow))
          .catch((error: Error) => {
            console.warn('## Error ##', error)
            openToast(error.message, HoliToastType.ERROR)
          })
      }
    }
  }, [setCustomFlow, isLoggedIn, openToast])

  useEffect(() => {
    initializeFlow()
  }, [initializeFlow])

  const performPasswordChange = (flowBody: SubmitSelfServiceSettingsFlowBody): Promise<void> => {
    if (flow)
      return newKratosSdk()
        .submitSelfServiceSettingsFlow(flow.id, sessionToken, flowBody, { withCredentials: Platform.OS === 'web' })
        .then(() => {
          openToast('Du hast dein Passwort erfolgreich geändert.', HoliToastType.SUCCESS)
          // TODO: reset form and redirect to profile page
        })
        .catch(handleFormSubmitError(setCustomFlow, initializeFlow))
        .catch((error) => {
          // https://www.ory.sh/docs/kratos/reference/api#tag/frontend/operation/updateSettingsFlow
          if (error.response.data.error.id === 'session_refresh_required') {
            openLoginDialog({
              title: 'Login veraltet',
              description:
                'Ihr letzter Login ist veraltet. Bitte melden sich sich ab und wieder an, um das Passwort ändern zu können',
              confirmText: 'zum Logout',
              onConfirm: () => {
                navigate('/profile/settings')
                // TODO: Better perform automatic logout and redirect to login
              },
            })
            initializeFlow()
          } else {
            console.log('## Error ##', error)
          }
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
