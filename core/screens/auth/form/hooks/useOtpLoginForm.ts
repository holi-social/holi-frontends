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
  performLogin: (payload: UpdateLoginFlowBody) => Promise<void>
  resetFlow: () => void
}

export const useOtpLoginForm = ({
  flow,
  performLogin,
  resetFlow,
}: UseOtpLoginFormProps): EmailOtpFormProps & CodeOtpFormProps => {
  const { i18n, t } = useTranslation()
  const { track } = useTracking()

  const emailNode = getInputNodeState(flow, i18n, 'identifier')
  const codeNode = getInputNodeState(flow, i18n, 'code')
  const csrfTokenNode = getInputNodeState(flow, i18n, 'csrf_token')

  const [email, setEmail] = useState<string | undefined>(emailNode.value)
  const [code, setCode] = useState<string | undefined>(codeNode.value)

  const onSubmit = useCallback(
    async (resend = false) => {
      if (!flow) return
      const payload: UpdateLoginFlowWithCodeMethod = {
        method: 'code',
        identifier: email ?? '',
        csrf_token: csrfTokenNode.value ?? '',
        code,
        ...(resend ? { resend: 'code' } : {}),
      }
      track(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: resend ? 'resend' : code ? 'code' : 'email',
          screen: 'mainLogin',
        })
      )
      await performLogin(payload as UpdateLoginFlowBody)
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
    submitLabel: t('tasks.register.unlogged.verify.email'), // TODO(SF) create extra key auth.login.input.label-SignInCode
    submitDisabled: !flow,
    onResend: () => onSubmit(true),
  }
}
