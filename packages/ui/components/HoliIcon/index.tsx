import React from 'react'

import { colors } from '@holi/ui/styles/globalVars'

import HoliIconBase from './HoliIconBase'

export type HoliIconProps = {
  icon: string
  color?: string
  filled?: boolean
  size?: number
  testID?: string
  style?: React.CSSProperties
}

const HoliIcon: React.VoidFunctionComponent<HoliIconProps> = (props: HoliIconProps) => {
  return <HoliIconBase color={colors.fontColorBlack} size={20} {...props} />
}

export default HoliIcon
