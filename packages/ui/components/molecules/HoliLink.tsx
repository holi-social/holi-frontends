import React, { useCallback } from 'react'
import { Linking, Platform, StyleProp, StyleSheet, TextStyle } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliLink = {
  href: string
  label: string
  external?: boolean
  onPress?: CallableFunction
  style?: StyleProp<TextStyle>
  // if 'HoliLink' is used in Modal Screen use 'mobileNavigateBackFirst' on mobile to close modal first and then navigate to HREF
  mobileNavigateBackFirst?: boolean
  testID?: string
}

const HoliLink: React.FC<HoliLink> = ({
  href,
  label,
  external,
  onPress,
  style,
  children,
  mobileNavigateBackFirst,
  testID = 'text-link',
}) => {
  const { navigate, navigateBack } = useUnifiedNavigation()

  const onLinkPress = useCallback(() => {
    if (external) {
      Linking.openURL(href)
    } else {
      // for Modal on mobile go back first to close Modal and then navigate to HREF
      if (!(Platform.OS === 'web') && mobileNavigateBackFirst) {
        navigateBack()
        setTimeout(() => navigate(href))
      } else {
        navigate(href)
      }
    }
    onPress?.()
  }, [external, href, mobileNavigateBackFirst, navigate, navigateBack, onPress])

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
