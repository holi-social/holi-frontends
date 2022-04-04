import React from 'react'
import { UiNode, UiNodeImageAttributes } from '@ory/kratos-client'
import { getNodeId } from 'shared/features/authentication/helpers/form'
import { View } from 'react-native'

interface Props {
  node: UiNode
  attributes: UiNodeImageAttributes
}
export const NodeImage = (props: Props) => {
  const name = getNodeId(props.node)
  return <View testID={`field/${name}`}></View>
}
