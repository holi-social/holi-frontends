import * as React from 'react'
import { Linking, StyleProp, StyleSheet, TextStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliLink = {
  href: string
  label: string
  external?: boolean
  onPress?: CallableFunction
  style?: StyleProp<TextStyle>
  testID?: string
}

const HoliLink: React.FC<HoliLink> = ({ href, label, external, onPress, style, children, testID = 'link-text' }) => {
  const onLinkPress = React.useCallback(() => {
    onPress?.()
    external && Linking.openURL(href)
  }, [external, href, onPress])

  return (
    <HoliText
      accessibilityRole={'button'}
      accessibilityLabel={label}
      accessible
      style={[styles.link, style]}
      onPress={onLinkPress}
      testID={testID}
    >
      {children}
    </HoliText>
  )
}

export default HoliLink

const styles = StyleSheet.create({
  link: {
    color: colors.fontColorHighlighted,
  },
})
