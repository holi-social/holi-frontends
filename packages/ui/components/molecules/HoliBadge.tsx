import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText, { HoliTextColor, HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

export interface HoliBadgeProps {
  children?: ReactNode
  backgroundColor?: string
  color?: HoliTextColor
  textSize?: HoliTextSize
}

const HoliBadge = ({ backgroundColor, color, textSize = 'default', children }: HoliBadgeProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  // if children is a string, encapsulate it into a HoliText component, otherwise render it as is
  const transformedChildren =
    typeof children === 'string' ? (
      <HoliText color={color || (colors.gray300 as HoliTextColor)} size={textSize}>
        {children}
      </HoliText>
    ) : (
      children
    )

  return (
    <View style={[styles.tag, { backgroundColor: backgroundColor || colors.white200 }]}>{transformedChildren}</View>
  )
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 40,
    paddingVertical: Spacing['4xs'],
    paddingHorizontal: Spacing.xxs,
  },
})

export default HoliBadge
