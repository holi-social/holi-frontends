import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import React from 'react'
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native'
import { getNodeId, getNodeTitle, isUiNodeInputAttributes } from 'shared/features/authentication/helpers/form'

interface Props extends InputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
}

export interface InputProps {
  onChange: (value: any) => void
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
    return 'username'
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
    <View testID={`field/${name}`}>
      <Text>{title}</Text>
      <TextInput
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
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})

// state={typeToState({ type, disabled }
