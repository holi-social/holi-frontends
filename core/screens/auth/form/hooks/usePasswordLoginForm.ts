import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LoginFlow, UpdateLoginFlowBody, UpdateLoginFlowWithPasswordMethod } from '@ory/kratos-client'
import { getInputNodeState } from '@holi/core/screens/auth/form/helpers/getInputNodeState'
import type { EmailPasswordFormProps } from '@holi/core/screens/auth/form/components/EmailPasswordForm'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

interface UsePasswordLoginFormProps {
  flow?: LoginFlow
  performLogin: (payload: UpdateLoginFlowBody) => Promise<void>
}

export const usePasswordLoginForm = ({ flow, performLogin }: UsePasswordLoginFormProps): EmailPasswordFormProps => {
  const { i18n, t } = useTranslation()
  const { track } = useTracking()

  const emailNode = getInputNodeState(flow, i18n, 'identifier')
  const passwordNode = getInputNodeState(flow, i18n, 'password')
  const csrfTokenNode = getInputNodeState(flow, i18n, 'csrf_token')

  const [email, setEmail] = useState<string | undefined>(emailNode.value)
  const [password, setPassword] = useState<string | undefined>(passwordNode.value)

  const onSubmit = useCallback(async () => {
    if (!flow) return
    const payload: UpdateLoginFlowWithPasswordMethod = {
      method: 'password',
      identifier: email ?? '',
      password: password ?? '',
      csrf_token: csrfTokenNode.value ?? '',
    }
    track(TrackingEvent.Auth.LoginButtonPressed)
    await performLogin(payload as UpdateLoginFlowBody)
  }, [email, password, csrfTokenNode.value, performLogin, flow, track])

  return {
    email,
    setEmail,
    emailValidationError: emailNode.validationError,
    autoFocusEmail: true,
    password,
    setPassword,
    passwordValidationError: passwordNode.validationError,
    onSubmit,
    submitLabel: t('auth.login.input.label-SignIn'),
    submitDisabled: !flow,
  }
}
