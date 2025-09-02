// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Input.tsx
import type { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { UseTranslationResponse } from 'react-i18next'
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { getNodeId, getNodeTranslationKey, oryNodeIsInput } from '@holi/core/auth/helpers/form'
import type { AccessibilityRoleWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliTextInput, { type HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

export interface InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEnterPress?: (value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  disabled?: boolean
  textInputOverride?: TextInputOverride
  role?: AccessibilityRoleWeb
}

interface Props extends InputProps, Omit<Partial<TextInputProps>, 'onChange' | 'value' | 'role'> {
  node: UiNode
  attributes: UiNodeInputAttributes
  autofocus: boolean
  translationPrefix: string
  isSignin?: boolean
  style?: StyleProp<TextStyle>
}

// https://github.com/ory/docs/blob/master/docs/kratos/concepts/messages.json
enum OryErrorCode {
  EMAIL_OR_PASSWORD_WRONG = 4000001,
  EMAIL_OR_PASSWORD_MISSING = 4000002,
  INVALID_PASSWORD = 4000005,
}
const ORY_SIGNIN_NODE_ID = 1070001

export type TextInputOverride = (field: UiNode, props: TextInputProps) => TextInputProps

export const getValidationErrorText = (
  { messages, attributes }: UiNode,
  i18n: UseTranslationResponse<'translation', undefined>['i18n']
) => {
  if (!messages || !messages.length) {
    return ''
  }
  const { id, context, text } = messages[0]
  const messageKey = `auth.login.input.message.${id}`

  // if email or password are missing
  if (
    'type' in attributes &&
    (id === OryErrorCode.EMAIL_OR_PASSWORD_MISSING || id === OryErrorCode.EMAIL_OR_PASSWORD_WRONG)
  ) {
    const { name } = attributes as { name: string }
    // `identifier` or `traits.email` is used for email field
    const emailNames = ['identifier', 'traits.email', 'email']
    const passwordNames = ['password']
    const possibleNames = [emailNames, passwordNames]
    const modifier = possibleNames.findIndex((namesArr) => namesArr.includes(name))
    const messageKeyModifier = `${messageKey}-${modifier}`

    return i18n.t(messageKeyModifier, text)
  }

  // if password is not valid
  if (context && id === OryErrorCode.INVALID_PASSWORD) {
    const { reason } = context as { reason: string }

    const possibleReasons = ['password length', 'password has been found in data breaches', 'password is too similar']
    const modifier = possibleReasons.findIndex((str) => reason.includes(str))
    const messageKeyModifier = `${messageKey}-${modifier}`

    return i18n.t(messageKeyModifier, text)
  }

  return i18n.t(messageKey, text)
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

const FormInputField = React.forwardRef<View, Props>(
  (
    {
      node,
      value,
      onChange = () => null,
      onEnterPress = () => null,
      disabled,
      textInputOverride,
      autofocus,
      translationPrefix,
      isSignin,
      style,
      role,
      ...restProps
    },
    ref
  ) => {
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
    const fieldLabel = getNodeTranslationKey(node)
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

    let customTranslationKey: string | undefined
    if (fieldLabel === 'InputSignInCode' || fieldLabel === 'InputSignUpCode') {
      customTranslationKey = 'registration.emailVerification.inputPlaceholder'
    }

    return (
      <HoliTextInput
        aria-label={t(`${translationPrefix}input.label-${fieldLabel}`)}
        placeholder={t(customTranslationKey ||`${translationPrefix}input.placeholder-${fieldLabel}`)}
        value={value ? String(value) : ''}
        validationErrorText={getValidationErrorText(node, i18n)}
        disabled={disabled}
        noOfVisibleLines={1}
        maxNoOfVisibleLines={1}
        maxNoOfCharacters={200}
        onChange={onChange}
        type={inputType}
        {...(!customTranslationKey ? { inputLabel: t(`${translationPrefix}input.label-${fieldLabel}`) } : {})}
        inputProps={{
          ...(textInputOverride ? textInputOverride(node, inputProps) : inputProps),
          ...(node.group === 'password' && isSignin && node.meta.label?.id === ORY_SIGNIN_NODE_ID
            ? // force textContentType for password when it's Ory's signin flow with password
              { textContentType: 'password' }
            : {}),
        }}
        style={style as StyleProp<ViewStyle>}
        testID={`ory-${fieldName.replace(/\./gi, '-')}`}
        role={role}
        {...restProps}
        ref={ref}
      />
    )
  }
)

FormInputField.displayName = 'FormInputField'

export default FormInputField
