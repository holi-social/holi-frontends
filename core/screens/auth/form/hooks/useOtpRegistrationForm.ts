import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RegistrationFlow, UpdateRegistrationFlowWithCodeMethod } from '@ory/kratos-client'
import { getInputNodeState } from '@holi/core/screens/auth/form/helpers/getInputNodeState'
import type { EmailOtpFormProps } from '@holi/core/screens/auth/form/components/EmailOtpForm'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import type { CodeOtpFormProps } from '@holi/core/screens/auth/form/components/CodeOtpForm'

interface UseOtpRegistrationFormProps {
  flow?: RegistrationFlow
  performRegistration: (payload: UpdateRegistrationFlowWithCodeMethod) => Promise<void>
  resetFlow: () => void
}

export const useOtpRegistrationForm = ({
  flow,
  performRegistration,
  resetFlow,
}: UseOtpRegistrationFormProps): EmailOtpFormProps & CodeOtpFormProps => {
  const { i18n, t } = useTranslation()
  const { track } = useTracking()

  const emailNode = getInputNodeState(flow, i18n, 'traits.email')
  const codeNode = getInputNodeState(flow, i18n, 'code')
  const csrfTokenNode = getInputNodeState(flow, i18n, 'csrf_token')

  const [email, setEmail] = useState<string | undefined>(emailNode.value)
  const [code, setCode] = useState<string | undefined>(codeNode.value)

  const onSubmit = useCallback(
    async (resend = false) => {
      if (!flow) return
      const payload: UpdateRegistrationFlowWithCodeMethod = {
        method: 'code',
        traits: {
          email: email ?? '',
        },
        csrf_token: csrfTokenNode.value ?? '',
        ...(resend ? { resend: 'code' } : {}),
      }
      track(
        TrackingEvent.Auth.OneTimeCodePressed({
          step: resend ? 'resend' : code ? 'code' : 'email',
          screen: 'mainRegistration',
        })
      )
      await performRegistration(payload)
    },
    [email, code, csrfTokenNode.value, performRegistration]
  )

  return {
    email,
    setEmail,
    emailValidationError: emailNode.validationError,
    onChangeEmail: resetFlow,
    autoFocusEmail: true,
    code,
    setCode,
    codeValidationError: codeNode.validationError,
    onSubmit,
    submitLabel: t('tasks.register.unlogged.verify.email'), // TODO(SF) create extra key auth.login.input.label-SignUpCode
    submitDisabled: !flow,
    onResend: () => onSubmit(true),
  }
}
