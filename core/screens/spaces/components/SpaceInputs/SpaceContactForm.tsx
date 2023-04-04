import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceContactDescriptionInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactDescriptionInput'
import SpaceContactMailInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactMailInput'
import SpaceContactPhoneInputWeb from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactPhoneInputWeb'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceContactFormProps = {
  onChangeContactDescription: (contactDescription: string) => void
  onChangeContactMail: (contactEmail: string) => void
  onChangeContactPhone: (contactPhone: string) => void
  contactDescription: string
  contactEmail: string
  contactPhone: string
  contactDescriptionErrors?: string[]
  contactMailErrors?: string[]
  contactPhoneErrors?: string[]
  title: string
  style?: StyleProp<ViewStyle>
}
const SpaceContactForm: React.VFC<SpaceContactFormProps> = ({
  onChangeContactDescription,
  onChangeContactMail,
  onChangeContactPhone,
  contactDescription,
  contactEmail,
  contactPhone,
  contactDescriptionErrors,
  contactMailErrors,
  contactPhoneErrors,
  title,
  style,
}: SpaceContactFormProps) => {
  const { t } = useTranslation()
  return (
    <View style={style}>
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
        <SpaceContactMailInput
          value={contactEmail}
          onChange={onChangeContactMail}
          errorMessage={contactMailErrors?.length ? contactMailErrors[0] : undefined}
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
  )
}

export default SpaceContactForm

const styles = StyleSheet.create({
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
    marginTop: 40,
  },
  inputContainer: {
    marginTop: 24,
  },
})
