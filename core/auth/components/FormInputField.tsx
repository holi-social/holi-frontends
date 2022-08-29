// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Input.tsx
import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { UseTranslationResponse } from 'react-i18next'
import { NativeSyntheticEvent, TextInputKeyPressEventData, TextInputProps, ViewStyle } from 'react-native'

import { getNodeId, getNodeTitle, oryNodeIsInput } from '@holi/core/auth/helpers/form'
import HoliTextInput, { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

interface Props extends InputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
  autofocus: boolean
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

enum OryErrorCode {
  EMAIL_OR_PASSWORD_MISSING = 4000002,
  INVALID_PASSWORD = 4000005,
}

export interface InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEnterPress?: (value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  disabled?: boolean
  textInputOverride?: TextInputOverride
}

export type TextInputOverride = (field: UiNode, props: TextInputProps) => TextInputProps

const getValidationErrorText = (
  { messages, attributes }: UiNode,
  i18n: UseTranslationResponse<'translation', undefined>['i18n']
) => {
  if (!messages || !messages.length) {
    return ''
  }
  const { id, context, text } = messages[0]
  const messageKey = `auth.login.input.message.${id}`

  // if email or password are missing
  if ('type' in attributes && id === OryErrorCode.EMAIL_OR_PASSWORD_MISSING) {
    const { type } = attributes
    const possibleTypes = ['email', 'password']
    const modifier = possibleTypes.findIndex((value) => value === type)
    const messageKeyModifier = `${messageKey}-${modifier}`

    return i18n.exists(messageKeyModifier) ? i18n.t(messageKeyModifier) : text
  }

  // if password is not valid
  if (context && id === OryErrorCode.INVALID_PASSWORD) {
    const { reason } = context as { reason: string }

    const possibleReasons = ['password length', 'password has been found in data breaches']
    const modifier = possibleReasons.findIndex((str) => reason.includes(str))
    const messageKeyModifier = `${messageKey}-${modifier}`

    return i18n.exists(messageKeyModifier) ? i18n.t(messageKeyModifier) : text
  }

  return i18n.exists(messageKey) ? i18n.t(messageKey) : text
}

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

const FormInputField = ({
  node,
  value,
  onChange = () => null,
  onEnterPress = () => null,
  disabled,
  textInputOverride,
  autofocus,
  style,
}: Props) => {
  const { t, i18n } = useTranslation()

  const variant = guessVariant(node)
  if (!variant) {
    return null
  }

  const inputType = ((): HoliTextInputProps['type'] => {
    switch (variant) {
      case 'email':
        return 'email'
      case 'password':
        return 'password'
      default:
        return 'text'
    }
  })()

  const fieldName = getNodeId(node)
  const fieldLabel = getNodeTitle(node)
  const handleKeyDown = (event: NativeSyntheticEvent<TextInputKeyPressEventData | TextInputProps>) => {
    const nativeElement = event.nativeEvent as TextInputKeyPressEventData
    if (nativeElement.key === 'Enter') {
      const element = event.target as TextInputProps
      onChange(element.value)
      onEnterPress(element.value)
    }
  }
  const inputProps: TextInputProps = {
    onKeyPress: handleKeyDown,
    autoFocus: autofocus,
  }

  return (
    <HoliTextInput
      label={t(`auth.login.input.label-${fieldLabel}`)}
      placeholder={t(`auth.login.input.placeholder-${fieldLabel}`)}
      value={value ? String(value) : ''}
      validationErrorText={getValidationErrorText(node, i18n)}
      disabled={disabled}
      noOfVisibleLines={1}
      maxNoOfVisibleLines={1}
      maxNoOfCharacters={200}
      onChange={onChange}
      type={inputType}
      inputProps={textInputOverride ? textInputOverride(node, inputProps) : inputProps}
      style={style}
      testID={`ory-input-${fieldName.replace(/\./gi, '-')}`}
    />
  )
}

export default FormInputField
