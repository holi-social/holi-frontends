import type { UiNode, UpdateLoginFlowBody } from '@ory/kratos-client'
import React from 'react'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { SocialLoginButton, type SocialLoginButtonProvider } from 'holi-bricks/components/button/SocialLoginButton'
import { getNodeId, getNodeTranslationKey, oryNodeIsSubmit } from '@holi/core/auth/helpers/form'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getNodeProviderId, getNodeProviderName } from '@holi/core/auth/helpers/auth'

interface FormNodeSocialLoginProps {
  node: UiNode
  translationPrefix: string
  style?: StyleProp<ViewStyle>
  onSubmitPress: (overrides?: UpdateLoginFlowBody) => void
}

const supportedSocialLoginProviders: SocialLoginButtonProvider[] = ['Google']

export const FormNodeSocialLogin = ({ node, translationPrefix, style, onSubmitPress }: FormNodeSocialLoginProps) => {
  const { t } = useTranslation()
  const showSocialLogin = useFeatureFlagToggle(FeatureFlagKey.SOCIAL_LOGIN)
  const translationKey = `${translationPrefix}input.label-${getNodeTranslationKey(node)}`
  const fieldName = getNodeId(node)
  const providerId = getNodeProviderId(node)
  const provider = getNodeProviderName(node) as SocialLoginButtonProvider
  const disabled = oryNodeIsSubmit(node.attributes) && node.attributes.disabled

  if (!showSocialLogin || !providerId) {
    return null
  }

  if (!provider || !supportedSocialLoginProviders.includes(provider)) {
    return null
  }

  const overrides: UpdateLoginFlowBody = {
    method: 'oidc',
    provider: providerId,
    upstream_parameters: provider === 'Google' ? { prompt: 'select_account' } : undefined,
  }
  return (
    <View style={style}>
      <SocialLoginButton
        provider={provider}
        label={t(translationKey, { provider })}
        disabled={disabled}
        onPress={() => onSubmitPress(overrides)}
        testID={`ory-submit-${fieldName}`}
      />
    </View>
  )
}
