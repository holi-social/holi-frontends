import type { RecoveryFlow } from '@ory/kratos-client'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { holiNextJSApiUrl } from '@holi/api/config'
import RecoverPasswordCode from '@holi/core/auth/components/RecoverPasswordCode'
import RecoverPasswordForm from '@holi/core/auth/components/RecoverPasswordForm'
import HoliWebView from '@holi/core/components/HoliWebView'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import { useTheme } from '@holi/ui/styles/theme'
import { Screen } from '@holi/core/components/Screen'

export interface ForgotPasswordProps {
  webview?: boolean
}

const ForgotPassword = ({ webview = false }: ForgotPasswordProps) => {
  const { t } = useTranslation()
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [flow, setFlow] = useState<RecoveryFlow>()
  const { theme } = useTheme()

  const onSubmit = (success: boolean, flow?: RecoveryFlow, email?: string) => {
    setSuccess(success)
    if (flow) setFlow(flow)
    if (email) setEmail(email)
  }

  return (
    <Screen
      backgroundColor="support"
      contentContainerStyle={{ flex: 1 }}
      headerOptions={
        !webview
          ? {
              headerBackVisible: false,
              headerTitleAlign: 'center',
              headerShown: true,
              animation: 'slide_from_bottom',
              title: t('auth.forgotPassword'),
              headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowDownS} />),
              headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon={Close} /> : null),
            }
          : {
              headerLeft: () => null,
              headerRight: () => null,
              navigationCustomOptions: {
                footerShown: false,
              },
            }
      }
    >
      {Platform.OS === 'web' ? (
        success ? (
          <RecoverPasswordCode email={email} flow={flow} webview={webview} />
        ) : (
          <RecoverPasswordForm onSubmit={onSubmit} webview={webview} />
        )
      ) : (
        <HoliWebView
          style={{ flex: 1 }}
          webViewProps={{
            setSupportMultipleWindows: false,
            source: { uri: holiNextJSApiUrl + '/forgotPasswordWebView' },
            incognito: true,
          }}
          theme={theme}
        />
      )}
    </Screen>
  )
}

export default memo(ForgotPassword)
