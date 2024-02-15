import React, { ReactNode } from 'react'
import { StyleSheet } from 'react-native'

import HoliText, { HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

// TODO: accessibility considerations
// Based on https://www.figma.com/file/RbD0C3K6vITgJXJ4srCxQ9/2.-components?node-id=9314%3A28012&mode=dev

type TagProps = {
  children?: ReactNode
  variant?: 'default' | 'skill' | 'interest'
  size?: 's' | 'm'
}

const sizeToTextSizeMap: Record<string, HoliTextSize> = {
  s: 'extrasmall',
  m: 'default',
}

const Tag = ({ variant = 'default', size = 's', children }: TagProps) => (
  <HoliText size={sizeToTextSizeMap[size]} style={[styles.tag, styles[variant], styles[size]]}>
    {children}
  </HoliText>
)

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.xXL,
    borderWidth: 1,
    borderColor: colors.black300,
  },
  s: {
    //  TODO: The spacing looks too tight to the top
    paddingTop: Spacing.xxxXs,
    paddingBottom: Spacing.xxxXs,
    paddingHorizontal: Spacing.xxXs,
  },
  m: {
    paddingVertical: Spacing.xxXs,
    paddingHorizontal: Spacing.xXs,
  },
  //  TODO: Align naming with Figma default is an improvement over generic (generic in Figma)
  default: {
    backgroundColor: colors.white100,
  },
  interest: {
    backgroundColor: colors.brandC200,
  },
  skill: {
    backgroundColor: colors.brandD200,
  },
})

export default Tag
