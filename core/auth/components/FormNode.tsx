// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Node/Node.tsx
import type { UiNode, UiNodeAttributes } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native'

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
import { Button } from 'holi-bricks/components/button'
import { isWebTouchDevice } from '@holi/ui/helper'
import type { ScrollToProps } from '@holi/ui/helper/useScrollToInputOnFocus'
import type { UpdateLoginFlowBody } from '@ory/kratos-client/api'
import { getNodeProviderId } from '@holi/core/auth/helpers/auth'
import { FormNodeSocialLogin } from '@holi/core/auth/components/FormNodeSocialLogin'
import { Refresh } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'

interface Props extends InputProps {
  node: UiNode
  autofocus: boolean
  translationPrefix: string
  onSubmitPress: (overrides?: Partial<UpdateLoginFlowBody>, provider?: string) => void
  isSignin?: boolean
  scrollToInputWithId?: (id: string) => ScrollToProps
  style?: StyleProp<ViewStyle>
  submitLabelOverride?: string
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
    return <HoliText style={[props.style || {}] as StyleProp<TextStyle>}>{text}</HoliText>
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
        style={props.style as StyleProp<TextStyle>}
      />
    )
  }

  if (oryNodeIsSubmit(node.attributes)) {
    if (getNodeProviderId(node)) {
      return (
        <FormNodeSocialLogin
          node={node}
          translationPrefix={props.translationPrefix}
          style={props.style}
          onSubmitPress={props.onSubmitPress}
        />
      )
    }
    const key = getNodeTranslationKey(node)

    let translationKey = props.submitLabelOverride ?? `${props.translationPrefix}input.label-${key}`
    if (key === 'SignInCode' || key === 'SignUpCode') {
      translationKey = 'auth.otp.CTA'
    }
    if (key === 'SubmitCode') {
      translationKey = 'registration.emailVerification.cta.verify'
    }

    if (key === 'ResendCode') {
      return (
        <View style={styles.resendCodeContainer}>
          <Text>{t('registration.emailVerification.resendInstruction')}</Text>
          <Button
            label={t('registration.emailVerification.resendEmail')}
            disabled={node.attributes.disabled}
            onPress={() => props.onSubmitPress({ method: 'code', resend: 'code' })}
            size="lg"
            transparent
            icon={Refresh}
            testID={`ory-submit-${fieldName}`}
          />
        </View>
      )
    }

    return (
      <View style={props.style}>
        <Button
          label={t(translationKey)}
          disabled={node.attributes.disabled}
          onPress={() =>
            props.onSubmitPress(
              'value' in node.attributes ? { method: node.attributes.value, provider: undefined } : undefined
            )
          }
          size="lg"
          testID={`ory-submit-${fieldName}`}
        />
      </View>
    )
  }
}

export default FormNode

const styles = StyleSheet.create({
  resendCodeContainer: {
    gap: Spacing['3xs'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
