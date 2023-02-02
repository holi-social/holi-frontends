import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliExtendedTextInputProps = {
  onChangeText: (value: string) => void
  characterLength: number
  placeHolder: string
  description?: string
  inputLabel?: string
  noOfVisibleLines?: number
  validationErrorText?: string
  style?: StyleProp<ViewStyle>
}

const HoliExtendedTextInput: React.VFC<HoliExtendedTextInputProps> = ({
  onChangeText,
  characterLength,
  placeHolder,
  description,
  inputLabel,
  noOfVisibleLines = 1,
  validationErrorText,
}: HoliExtendedTextInputProps) => {
  const [currentCharacterLength, setCurrentCharacterLength] = useState(0)

  const onChangeTextInput = (value: string) => {
    onChangeText(value)
    setCurrentCharacterLength(value.length)
  }

  return (
    <View style={styles.textInputContainer}>
      <HoliTextInput
        noOfVisibleLines={noOfVisibleLines}
        maxNoOfVisibleLines={noOfVisibleLines}
        validationErrorText={validationErrorText}
        inputLabel={inputLabel}
        placeholder={placeHolder}
        accessibilityLabel={'name'}
        onChange={(value) => {
          onChangeTextInput(value)
        }}
        maxNoOfCharacters={characterLength}
      />
      {validationErrorText === undefined && (
        <View style={styles.inputInfoContainer}>
          {description && (
            <HoliText size="extrasmall" style={styles.inputInfoText}>
              {description}
            </HoliText>
          )}
          <View style={styles.characterLengthContainer}>
            <HoliText
              size="extrasmall"
              style={styles.inputInfoText}
            >{`${currentCharacterLength}/${characterLength}`}</HoliText>
          </View>
        </View>
      )}
    </View>
  )
}

export default HoliExtendedTextInput

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'column',
  },
  inputInfoContainer: {
    flexDirection: 'row',
    padding: 2,
    justifyContent: 'space-between',
  },
  characterLengthContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  inputInfoText: {
    color: colors.fontColorGrey,
  },
})
