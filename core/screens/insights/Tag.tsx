import React, { ReactNode } from 'react'
import { StyleSheet } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

type TagProps = {
  children?: ReactNode
  variant?: 'default' | 'skill' | 'interest'
  size?: 's' | 'm'
}

const Tag = ({ variant = 'default', size = 's', children }: TagProps) => (
  <HoliText style={[styles.tag, styles[variant], styles[size]]} color="gray300">
    {children}
  </HoliText>
)

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.xxl,
  },
  s: {
    paddingVertical: Spacing['4xs'],
    paddingHorizontal: Spacing.xxs,
  },
  m: {
    padding: Spacing.xs,
  },
  default: {
    backgroundColor: colors.white200,
  },
  interest: {
    backgroundColor: colors.brandC200,
  },
  skill: {
    backgroundColor: colors.brandD200,
  },
})

export default Tag
