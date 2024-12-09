import type { RecoveryFlow } from '@ory/kratos-client'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { holiNextJSApiUrl } from '@holi/api/config'
import RecoverPasswordCode from '@holi/core/auth/components/RecoverPasswordCode'
import RecoverPasswordForm from '@holi/core/auth/components/RecoverPasswordForm'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import HoliWebView from '@holi/core/components/HoliWebView'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useTheme } from '@holi/ui/styles/theme'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export interface ForgotPasswordProps {
  webview?: boolean
}

const ForgotPassword = ({ webview = false }: ForgotPasswordProps) => {
  const { t } = useTranslation()
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [flow, setFlow] = useState<RecoveryFlow>()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()

  useIsomorphicLayoutEffect(() => {
    if (!webview)
      setScreenOptions({
        headerTitle: () => (
          <HoliHeading level="1" size="s">
            {t('auth.forgotPassword')}
          </HoliHeading>
        ),
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowDownS} />),
        headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon={Close} /> : null),
      })
    else
      setScreenOptions({
        headerLeft: () => null,
        headerRight: () => null,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [setScreenOptions, t, webview])

  const onSubmit = (success: boolean, flow?: RecoveryFlow, email?: string) => {
    setSuccess(success)
    if (flow) setFlow(flow)
    if (email) setEmail(email)
  }

  return (
    <HoliContainer>
      {Platform.OS === 'web' ? (
        <DefaultLayout keyboardShouldPersistTaps="handled" headerOverlap={true}>
          {success ? (
            <RecoverPasswordCode email={email} flow={flow} webview={webview} />
          ) : (
            <RecoverPasswordForm onSubmit={onSubmit} webview={webview} />
          )}
        </DefaultLayout>
      ) : (
        <HoliWebView
          webViewProps={{
            setSupportMultipleWindows: false,
            source: { uri: holiNextJSApiUrl + '/forgotPasswordWebView' },
            incognito: true,
          }}
          theme={theme}
        />
      )}
    </HoliContainer>
  )
}

export default memo(ForgotPassword)
