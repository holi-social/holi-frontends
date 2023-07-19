// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import { UiNode, UiNodeAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ViewStyle } from 'react-native'

import FormInputField, { InputProps } from '@holi/core/auth/components/FormInputField'
import {
  getNodeId,
  getNodeTitle,
  oryNodeIsHiddenField,
  oryNodeIsInput,
  oryNodeIsSubmit,
  oryNodeIsText,
} from '@holi/core/auth/helpers/form'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { isWebTouchDevice } from '@holi/ui/helper'
import type { ScrollToProps } from '@holi/ui/helper/useScrollToInputOnFocus'

interface Props extends InputProps {
  node: UiNode
  autofocus: boolean
  translationPrefix: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitPress: () => void
  scrollToInputWithId?: (id: string) => ScrollToProps
  style?: ViewStyle | Record<string, unknown>
}

const FormNode = (props: Props) => {
  const { t } = useTranslation()
  const { node, scrollToInputWithId = () => ({}) } = props

  const fieldName = getNodeId(node)
  const isMobile = Platform.OS !== 'web'
  const isTouchDevice = isWebTouchDevice() || isMobile
  const mobileInputFieldScrollIntoViewProps = isTouchDevice ? scrollToInputWithId(fieldName) : {}

  if (oryNodeIsHiddenField(node.attributes as UiNodeAttributes & { name: string })) {
    return <></>
  }

  if (oryNodeIsText(node.attributes)) {
    const metaText = props.node.meta.label?.text ? `${props.node.meta.label?.text} ` : ''
    const text = `${metaText} ${node.attributes.text.text}`
    return <HoliText style={[props.style || {}]}>{text}</HoliText>
  }

  if (oryNodeIsInput(node.attributes)) {
    return (
      <FormInputField
        {...props}
        disabled={node.attributes.disabled}
        attributes={node.attributes}
        translationPrefix={props.translationPrefix}
        onEnterPress={props.onSubmitPress}
        {...mobileInputFieldScrollIntoViewProps}
        style={[props.style || {}, { marginTop: 10 }]}
      />
    )
  }

  if (oryNodeIsSubmit(node.attributes)) {
    const fieldLabel = t(`${props.translationPrefix}input.label-${getNodeTitle(node)}`)
    return (
      <HoliButton
        label={fieldLabel}
        disabled={node.attributes.disabled}
        style={props.style}
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
