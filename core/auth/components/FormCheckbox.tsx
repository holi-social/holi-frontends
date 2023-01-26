import { UiNode } from '@ory/kratos-client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { getNodeTitle } from '@holi/core/auth/helpers/form'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'

export type FormCheckboxProps = {
  node: UiNode
  value: boolean
  autofocus?: boolean
  onChange?: (checked: boolean) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const FormCheckbox: React.VFC<FormCheckboxProps> = ({
  node,
  value = false,
  // autofocus = false,
  onChange = () => null,
  style,
  testID,
}) => {
  const { t, i18n } = useTranslation()
  const fieldLabel = getNodeTitle(node)

  // TODO: autofocus
  // TODO: Checkbox label with link

  const validationError = () => {
    if (!node || !node.messages || node.messages.length < 1) return undefined
    const { id, text } = node.messages[0]
    if (!id) return undefined

    const translationKey = `auth.login.checkbox.message.${id}`
    return i18n.exists(translationKey) ? i18n.t(translationKey) : text
  }

  if (fieldLabel === 'Consent') {
    return (
      <HoliCheckbox checked={value} onSelect={onChange} errorMessage={validationError()} style={style} testID={testID}>
        <HoliText size="small" style={{ maxWidth: 300 }}>
          I respect the Holi Code of Conduct and understand there is no tolerance for objectionable content or abusive
          behaviour.
        </HoliText>
      </HoliCheckbox>
    )
  }

  return (
    <HoliCheckbox
      label={t(`auth.login.checkbox.label-${fieldLabel}`)}
      checked={value}
      onSelect={onChange}
      errorMessage={validationError()}
      style={style}
      testID={testID}
    />
  )
}

export default FormCheckbox
