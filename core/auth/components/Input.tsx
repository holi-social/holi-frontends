// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Input.tsx
import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import React from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'

import { getNodeId, getNodeTitle, isUiNodeInputAttributes } from '@holi/core/auth/helpers/form'

interface Props extends InputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
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
  if (!isUiNodeInputAttributes(attributes)) {
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

export const NodeInput = ({ node, value, onChange, disabled, textInputOverride }: Props) => {
  const variant = guessVariant(node)
  if (!variant) {
    return null
  }

  let extraProps: TextInputProps = {}
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

  const name = getNodeId(node)
  const title = getNodeTitle(node)

  return (
    <View>
      <Text>{title}</Text>
      <TextInput
        testID={`field/${name}`}
        style={styles.input}
        onChange={onChange}
        value={value ? String(value) : ''}
        editable={!disabled}
        onChangeText={onChange}
        {...extraProps}
      />
      <>
        {node.messages?.map(({ text, id }, k) => (
          <Text key={`${id}${k}`}>{text}</Text>
        ))}
      </>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    margin: 1,
    borderWidth: 1,
  },
})
