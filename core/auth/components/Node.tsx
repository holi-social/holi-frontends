// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import { UiNode } from '@ory/kratos-client'
import React from 'react'
import { isUiNodeInputAttributes, isUiNodeTextAttributes } from '@holi/core/auth/helpers/form'
import { NodeText } from '@holi/core/auth/components/Text'
import { InputProps, NodeInput } from '@holi/core/auth/components/Input'
import { InputSubmitProps, NodeInputSubmit } from '@holi/core/auth/components/InputSubmit'

interface Props extends InputSubmitProps, InputProps {
  node: UiNode
}

export const Node = (props: Props) => {
  const { node } = props
  if (isUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />
  } else if (isUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === 'submit') {
      return <NodeInputSubmit {...props} attributes={node.attributes} />
    }
    return <NodeInput {...props} attributes={node.attributes} />
  } else {
    return <>Unknown Element: {node.type}</>
  }
}
