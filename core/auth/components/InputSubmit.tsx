// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/InputSubmit.tsx
import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import React from 'react'
import { View } from 'react-native'

import { getNodeId, getNodeTitle } from '@holi/core/auth/helpers/form'
import Button from '@holi/ui/components/Button'

interface Props extends InputSubmitProps {
  node: UiNode
  attributes: UiNodeInputAttributes
}

export interface InputSubmitProps {
  onSubmitPress: (key: string, value: any) => void
  onChange: (value: any) => void
}

export const NodeInputSubmit = ({ node, attributes, onSubmitPress }: Props) => {
  if (attributes.type !== 'submit') {
    return null
  }

  const name = getNodeId(node)
  const title = getNodeTitle(node)

  return (
    <View testID={`field/${name}/${attributes.value}`}>
      <Button onPress={() => onSubmitPress(attributes.name, attributes.value)}>{title}</Button>
    </View>
  )
}
