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
import { StyleSheet, View, ViewStyle } from 'react-native'

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

interface FlowData<T> {
  nodes: UiNode[]
  values: T
  submitType: Record<string, unknown>
}

const FormBuilder = <
  T extends SubmitSelfServiceSettingsFlowBody | SubmitSelfServiceLoginFlowBody | SubmitSelfServiceRegistrationFlowBody
>({
  flow,
  onSubmit,
  only,
  textInputOverride,
  style,
}: Props<T>) => {
  const [{ nodes, values, submitType }, setFlowData] = useState<FlowData<T>>({
    nodes: [],
    values: {} as T,
    submitType: {},
  })

  useEffect(() => {
    if (!flow) {
      return
    }

    const { nodes, values, submitType } = flow.ui.nodes.reduce(
      (store, node) => {
        const name = getNodeId(node) as keyof T

        if (oryNodeIsSubmit(node.attributes)) {
          store.submitType[node.attributes.name] = node.attributes.value
        }

        if (oryNodeIsInput(node.attributes) && node.attributes.type !== 'button' && node.attributes.type !== 'submit') {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          store.values[name] = node.attributes.value
        }

        if (!only || node.group === only || node.group === 'default') {
          store.nodes.push(node)
        }

        return store
      },
      // initial store
      { nodes: [] as UiNode[], values: {} as T, submitType: {} as Record<string, unknown> }
    )

    setFlowData({
      nodes,
      values,
      submitType,
    })
  }, [flow, only])

  const onChange = (name: string) => (value: string) => {
    setFlowData((currFlowData) => ({
      ...currFlowData,
      values: {
        ...currFlowData.values,
        [name]: value,
      },
    }))
  }

  const getValue = (name: string) => values[name as keyof T]

  return (
    <View style={style}>
      {flow && <FormMessages messages={flow.ui.messages} style={styles.formMessages} />}
      {flow &&
        nodes.map((node: UiNode, k) => {
          const name = getNodeId(node)
          console.log(name)
          return (
            <FormNode
              key={`form-field-${flow?.ui.action || ''}-${name}-${k}`}
              textInputOverride={textInputOverride}
              value={getValue(name)}
              onChange={onChange(name)}
              node={node}
              onSubmitPress={() => onSubmit({ ...values, ...submitType })}
              autofocus={name === 'identifier' || name === 'traits.email'} // email field
              style={{ marginTop: 30 }}
            />
          )
        })}
    </View>
  )
}

export default FormBuilder

const styles = StyleSheet.create({
  formMessages: {
    marginVertical: 10,
  },
})
