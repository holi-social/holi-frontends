// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import { UiNode } from '@ory/kratos-client'
import React from 'react'

import { InputProps, NodeInput } from '@holi/core/auth/components/FormInputField'
import {
  getNodeId,
  getNodeTitle,
  getNodeValue,
  oryNodeIsInput,
  oryNodeIsSubmit,
  oryNodeIsText,
} from '@holi/core/auth/helpers/form'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'

interface Props extends InputProps {
  node: UiNode
  onSubmitPress: (key: string, value: any) => void
}

export const FormNode = (props: Props) => {
  const { node } = props

  if (oryNodeIsText(node.attributes)) {
    const metaText = props.node.meta.label?.text ? `${props.node.meta.label?.text} ` : ''
    const text = `${metaText} ${node.attributes.text.text}`
    return <HoliText>{text}</HoliText>
  }

  if (oryNodeIsInput(node.attributes)) {
    return <NodeInput {...props} attributes={node.attributes} />
  }

  if (oryNodeIsSubmit(node.attributes)) {
    const name = getNodeId(node)
    const title = getNodeTitle(node)
    const value = getNodeValue(node)
    return (
      <HoliButton
        label=""
        onPress={() => props.onSubmitPress(name, value)}
        testID={`oryField-${name}/${node.attributes.value}`}
      >
        {title}
      </HoliButton>
    )
  }

  return <>Unknown Element: {node.type}</>
}
