import { UiNode } from '@ory/kratos-client'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, View, ViewStyle } from 'react-native'

import HoliLink from '@holi//ui/components/molecules/HoliLink'
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
  autofocus = false,
  onChange = () => null,
  style,
  testID,
}) => {
  const { t, i18n } = useTranslation()
  const fieldLabel = getNodeTitle(node)

  // TODO: toast message in case of error auth.login.checkbox.toast-Consent

  const validationError = () => {
    if (!node || !node.messages || node.messages.length < 1) return undefined
    const { id, text } = node.messages[0]
    if (!id) return undefined

    const translationKey = `auth.login.checkbox.message.${id}`
    return i18n.exists(translationKey) ? i18n.t(translationKey) : text
  }

  const openModal = useCallback((event) => {
    console.log('TODO: open modal!', event)
    // prevent link execution
    return false
  }, [])

  // Exception for label with link
  if (fieldLabel === 'Consent') {
    return (
      <HoliCheckbox
        autofocus={autofocus}
        checked={value}
        onSelect={onChange}
        errorMessage={validationError()}
        style={style}
        testID={testID}
      >
        <View style={{ maxWidth: 300 }}>
          <HoliText size="small">
            {t('auth.login.checkbox.label-Consent-0')}{' '}
            <HoliLink label="" href={'/codeOfConduct'} onPress={openModal}>
              <HoliText size="small" bold>
                {t('auth.login.checkbox.label-Consent-1')}
              </HoliText>
            </HoliLink>{' '}
            {t('auth.login.checkbox.label-Consent-2')}
          </HoliText>
        </View>
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
