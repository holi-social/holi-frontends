import { LoginFlow, SettingsFlow, UiNodeInputAttributes } from '@ory/kratos-client'

export const extractValue = (flow: LoginFlow | SettingsFlow, key: string): string => {
  return flow.ui.nodes
    .filter((node) => node.attributes.node_type === 'input')
    .map((node) => node.attributes as UiNodeInputAttributes)
    .filter((attribute) => attribute.name === key)[0].value
}
