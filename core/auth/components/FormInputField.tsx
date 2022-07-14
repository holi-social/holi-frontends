// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Input.tsx
import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextInputProps, ViewStyle } from 'react-native'

import { getNodeId, getNodeTitle, oryNodeIsInput } from '@holi/core/auth/helpers/form'
import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/HoliTextInput'

interface Props extends InputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

export interface InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  disabled?: boolean
  textInputOverride?: TextInputOverride
}

export type TextInputOverride = (field: UiNode, props: TextInputProps) => TextInputProps

const guessVariant = ({ attributes }: UiNode) => {
  if (!oryNodeIsInput(attributes)) {
    return 'text'
  }

  if (attributes.name === 'identifier') {
    return 'email'
  }

  switch (attributes.type) {
    case 'hidden':
      return null
    case 'email':
      return 'email'
    case 'submit':
      return 'button'
    case 'password':
      return 'password'
    default:
      return 'text'
  }
}

const FormInputField = ({ node, value, onChange, disabled, textInputOverride, style }: Props) => {
  const { t } = useTranslation()

  const variant = guessVariant(node)
  if (!variant) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extraProps: any = {}
  switch (variant) {
    case 'email':
      extraProps.autoCompleteType = 'email'
      extraProps.keyboardType = 'email-address'
      extraProps.textContentType = 'emailAddress'
      extraProps.autoCapitalize = 'none'
      extraProps.autoCorrect = false
      break
    case 'password':
      extraProps.autoCompleteType = 'password'
      extraProps.textContentType = 'password'
      extraProps.autoCapitalize = 'none'
      extraProps.secureTextEntry = true
      extraProps.autoCorrect = false
      break
  }

  if (textInputOverride) {
    extraProps = textInputOverride(node, extraProps)
  }

  let inputType: HoliTextInputProps['type'] = 'text'
  switch (variant) {
    case 'email':
      inputType = 'email'
      break
    case 'password':
      inputType = 'password'
      break
  }

  const fieldName = getNodeId(node)
  const fieldLabel = getNodeTitle(node)

  return (
    <HoliTextInput
      label={t(`auth.login.input.label-${fieldLabel}`)}
      placeholder={t(`auth.login.input.placeholder-${fieldLabel}`)}
      value={value ? String(value) : ''}
      validationErrorText={node.messages && node.messages[0] ? node.messages[0].text : ''}
      disabled={disabled}
      noOfLines={1}
      maxNoOfLines={1}
      maxNoOfCharacters={30}
      onChange={onChange}
      type={inputType}
      style={style}
      // /** TextInputProps to extend input e.g ('returnKeytype')*/
      // inputProps?: TextInputProps
      testID={`oryField-${fieldName}`}
      {...extraProps}
    />
  )
}

export default FormInputField
