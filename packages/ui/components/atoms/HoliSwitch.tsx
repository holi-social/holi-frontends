import React, { useState } from 'react'
import { StyleProp, StyleSheet, Switch, TextStyle, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'

export const HoliSwitchSizes = ['extralarge', 'large', 'default', 'small'] as const
export type HoliSwitchSize = (typeof HoliSwitchSizes)[number]

export interface HoliSwitchProps {
  activatedText?: string
  deactivatedText?: string
  defaultEnabled?: boolean
  disabled?: boolean
  label?: string
  onChange?: () => void
  size?: HoliSwitchSize
  style?: StyleProp<TextStyle>
  testID?: string
}

const HoliSwitch = ({
  activatedText = '',
  deactivatedText = '',
  defaultEnabled = false,
  disabled = false,
  label = '',
  onChange,
  size = 'default',
  style,
  testID = 'holi-switch',
}: React.PropsWithChildren<HoliSwitchProps>) => {
  const styles = getStyles()
  const [isEnabled, setIsEnabled] = useState(defaultEnabled || false)

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState)
    onChange && onChange()
  }

  return (
    <View style={[style, styles.switch, getSizeStyles(size)]}>
      <HoliText size={size} align="center" style={styles.label}>
        {label}
      </HoliText>
      <View>
        <View style={styles.container}>
          <HoliText size={size}>{deactivatedText}</HoliText>
          <Switch onValueChange={toggleSwitch} value={isEnabled} testID={testID} disabled={disabled} />
          <HoliText size={size}>{activatedText}</HoliText>
        </View>
      </View>
    </View>
  )
}

export default HoliSwitch

const getSizeStyles = (size: HoliSwitchSize) => {
  switch (size) {
    case 'extralarge':
      return { transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }
    case 'large':
      return { transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }
    case 'small':
      return { transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }
    default:
      return { transform: [{ scaleX: 1 }, { scaleY: 1 }] }
  }
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },
    switch: {
      paddingBottom: 2,
    },
    label: {
      marginBottom: 8,
    },
  })
