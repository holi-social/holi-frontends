import * as React from 'react'
import { Linking, StyleProp, StyleSheet, TextStyle } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
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

const HoliLink: React.FC<HoliLink> = ({ href, label, external, onPress, style, children, testID = 'text-link' }) => {
  const { navigate } = useUnifiedNavigation()

  const onLinkPress = React.useCallback(() => {
    onPress?.()
    external ? Linking.openURL(href) : navigate(href)
  }, [external, href, navigate, onPress])

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
