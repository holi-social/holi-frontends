import React from 'react'
import { StyleSheet } from 'react-native'
import PhoneInput from 'react-native-phone-number-input'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type SpaceContactPhoneInputProps = {
  onChange: (description: string) => void
  value: string
  errorMessage?: string
}

// draft for HOLI-3549: Space contact info: add phone number format validation and design
const SpaceContactPhoneInput: React.FC<SpaceContactPhoneInputProps> = ({
  onChange,
  value,
}: SpaceContactPhoneInputProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  return (
    <>
      <PhoneInput
        defaultValue={value}
        defaultCode="DE"
        layout="first"
        textContainerStyle={styles.textContainer}
        placeholder=" "
        onChangeText={onChange}
        textInputProps={{
          keyboardType: 'number-pad',
        }}
        containerStyle={styles.wrapperContainer}
        textInputStyle={styles.textInput}
        codeTextStyle={styles.textInput}
        autoFocus
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
      fontFamily: theme.fontFamily.default('Regular'),
    },
  })
