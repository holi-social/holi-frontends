// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import { UiNode } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import FormInputField, { InputProps } from '@holi/core/auth/components/FormInputField'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitPress: (key: string, value: any) => void
  style?: ViewStyle | Record<string, unknown>
}

const FormNode = (props: Props) => {
  const { t } = useTranslation()
  const { node } = props

  if (oryNodeIsText(node.attributes)) {
    const metaText = props.node.meta.label?.text ? `${props.node.meta.label?.text} ` : ''
    const text = `${metaText} ${node.attributes.text.text}`
    return <HoliText style={[props.style || {}]}>{text}</HoliText>
  }

  if (oryNodeIsInput(node.attributes)) {
    return <FormInputField {...props} attributes={node.attributes} style={[props.style || {}, { marginTop: 10 }]} />
  }

  if (oryNodeIsSubmit(node.attributes)) {
    const fieldName = getNodeId(node)
    const fieldLabel = t(`auth.login.input.label-${getNodeTitle(node)}`)
    const value = getNodeValue(node)
    return (
      <HoliButton
        label={fieldLabel}
        style={props.style || {}}
        onPress={() => props.onSubmitPress(fieldName, value)}
        testID={`oryField-${fieldName}/${node.attributes.value}`}
      >
        {fieldLabel}
      </HoliButton>
    )
  }

  return <>Unknown Element: {node.type}</>
}

export default FormNode
