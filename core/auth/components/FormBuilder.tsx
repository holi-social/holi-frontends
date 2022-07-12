// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/FormBuilder.tsx
import {
  SelfServiceLoginFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  UiNode,
} from '@ory/kratos-client'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { TextInputOverride } from '@holi/core/auth/components/FormInputField'
import FormMessages from '@holi/core/auth/components/FormMessages'
import { FormNode } from '@holi/core/auth/components/FormNode'
import { getNodeId, oryNodeIsInput } from '@holi/core/auth/helpers/form'

interface Props<T> {
  flow?: SelfServiceLoginFlow | SelfServiceRegistrationFlow | SelfServiceSettingsFlow
  onSubmit: (payload: T) => Promise<void>
  only?: 'password' | 'profile' | 'totp' | 'lookup_secret'
  textInputOverride?: TextInputOverride
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
}

export const FormBuilder = <
  T extends SubmitSelfServiceSettingsFlowBody | SubmitSelfServiceLoginFlowBody | SubmitSelfServiceRegistrationFlowBody
>({
  flow,
  only,
  onSubmit,
  textInputOverride,
  style,
}: Props<T>) => {
  const [values, setValues] = useState<T>({} as T)
  const [nodes, setNodes] = useState<Array<UiNode>>([])

  useEffect(() => {
    if (!flow) {
      return
    }
    const nodes = flow.ui.nodes.filter(({ group }) => {
      if (only) {
        return group === only || group === 'default'
      }
      return true
    })

    const values: Partial<T> = {}
    nodes.forEach((node: UiNode) => {
      const name = getNodeId(node)
      const key = name as keyof T
      if (oryNodeIsInput(node.attributes)) {
        if (node.attributes.type === 'button' || node.attributes.type === 'submit') {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          return
        }
        values[key] = node.attributes.value
      }
    })
    setValues(values as T)
    setNodes(nodes)
  }, [flow])

  if (!flow) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }))
  }

  const getValue = (name: string) => values[name as keyof T]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPress = (key: string, value: any) => {
    onSubmit({ ...values, [key]: value })
  }

  return (
    <View style={style}>
      <FormMessages messages={flow.ui.messages} />
      {nodes.map((node: UiNode, k) => {
        const name = getNodeId(node)
        return (
          <FormNode
            key={`form-field-${flow.ui.action || ''}-${name}-${k}`}
            textInputOverride={textInputOverride}
            value={getValue(name)}
            onChange={onChange(name)}
            node={node}
            onSubmitPress={onPress}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bordered: {
    borderWidth: 1,
    borderColor: '#0f0',
  },
})
