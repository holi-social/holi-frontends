// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import type { UiNode, UiNodeAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import FormInputField, { type InputProps } from '@holi/core/auth/components/FormInputField'
import {
  getNodeId,
  getNodeTranslationKey,
  oryNodeIsHiddenField,
  oryNodeIsInput,
  oryNodeIsSubmit,
  oryNodeIsText,
} from '@holi/core/auth/helpers/form'
import { isApp } from '@holi/core/helpers/isApp'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { isWebTouchDevice } from '@holi/ui/helper'
import type { ScrollToProps } from '@holi/ui/helper/useScrollToInputOnFocus'

interface Props extends InputProps {
  node: UiNode
  autofocus: boolean
  translationPrefix: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitPress: () => void
  isSignin?: boolean
  scrollToInputWithId?: (id: string) => ScrollToProps
  style?: StyleProp<ViewStyle>
}

const FormNode = (props: Props) => {
  const { t } = useTranslation()
  const { node, scrollToInputWithId = () => ({}) } = props

  const fieldName = getNodeId(node)
  const isTouchDevice = isWebTouchDevice() || isApp
  const mobileInputFieldScrollIntoViewProps = isTouchDevice ? scrollToInputWithId(fieldName) : {}

  if (oryNodeIsHiddenField(node.attributes as UiNodeAttributes & { name: string })) {
    return null
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
        style={props.style}
      />
    )
  }

  if (oryNodeIsSubmit(node.attributes)) {
    const fieldLabel = t(`${props.translationPrefix}input.label-${getNodeTranslationKey(node)}`)
    return (
      <HoliButtonLoading
        label={fieldLabel}
        disabled={node.attributes.disabled}
        style={props.style}
        onPress={props.onSubmitPress}
        testID={`ory-submit-${fieldName}`}
      >
        {fieldLabel}
      </HoliButtonLoading>
    )
  }

  return <>Unknown Element: {node.type}</>
}

export default FormNode
