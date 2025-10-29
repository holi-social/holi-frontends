import { getValidationErrorText } from '@holi/core/auth/components/FormInputField'
import type { LoginFlow, RegistrationFlow } from '@ory/kratos-client'
import type { UseTranslationResponse } from 'react-i18next'

interface InputNodeState {
  value?: string
  validationError?: string
}

export const getInputNodeState = (
  flow: LoginFlow | RegistrationFlow | undefined,
  i18n: UseTranslationResponse<'translation', undefined>['i18n'],
  nodeName: string
): InputNodeState => {
  const node = flow?.ui.nodes.find(
    (node) => node.type === 'input' && 'name' in node.attributes && node.attributes.name === nodeName
  )
  if (!node) {
    return {}
  }

  return {
    value: 'value' in node.attributes ? node.attributes.value : undefined,
    validationError: getValidationErrorText(node, i18n),
  }
}
