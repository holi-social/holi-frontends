import { UiNode } from '@ory/kratos-client'
import React, { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliLink from '@holi//ui/components/molecules/HoliLink'
import { getNodeTitle } from '@holi/core/auth/helpers/form'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

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
  const [showModal, setShowModal] = useState(false)
  const fieldLabel = getNodeTitle(node)

  // TODO: toast message in case of error auth.login.checkbox.toast-Consent

  const validationError = () => {
    if (!node || !node.messages || node.messages.length < 1) return undefined
    const { id, text } = node.messages[0]
    if (!id) return undefined

    const translationKey = `auth.login.checkbox.message.${id}`
    return i18n.exists(translationKey) ? i18n.t(translationKey) : text
  }

  const openModal = useCallback(() => {
    setShowModal(true)
    // prevent link execution
    return false
  }, [])

  // Exception for label with link
  if (fieldLabel === 'Consent') {
    return (
      <>
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
              <Trans t={t} i18nKey={'auth.login.checkbox.label-Consent'}>
                {/* TODO: The link href does not yet exist */}
                <HoliLink label="" href={'/codeOfConduct'} onPress={openModal} textStyle={styles.labelLink} />
              </Trans>
            </HoliText>
          </View>
        </HoliCheckbox>
        <HoliModal
          label={t('auth.login.checkbox.label-Consent-1')}
          show={showModal}
          onDismiss={() => setShowModal(false)}
        >
          <HoliText>{t('auth.login.checkbox.label-Consent-1')}</HoliText>
        </HoliModal>
      </>
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

const styles = StyleSheet.create({
  labelLink: {
    fontSize: 14,
    lineHeight: 14 * 1.2,
    color: colors.fontColor,
    fontWeight: 'bold',
  },
})
