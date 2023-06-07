import React, { useState } from 'react'
import { ScrollView, StyleProp, StyleSheet, Switch, TextStyle, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'

export const HoliSwitchSizes = ['extralarge', 'large', 'default', 'small'] as const
export type HoliSwitchSize = (typeof HoliSwitchSizes)[number]

export interface HoliSwitchProps {
  size?: HoliSwitchSize
  deactivatedText?: string
  activatedText?: string
  testID?: string
  onChange?: () => void
  defaultEnabled?: boolean
  style?: StyleProp<TextStyle>
  label?: string
  disabled?: boolean
}

const HoliSwitch = ({
  testID,
  size = 'default',
  deactivatedText,
  activatedText,
  defaultEnabled = false,
  onChange,
  style,
  label = '',
  disabled = false,
}: React.PropsWithChildren<HoliSwitchProps>) => {
  const styles = getStyles()
  const [isEnabled, setIsEnabled] = useState(defaultEnabled || false)

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState)
    onChange && onChange()
  }

  return (
    <ScrollView style={[style, styles.switch, getSizeStyles(size)]}>
      <HoliText size={size} align="center" style={styles.label}>
        {label}
      </HoliText>
      <View>
        <View style={styles.container}>
          <HoliText size={size}>{deactivatedText}</HoliText>
          <Switch onValueChange={toggleSwitch} value={isEnabled} testID={testID || 'holi-switch'} disabled={disabled} />
          <HoliText size={size}>{activatedText}</HoliText>
        </View>
      </View>
    </ScrollView>
  )
}

export default HoliSwitch

const getSizeStyles = (size: HoliSwitchSize) => {
  if (size === 'extralarge') {
    return { transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }
  } else if (size === 'large') {
    return { transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }
  } else if (size === 'small') {
    return { transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }
  }
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    switch: {
      paddingBottom: 2,
    },
    label: {
      marginBottom: 8,
    },
  })
