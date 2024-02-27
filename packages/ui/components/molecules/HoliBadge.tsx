import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText, { HoliTextColor } from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliBadgeProps {
  children?: ReactNode
  backgroundColor?: string
  color?: HoliTextColor
}

const HoliBadge = ({ backgroundColor = colors.white200, color = 'gray300', children }: HoliBadgeProps) => (
  <View style={[styles.tag, { backgroundColor: backgroundColor }]}>
    <HoliText color={color}>{children}</HoliText>
  </View>
)

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: Spacing['4xs'],
    paddingHorizontal: Spacing.xxs,
  },
})

export default HoliBadge
