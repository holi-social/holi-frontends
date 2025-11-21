import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LoginFlow, UpdateLoginFlowBody, UpdateLoginFlowWithCodeMethod } from '@ory/kratos-client'
import { getInputNodeState } from '@holi/core/screens/auth/form/helpers/getInputNodeState'
import type { EmailOtpFormProps } from '@holi/core/screens/auth/form/components/EmailOtpForm'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import type { CodeOtpFormProps } from '@holi/core/screens/auth/form/components/CodeOtpForm'

interface UseOtpLoginFormProps {
  flow?: LoginFlow
  performLogin: (payload: UpdateLoginFlowBody, method: TrackingEvent.AuthMethod) => Promise<void>
  resetFlow: () => void
}

export const useOtpLoginForm = ({
  flow,
  performLogin,
  resetFlow,
}: UseOtpLoginFormProps): EmailOtpFormProps & CodeOtpFormProps => {
  const { i18n, t } = useTranslation()
  const { track } = useTracking()
  const trackingScreen = 'mainLogin'

  const emailNode = getInputNodeState(flow, i18n, 'identifier')
  const codeNode = getInputNodeState(flow, i18n, 'code')
  const csrfTokenNode = getInputNodeState(flow, i18n, 'csrf_token')

  const [email, setEmail] = useState<string | undefined>(emailNode.value)
  const [code, setCode] = useState<string | undefined>(codeNode.value)

  const onSubmit = useCallback(
    async (step: 'code' | 'email' | 'resend') => {
      if (!flow) return
      const stepPayload = step === 'resend' ? { resend: 'code' } : { code }
      const payload: UpdateLoginFlowWithCodeMethod = {
        method: 'code',
        identifier: email ?? '',
        csrf_token: csrfTokenNode.value ?? '',
        ...stepPayload,
      }
      if (step === 'email') {
        track(
          TrackingEvent.Auth.LoginOptionSelected({
            method: 'otp',
            screen: trackingScreen,
          })
        )
      }
      track(
        TrackingEvent.Auth.OneTimeCodePressed({
          step,
          screen: trackingScreen,
        })
      )
      await performLogin(payload as UpdateLoginFlowBody, 'otp')
    },
    [email, code, csrfTokenNode.value, performLogin, flow, track]
  )

  return {
    email,
    setEmail,
    emailValidationError: emailNode.validationError,
    onChangeEmail: resetFlow,
    code,
    setCode,
    codeValidationError: codeNode.validationError,
    autoFocusEmail: true,
    onSubmit,
    submitLabel: t('auth.login.cta.OTPlogin'),
    submitDisabled: !flow,
    trackingScreen,
  }
}
