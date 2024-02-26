import React, { ReactNode } from 'react'
import { StyleSheet } from 'react-native'

import HoliText, { HoliTextColor } from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

export interface HoliBadgeProps {
  children?: ReactNode
  backgroundColor?: string
  color?: HoliTextColor
}

const HoliBadge = ({ backgroundColor, color, children }: HoliBadgeProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <HoliText style={[styles.tag, { backgroundColor: backgroundColor || colors.white200 }]} color={color || 'gray300'}>
      {children}
    </HoliText>
  )
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.xxl,
    paddingVertical: Spacing['4xs'],
    paddingHorizontal: Spacing.xxs,
  },
})

export default HoliBadge
