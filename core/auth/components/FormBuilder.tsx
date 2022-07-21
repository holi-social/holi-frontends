// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/SelfServiceFlow.tsx
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
import { Platform, View, ViewStyle } from 'react-native'

import type { TextInputOverride } from '@holi/core/auth/components/FormInputField'
import FormMessages from '@holi/core/auth/components/FormMessages'
import FormNode from '@holi/core/auth/components/FormNode'
import { getNodeId, oryNodeIsInput, oryNodeIsSubmit } from '@holi/core/auth/helpers/form'

interface Props<T> {
  flow?: SelfServiceLoginFlow | SelfServiceRegistrationFlow | SelfServiceSettingsFlow
  onSubmit: (payload: T) => Promise<void>
  only?: 'password' | 'profile' | 'totp' | 'lookup_secret'
  textInputOverride?: TextInputOverride
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
}

const FormBuilder = <
  T extends SubmitSelfServiceSettingsFlowBody | SubmitSelfServiceLoginFlowBody | SubmitSelfServiceRegistrationFlowBody
>(
  props: Props<T>
) => {
  const [values, setValues] = useState<T>({} as T)
  const [nodes, setNodes] = useState<Array<UiNode>>([])
  const [submitType, setSubmitType] = useState<Record<string, unknown>>()

  useEffect(() => {
    if (!props.flow) {
      return
    }
    const nodes = props.flow.ui.nodes.filter(({ group }) => {
      if (props.only) {
        return group === props.only || group === 'default'
      }
      return true
    })

    const values: Partial<T> = {}
    nodes.forEach((node: UiNode) => {
      const name = getNodeId(node)
      const key = name as keyof T

      if (oryNodeIsSubmit(node.attributes)) {
        const submitType: Record<string, unknown> = {}
        submitType[node.attributes.name] = node.attributes.value
        setSubmitType(submitType)
      }

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
  }, [props.flow, props.only])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }))
  }

  const getValue = (name: string) => values[name as keyof T]

  const accessibilityProps = Platform.OS === 'web' ? { accessibilityRole: 'form' } : {}

  return (
    <View {...accessibilityProps} style={props.style}>
      {props.flow && <FormMessages messages={props.flow.ui.messages} />}
      {props.flow &&
        nodes.map((node: UiNode, k) => {
          const name = getNodeId(node)
          return (
            <FormNode
              key={`form-field-${props.flow?.ui.action || ''}-${name}-${k}`}
              textInputOverride={props.textInputOverride}
              value={getValue(name)}
              onChange={onChange(name)}
              node={node}
              onSubmitPress={() => props.onSubmit({ ...values, ...submitType })}
              autofocus={name === 'identifier'} // email field
              style={{ marginTop: 30 }}
              {...accessibilityProps}
            />
          )
        })}
    </View>
  )
}

export default FormBuilder
