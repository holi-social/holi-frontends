// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Input.tsx
import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, TextInputProps, ViewStyle } from 'react-native'

import { getNodeId, getNodeTitle, oryNodeIsInput } from '@holi/core/auth/helpers/form'
import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/HoliTextInput'

interface Props extends InputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
  autofocus: boolean
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
    case 'password':
      return 'password'
    default:
      return 'text'
  }
}

const FormInputField = ({ node, value, onChange, disabled, textInputOverride, autofocus, style }: Props) => {
  const { t } = useTranslation()

  const variant = guessVariant(node)
  if (!variant) {
    return null
  }

  const getInputProps = (): TextInputProps => {
    switch (variant) {
      case 'email':
        return {
          autoComplete: 'email',
          textContentType: Platform.OS === 'ios' ? 'username' : 'emailAddress',
          autoCapitalize: 'none',
          autoCorrect: false,
        }
      case 'password':
        return {
          autoComplete: 'password',
          textContentType: 'password',
          autoCapitalize: 'none',
          autoCorrect: false,
        }
      default:
        return {}
    }
  }
  const inputProps = getInputProps()
  inputProps.autoFocus = autofocus

  const getInputType = (): HoliTextInputProps['type'] => {
    switch (variant) {
      case 'email':
        return 'email'
      case 'password':
        return 'password'
      default:
        return 'text'
    }
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
      maxNoOfCharacters={200}
      onChange={onChange}
      type={getInputType()}
      inputProps={textInputOverride ? textInputOverride(node, inputProps) : inputProps}
      style={style}
      testID={`oryField-${fieldName}`}
    />
  )
}

export default FormInputField
