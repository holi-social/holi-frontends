import React from 'react'

import { useTheme } from '@holi/ui/styles/theme'

import HoliconBase from './holicon'

export type HoliconProps = {
  icon: string
  color?: string
  size?: number
  testID?: string
}

const Holicon: React.VoidFunctionComponent<HoliconProps> = (props) => {
  const { theme } = useTheme()
  return <HoliconBase color={theme.colors.fontColorBlack} size={20} {...props} />
}

export default Holicon
