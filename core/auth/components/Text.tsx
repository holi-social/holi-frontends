// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Text.tsx
import { UiNode, UiNodeTextAttributes } from '@ory/kratos-client'
import React from 'react'
import { Text, View } from 'react-native'

interface Props {
  node: UiNode
  attributes: UiNodeTextAttributes
}

export const NodeText = (props: Props) => {
  return (
    <View>
      {props.node.meta.label?.text && <Text>{props.node.meta.label?.text}</Text>}
      <Text>{props.attributes.text.text}</Text>
    </View>
  )
}
