import React from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceContactDescriptionInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactDescriptionInput'
import SpaceContactMailInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactMailInput'
import SpaceContactPhoneInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceContactPhoneInput'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceContactFormProps = {
  onChangeSpaceContactDescription: (description: string) => void
  onChangeSpaceMail: (mail: string) => void
  onChangeSpacePhone: (phone: string) => void
  spaceContactDescription: string
  spaceMail: string
  spacePhone: string
  spaceContactDescriptionErrors?: string[]
  spaceMailErrors?: string[]
  spacePhoneErrors?: string[]
  title: string
  style?: StyleProp<ViewStyle>
}

const SpaceContactForm: React.VFC<SpaceContactFormProps> = ({
  onChangeSpaceContactDescription,
  onChangeSpaceMail,
  onChangeSpacePhone,
  spaceContactDescriptionErrors,
  spaceMailErrors,
  spacePhoneErrors,
  title,
  style,
}: SpaceContactFormProps) => (
  <View style={style}>
    <View style={styles.title}>
      <HoliText size="extralarge">{title}</HoliText>
    </View>
    <View style={styles.info}>
      <HoliIcon icon="global" size={24} style={styles.infoIcon} />
      <HoliText style={styles.infoText}>Contact infos are public, on and off holi.</HoliText>
    </View>
    <SpaceContactDescriptionInput
      value={''}
      onChange={onChangeSpaceContactDescription}
      errorMessage={spaceContactDescriptionErrors?.length ? spaceContactDescriptionErrors[0] : undefined}
    />
    <View style={styles.inputContainer}>
      <SpaceContactMailInput
        value={''}
        onChange={onChangeSpaceMail}
        errorMessage={spaceMailErrors?.length ? spaceMailErrors[0] : undefined}
      />
    </View>
    <View style={styles.inputContainer}>
      <SpaceContactPhoneInput
        value={''}
        onChange={onChangeSpacePhone}
        errorMessage={spacePhoneErrors?.length ? spacePhoneErrors[0] : undefined}
      />
    </View>
  </View>
)

export default SpaceContactForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 132,
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
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
    marginTop: 40,
  },
  inputContainer: {
    marginTop: 24,
  },
})
