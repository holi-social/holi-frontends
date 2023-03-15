// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import { UiNode, UiNodeAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import FormInputField, { InputProps } from '@holi/core/auth/components/FormInputField'
import {
  getNodeId,
  getNodeTitle,
  oryNodeIsCheckbox,
  oryNodeIsHiddenField,
  oryNodeIsInput,
  oryNodeIsSubmit,
  oryNodeIsText,
} from '@holi/core/auth/helpers/form'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface Props extends InputProps {
  node: UiNode
  autofocus: boolean
  onSubmitPress: () => void
  style?: ViewStyle | Record<string, unknown>
}

const FormNode = (props: Props) => {
  const { t } = useTranslation()
  const { node } = props

  if (oryNodeIsHiddenField(node.attributes as UiNodeAttributes & { name: string })) {
    return <></>
  }

  if (oryNodeIsText(node.attributes)) {
    const metaText = props.node.meta.label?.text ? `${props.node.meta.label?.text} ` : ''
    const text = `${metaText} ${node.attributes.text.text}`
    return <HoliText style={[props.style || {}]}>{text}</HoliText>
  }

  // TODO: remove after removing this checkbox from Ory flow
  if (oryNodeIsCheckbox(node.attributes)) {
    return null
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
