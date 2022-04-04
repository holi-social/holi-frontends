import React from 'react'
import { View, Text } from 'react-native'
import { UiNode, UiNodeTextAttributes } from '@ory/kratos-client'

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
