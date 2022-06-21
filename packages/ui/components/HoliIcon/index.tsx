import React from 'react'

import { useTheme } from '@holi/ui/styles/theme'

import HoliIconBase from './holiIcon'

export type HoliIconProps = {
  icon: string
  color?: string
  filled?: boolean
  size?: number
  testID?: string
  style?: React.CSSProperties | undefined
}

const HoliIcon: React.VoidFunctionComponent<HoliIconProps> = (props: HoliIconProps) => {
  const { theme } = useTheme()
  return <HoliIconBase color={theme.colors.fontColorBlack} size={20} {...props} />
}

export default HoliIcon
