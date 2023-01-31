// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import { UiNode } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import FormCheckbox from '@holi/core/auth/components/FormCheckbox'
import FormInputField, { InputProps } from '@holi/core/auth/components/FormInputField'
import {
  getNodeId,
  getNodeTitle,
  oryNodeIsCheckbox,
  oryNodeIsInput,
  oryNodeIsSubmit,
  oryNodeIsText,
} from '@holi/core/auth/helpers/form'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface Props extends InputProps {
  node: UiNode
  autofocus: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitPress: () => void
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

  if (oryNodeIsCheckbox(node.attributes)) {
    return (
      <FormCheckbox
        node={node}
        value={props.value}
        onChange={props.onChange}
        autofocus={props.autofocus}
        style={props.style}
        testID={`ory-checkbox-${getNodeId(node).replace('.', '_')}`}
      />
    )
  }

  if (oryNodeIsInput(node.attributes)) {
    return (
      <FormInputField
        {...props}
        attributes={node.attributes}
        onEnterPress={props.onSubmitPress}
        style={[props.style || {}, { marginTop: 10 }]}
      />
    )
  }

  if (oryNodeIsSubmit(node.attributes)) {
    const fieldName = getNodeId(node)
    const fieldLabel = t(`auth.login.input.label-${getNodeTitle(node)}`)
    return (
      <HoliButton
        label={fieldLabel}
        style={props.style || {}}
        onPress={props.onSubmitPress}
        testID={`ory-submit-${fieldName}`}
      >
        {fieldLabel}
      </HoliButton>
    )
  }

  return <>Unknown Element: {node.type}</>
}

export default FormNode
