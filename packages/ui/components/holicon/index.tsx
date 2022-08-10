import React from 'react'

import { colors } from '@holi/ui/styles/globalVars'

import HoliconBase from './holicon'

export type HoliconProps = {
  icon: string
  color?: string
  size?: number
  testID?: string
}

const Holicon: React.VoidFunctionComponent<HoliconProps> = (props) => {
  return <HoliconBase color={colors.fontColorBlack} size={20} {...props} />
}

export default Holicon
