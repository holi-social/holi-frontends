// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/SelfServiceFlow.tsx
import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  UiNode,
  UiText,
} from '@ory/kratos-client'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import type { TextInputOverride } from '@holi/core/auth/components/FormInputField'
import FormMessages from '@holi/core/auth/components/FormMessages'
import FormNode from '@holi/core/auth/components/FormNode'
import { getNodeId, oryNodeIsInput, oryNodeIsSubmit } from '@holi/core/auth/helpers/form'

interface Props<T> {
  flow?: SelfServiceLoginFlow | SelfServiceRegistrationFlow | SelfServiceSettingsFlow | SelfServiceRecoveryFlow
  onSubmit: (payload: T) => Promise<void>
  only?: 'password' | 'profile' | 'totp' | 'lookup_secret'
  textInputOverride?: TextInputOverride
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
}

interface FlowData<T> {
  nodes: UiNode[]
  values: T
  submitType: Record<string, unknown>
  globalMessages: UiText[] | undefined
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
  const [{ nodes, values, submitType, globalMessages }, setFlowData] = useState<FlowData<T>>({
    nodes: [],
    values: {} as T,
    submitType: {},
    globalMessages: [],
  })

  const isEmailField = (name: string) => name === 'identifier' || name === 'traits.email' || name === 'email'

  useEffect(() => {
    if (!flow) {
      return
    }

    const { nodes, values, submitType, globalMessages } = flow.ui.nodes.reduce(
      (store, node) => {
        const name = getNodeId(node) as keyof T

        if (oryNodeIsSubmit(node.attributes)) {
          store.submitType[node.attributes.name] = node.attributes.value
        }

        if (isEmailField(String(name))) {
          // Show some general messages as email error
          // Requested in ticket HOLI-2392
          const SHOULD_BE_EMAIL_MESSAGE = [4000007]
          const globalMessages = store.globalMessages || []
          const newEmailMessages = globalMessages.filter((message) =>
            SHOULD_BE_EMAIL_MESSAGE.some((id) => id === message.id)
          )
          node.messages = [...node.messages, ...newEmailMessages]
          store.globalMessages = globalMessages.filter(
            (message) => !SHOULD_BE_EMAIL_MESSAGE.some((id) => id === message.id)
          )
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
      {
        nodes: [] as UiNode[],
        values: {} as T,
        submitType: {} as Record<string, unknown>,
        globalMessages: flow.ui.messages,
      }
    )

    setFlowData({
      nodes,
      values,
      submitType,
      globalMessages,
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
      {flow && <FormMessages messages={globalMessages} style={styles.formMessages} />}
      {flow &&
        nodes.map((node: UiNode, k) => {
          const name = getNodeId(node)
          return (
            <FormNode
              key={`form-field-${flow?.ui.action || ''}-${name}-${k}`}
              textInputOverride={textInputOverride}
              value={getValue(name)}
              onChange={onChange(name)}
              node={node}
              onSubmitPress={() => onSubmit({ ...values, ...submitType })}
              autofocus={isEmailField(name)}
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
