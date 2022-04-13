import React from 'react'
import { View } from 'react-native'
import { UiNode, UiNodeImageAttributes } from '@ory/kratos-client'
import { getNodeId } from '@holi/core/auth/helpers/form'

interface Props {
  node: UiNode
  attributes: UiNodeImageAttributes
}
export const NodeImage = (props: Props) => {
  const name = getNodeId(props.node)
  return <View testID={`field/${name}`}></View>
}
