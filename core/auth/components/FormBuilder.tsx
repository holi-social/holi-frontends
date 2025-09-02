// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/SelfServiceFlow.tsx
import type {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNode,
  UiNodeInputAttributes,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
} from '@ory/kratos-client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, type ViewStyle } from 'react-native'

import type { TextInputOverride } from '@holi/core/auth/components/FormInputField'
import FormNode from '@holi/core/auth/components/FormNode'
import { getNodeId, oryNodeIsInput, oryNodeIsSubmit } from '@holi/core/auth/helpers/form'
import { getNodeProviderName } from '@holi/core/auth/helpers/auth'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { ScrollToProps } from '@holi/ui/helper/useScrollToInputOnFocus'
import Spacing from '@holi/ui/foundations/Spacing'
import { logError } from '@holi/core/errors/helpers'

type NodeId = string

export type NodeType = 'oidc' | 'password' | 'code' | 'email'

interface Props<T> {
  onSubmit: (payload: T, provider?: string) => Promise<void>
  handleMessage?: (messageId: number) => boolean
  isSignin?: boolean

  flow?: LoginFlow | RegistrationFlow | SettingsFlow | RecoveryFlow
  textInputOverride?: TextInputOverride
  submitLabelOverride?: string
  scrollToInputWithId?: (id: string) => ScrollToProps
  autofocusField?: NodeId
  noAutofocusForEmail?: boolean
  translationPrefix?: string
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  nodesToShow?: NodeType[]
  oidcProviders?: string[]
  withLoader?: boolean
}

interface FlowData<T> {
  nodes: UiNode[]
  values: T
  submitType: Record<string, unknown>
}

const FormBuilder = <
  T extends UpdateSettingsFlowBody | UpdateLoginFlowBody | UpdateRegistrationFlowBody | UpdateRecoveryFlowBody,
>({
  onSubmit,
  handleMessage,
  isSignin,
  flow,
  textInputOverride,
  submitLabelOverride,
  scrollToInputWithId,
  autofocusField,
  noAutofocusForEmail = false,
  translationPrefix = 'auth.login.',
  style,
  nodesToShow = [],
  oidcProviders = ['Google', 'Facebook', 'Apple'],
  withLoader = true,
}: Props<T>) => {
  const { t, i18n } = useTranslation()
  const { openToast } = useToast()

  const [{ nodes, values, submitType }, setFlowData] = useState<FlowData<T>>({
    nodes: [],
    values: {} as T,
    submitType: {},
  })

  const isEmailField = (name: string) => name === 'identifier' || name === 'traits.email' || name === 'email'
  const hasAutofocus = (node: UiNode) => {
    const name = getNodeId(node)
    const hasFocus = autofocusField === name || (!noAutofocusForEmail && isEmailField(name))
    return hasFocus && !(node.attributes as UiNodeInputAttributes).disabled
  }

  useEffect(() => {
    if (!flow) {
      return
    }

    // create view data from flow
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

        if (oryNodeIsInput(node.attributes) && node.attributes.type !== 'button') {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          store.values[name] = node.attributes.value
        }

        store.nodes.push(node)

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
    })

    // show global messages
    globalMessages?.map((message) => {
      if (handleMessage?.(message.id)) {
        return
      }
      const messageKey = `auth.login.message.${message.id}`
      const fallbackErrorMessage = t('auth.login.message.default')
      const messageText = i18n.exists(messageKey) ? t(messageKey) : fallbackErrorMessage
      if (!i18n.exists(messageKey)) {
        logError(new Error('Auth message without translation'), 'login flow message', {
          location: 'FormBuilder.useEffect',
          errorId: message.id,
          messageKey,
        })
      }
      if (message.type === 'error') {
        openToast(messageText, HoliToastType.ERROR, { testID: `message-${message.id}` })
      }
    })
  }, [flow, i18n, openToast, t, handleMessage])

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

  const nodeFilter = (node: UiNode) => {
    let nodeType: NodeType | undefined

    if (node.group === 'default' && node.type === 'input') {
      nodeType = 'email'
    } else if (node.group === 'password') {
      nodeType = 'password'
    } else if (node.group === 'oidc' && oidcProviders.includes(getNodeProviderName(node) as string)) {
      nodeType = 'oidc'
    } else if (node.group === 'code') {
      nodeType = 'code'
    }

    return nodeType ? nodesToShow.includes(nodeType) : false
  }

  return (
    <View style={style}>
      {!flow && withLoader ? (
        <HoliLoader />
      ) : !flow ? null : (
        nodes.filter(nodeFilter).map((node: UiNode, index) => {
          const name = getNodeId(node)

          return (
            <FormNode
              key={`form-field-${flow?.ui.action || ''}-${name}-${index}`}
              textInputOverride={textInputOverride}
              translationPrefix={translationPrefix}
              value={getValue(name)}
              onChange={onChange(name)}
              node={node}
              onSubmitPress={(overrides, provider) => {
                // Only submit resend if specifically requested, as it's otherwise hard to detect (and display errors for) missing inputs
                if (overrides && !('resend' in overrides)) {
                  delete submitType.resend
                }
                return onSubmit({ ...values, ...submitType, ...overrides }, provider)
              }}
              scrollToInputWithId={scrollToInputWithId}
              autofocus={hasAutofocus(node)}
              style={{ marginTop: Spacing['3xs'] }}
              isSignin={isSignin}
              submitLabelOverride={submitLabelOverride}
            />
          )
        })
      )}
    </View>
  )
}

export default FormBuilder
