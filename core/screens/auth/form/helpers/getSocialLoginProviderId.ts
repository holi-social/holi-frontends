import { getNodeProviderId, getNodeProviderName } from '@holi/core/auth/helpers/auth/common'
import type { LoginFlow, RegistrationFlow } from '@ory/kratos-client'
import type { SocialLoginButtonProvider } from 'holi-bricks/components/button/SocialLoginButton'

export const getSocialLoginProviderId = (
  flow: LoginFlow | RegistrationFlow | undefined,
  provider: SocialLoginButtonProvider
) => {
  const node = flow?.ui.nodes.find(
    (node) =>
      node.type === 'input' &&
      'name' in node.attributes &&
      node.attributes.name === 'provider' &&
      getNodeProviderName(node) === provider
  )
  if (!node) {
    return undefined
  }
  return getNodeProviderId(node)
}
