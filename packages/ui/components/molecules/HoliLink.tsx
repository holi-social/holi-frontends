import React, { useCallback } from 'react'
import { Linking, Pressable, StyleProp, StyleSheet, TextStyle, ViewProps } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliLinkProps = {
  href: string
  label: string
  external?: boolean
  onPress?: CallableFunction
  style?: StyleProp<TextStyle>
  textStyle?: StyleProp<TextStyle>
  // if 'HoliLink' is used in Modal Screen use 'mobileNavigateBackFirst' on mobile to close modal first and then navigate to HREF
  mobileNavigateBackFirst?: boolean
  testID?: string
}

const HoliLink: React.FC<HoliLinkProps> = ({
  href,
  label,
  external,
  onPress,
  style,
  textStyle,
  children,
  mobileNavigateBackFirst,
  testID = 'text-link',
}) => {
  const { navigate, navigateBack } = useUnifiedNavigation()

  const onLinkPress = useCallback(() => {
    const stopPropagation = onPress?.()

    if (stopPropagation === false) return

    if (external) {
      Linking.openURL(href)
    } else {
      // for Modal on mobile go back first to close Modal and then navigate to HREF
      if (mobileNavigateBackFirst) {
        navigateBack()
        setTimeout(() => navigate(href), 300)
      } else {
        navigate(href)
      }
    }
  }, [external, href, mobileNavigateBackFirst, navigate, navigateBack, onPress])

  const Component = React.Children.toArray(children).some((child) => typeof child === 'string') ? HoliText : Pressable

  return (
    <Component
      accessibilityRole={'button'}
      accessibilityLabel={label}
      accessible
      style={[styles.link, style, textStyle] as ViewProps}
      onPress={onLinkPress}
      testID={testID}
    >
      {children}
    </Component>
  )
}

export default HoliLink

const styles = StyleSheet.create({
  link: {
    color: colors.fontColorHighlighted,
  },
})
