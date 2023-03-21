import React from 'react'
import { StyleSheet } from 'react-native'
import PhoneInput from 'react-native-phone-number-input'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type SpaceContactPhoneInputProps = {
  onChange: (description: string) => void
  value: string
  errorMessage?: string
}

const SpaceContactPhoneInput: React.VFC<SpaceContactPhoneInputProps> = ({
  onChange,
  value,
}: SpaceContactPhoneInputProps) => {
  // const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = getStyles(theme)

  return (
    <>
      {/* <HoliTextInput
        placeholder={'+49'}
        inputLabel={'Phone number'}
        type={'number'}
        validationErrorText={errorMessage}
        value={value}
        onChange={onChange}
        accessibilityLabel={t('spaces.input.contact.phone.label')}
        testID="space-contact-phone"
      /> */}
      <PhoneInput
        // ref={phoneInput}m
        defaultValue={value}
        defaultCode="DE"
        layout="first"
        textContainerStyle={styles.textContainer}
        // accept only numbers as input
        placeholder=" "
        onChangeText={onChange}
        onChangeFormattedText={onChange}
        textInputProps={{
          keyboardType: 'number-pad',
        }}
        // withDarkTheme
        // withShadow
        //style the phone input like the HoliTextInput above
        containerStyle={styles.wrapperContainer}
        textInputStyle={styles.textInput}
        codeTextStyle={styles.textInput}
        // textInputStyle={styles.textInput}
        autoFocus
        // why it has not the same sizing as the HoliTextInput?
        // because it has a default value
        // style it like the HoliTextInput
      />
    </>
  )
}

export default SpaceContactPhoneInput

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapperContainer: {
      backgroundColor: 'white',
      borderWidth: 2,

      borderColor: 'lightgrey',
      width: '100%',
    },
    textContainer: {
      backgroundColor: 'white',
      color: 'grey',
      borderColor: 'lightgrey',
      borderStartWidth: 2,
    },
    textInput: {
      color: 'grey',
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      // color: colors.foreground30,
    },
  })
