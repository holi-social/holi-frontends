import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import FormWrapper, { FormWrapperProps } from '@holi/core/components/FormWrapper'
import SpaceContactDescriptionInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactDescriptionInput'
import SpaceContactEmailInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactEmailInput'
import SpaceContactPhoneInputWeb from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactPhoneInputWeb'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface SpaceContactFormProps extends Partial<FormWrapperProps> {
  onChangeContactDescription: (contactDescription: string) => void
  onChangeContactEmail: (contactEmail: string) => void
  onChangeContactPhone: (contactPhone: string) => void
  contactDescription: string
  contactEmail: string
  contactPhone: string
  onSave: () => void
  contactDescriptionErrors?: string[]
  contactEmailErrors?: string[]
  contactPhoneErrors?: string[]
  title: string
  style?: StyleProp<ViewStyle>
}
const SpaceContactForm: React.VFC<SpaceContactFormProps> = ({
  onChangeContactDescription,
  onChangeContactEmail,
  onChangeContactPhone,
  contactDescription,
  contactEmail,
  contactPhone,
  onSave,
  saveButtonDisabled,
  loading,
  contactDescriptionErrors,
  contactEmailErrors,
  contactPhoneErrors,
  title,
  style,
}: SpaceContactFormProps) => {
  const { t } = useTranslation()
  return (
    <FormWrapper
      isModal={true}
      onSave={onSave}
      saveButtonDisabled={saveButtonDisabled}
      loading={loading}
      renderProp={() => (
        <View style={[styles.container, style]}>
          <View style={styles.title}>
            <HoliText size="extralarge">{title}</HoliText>
          </View>
          <View style={styles.info}>
            <HoliIcon icon="global" size={24} style={styles.infoIcon} />
            <HoliText style={styles.infoText}>{t('spaces.input.contact.info.text')}</HoliText>
          </View>
          <SpaceContactDescriptionInput
            value={contactDescription}
            onChange={onChangeContactDescription}
            errorMessage={contactDescriptionErrors?.length ? contactDescriptionErrors[0] : undefined}
          />
          <View style={styles.inputContainer}>
            <SpaceContactEmailInput
              value={contactEmail}
              onChange={onChangeContactEmail}
              errorMessage={contactEmailErrors?.length ? contactEmailErrors[0] : undefined}
            />
          </View>
          <View style={styles.inputContainer}>
            <SpaceContactPhoneInputWeb
              value={contactPhone}
              onChange={onChangeContactPhone}
              errorMessage={contactPhoneErrors?.length ? contactPhoneErrors[0] : undefined}
            />
          </View>
        </View>
      )}
    />
  )
}

export default SpaceContactForm

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 4,
    color: colors.foreground20,
  },
  infoText: {
    color: colors.foreground20,
  },
  title: {
    marginBottom: 16,
    marginTop: 24,
  },
  inputContainer: {
    marginTop: 24,
  },
})
