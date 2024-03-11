import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText, { HoliTextColor, HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliBadgeProps {
  children?: ReactNode
  backgroundColor?: string
  color?: HoliTextColor
  textSize?: HoliTextSize
}

const HoliBadge = ({
  backgroundColor = colors.white200,
  color = 'gray300',
  textSize = 'default',
  children,
}: HoliBadgeProps) => {
  // if children is a string, encapsulate it into a HoliText component, otherwise render it as is
  const transformedChildren =
    typeof children === 'string' ? (
      <HoliText color={color} size={textSize}>
        {children}
      </HoliText>
    ) : (
      children
    )

  return <View style={[styles.tag, { backgroundColor: backgroundColor }]}>{transformedChildren}</View>
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: Spacing['4xs'],
    paddingHorizontal: Spacing.xxs,
  },
})

export default HoliBadge
