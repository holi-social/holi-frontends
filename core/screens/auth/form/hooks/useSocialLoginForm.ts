import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { LoginFlow, UpdateLoginFlowBody, UpdateLoginFlowWithOidcMethod } from '@ory/kratos-client'
import { getInputNodeState } from '@holi/core/screens/auth/form/helpers/getInputNodeState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import type { SocialLoginFormProps } from '@holi/core/screens/auth/form/components/SocialLoginForm'
import type { SocialLoginButtonProvider } from 'holi-bricks/components/button/SocialLoginButton'
import { getSocialLoginProviderId } from '@holi/core/screens/auth/form/helpers/getSocialLoginProviderId'

interface UseSocialLoginFormProps {
  flow?: LoginFlow
  performLogin: (payload: UpdateLoginFlowBody) => Promise<void>
}

export const useSocialLoginForm = ({ flow, performLogin }: UseSocialLoginFormProps): SocialLoginFormProps => {
  const { i18n } = useTranslation()
  const { track } = useTracking()

  const appleProviderId = getSocialLoginProviderId(flow, 'Apple')
  const googleProviderId = getSocialLoginProviderId(flow, 'Google')
  const csrfTokenNode = getInputNodeState(flow, i18n, 'csrf_token')

  const onSubmit = useCallback(
    async (provider: SocialLoginButtonProvider) => {
      if (!flow) return
      const payload: UpdateLoginFlowWithOidcMethod = {
        method: 'oidc',
        csrf_token: csrfTokenNode.value ?? '',
        provider: (provider === 'Apple' ? appleProviderId : googleProviderId) ?? '',
        upstream_parameters: provider === 'Google' ? { prompt: 'select_account' } : undefined,
      }
      track(
        TrackingEvent.Auth.SocialLoginButtonPressed({
          provider,
          screen: 'mainLogin',
        })
      )
      await performLogin(payload as UpdateLoginFlowBody)
    },
    [appleProviderId, googleProviderId, csrfTokenNode.value, performLogin, flow, track]
  )

  return {
    onSubmit,
  }
}
