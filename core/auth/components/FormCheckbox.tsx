import { UiNode } from '@ory/kratos-client'
import React, { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { getNodeTitle } from '@holi/core/auth/helpers/form'
import CommunityGuidelines from '@holi/core/screens/communityGuidelines/components/CommunityGuidelines'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'

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
                <HoliTextLink
                  label=""
                  href={'/communityGuidelines'}
                  onPress={openModal}
                  variant="secondary"
                  size="small"
                />
              </Trans>
            </HoliText>
          </View>
        </HoliCheckbox>
        <HoliModal
          label={t('auth.login.checkbox.label-Consent')}
          autoHeight={false}
          show={showModal}
          onDismiss={() => setShowModal(false)}
        >
          <ScrollView style={styles.communityGuidelines} contentContainerStyle={{ maxWidth: '100%' }}>
            <CommunityGuidelines />
          </ScrollView>
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
    fontWeight: '700',
    color: colors.foreground30,
  },
  communityGuidelines: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 50,
    maxWidth: vars.maxScreenWidth,
    alignSelf: 'center',
    flex: 1,
  },
})
