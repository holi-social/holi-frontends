import { LoginFlow, SettingsFlow, UiNodeInputAttributes } from '@ory/kratos-client'

import { oryNodeIsInput } from '@holi/core/auth/helpers/form'

export const extractValue = (flow: LoginFlow | SettingsFlow, key: string): string => {
  return flow.ui.nodes
    .filter((node) => oryNodeIsInput(node.attributes))
    .map((node) => node.attributes as UiNodeInputAttributes)
    .filter((attributes) => attributes.name === key)[0].value
}
