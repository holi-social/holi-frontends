import React, { ReactNode } from 'react'
import { StyleSheet } from 'react-native'

import HoliText, { HoliTextColor } from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliBadgeProps {
  children?: ReactNode
  backgroundColor?: string
  color?: HoliTextColor
}

const HoliBadge = ({ backgroundColor = colors.white200, color = 'gray300', children }: HoliBadgeProps) => (
  <HoliText style={[styles.tag, { backgroundColor: backgroundColor }]} color={color}>
    {children}
  </HoliText>
)

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.xxl,
    paddingVertical: Spacing['4xs'],
    paddingHorizontal: Spacing.xxs,
  },
})

export default HoliBadge
