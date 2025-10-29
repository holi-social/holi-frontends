import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { RegistrationFlow, UpdateRegistrationFlowWithOidcMethod } from '@ory/kratos-client'
import { getInputNodeState } from '@holi/core/screens/auth/form/helpers/getInputNodeState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import type { SocialLoginFormProps } from '@holi/core/screens/auth/form/components/SocialLoginForm'
import type { SocialLoginButtonProvider } from 'holi-bricks/components/button/SocialLoginButton'
import { getSocialLoginProviderId } from '@holi/core/screens/auth/form/helpers/getSocialLoginProviderId'

interface UseSocialRegistrationFormProps {
  flow?: RegistrationFlow
  performRegistration: (payload: UpdateRegistrationFlowWithOidcMethod) => Promise<void>
}

export const useSocialRegistrationForm = ({
  flow,
  performRegistration,
}: UseSocialRegistrationFormProps): SocialLoginFormProps => {
  const { i18n } = useTranslation()
  const { track } = useTracking()

  const appleProviderId = getSocialLoginProviderId(flow, 'Apple')
  const googleProviderId = getSocialLoginProviderId(flow, 'Google')
  const csrfTokenNode = getInputNodeState(flow, i18n, 'csrf_token')

  const onSubmit = useCallback(
    async (provider: SocialLoginButtonProvider) => {
      if (!flow) return
      const payload: UpdateRegistrationFlowWithOidcMethod = {
        method: 'oidc',
        csrf_token: csrfTokenNode.value ?? '',
        provider: (provider === 'Apple' ? appleProviderId : googleProviderId) ?? '',
        upstream_parameters: provider === 'Google' ? { prompt: 'select_account' } : undefined,
      }
      track(
        TrackingEvent.Auth.SocialLoginButtonPressed({
          provider,
          screen: 'mainRegistration',
        })
      )
      await performRegistration(payload)
    },
    [appleProviderId, googleProviderId, csrfTokenNode.value, performRegistration]
  )

  return {
    onSubmit,
  }
}
