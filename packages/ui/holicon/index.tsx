import React from 'react'
import { IconComponent } from 'react-icomoon'

import { useTheme } from '@holi/styles/theme'

import HoliconBase from './holicon'

export type HoliconProps = React.ComponentProps<typeof IconComponent> & {
  color?: string
}

const Holicon: React.VoidFunctionComponent<HoliconProps> = (props) => {
  const { theme } = useTheme()
  return <HoliconBase color={theme.colors.text} size={20} {...props} />
}

export default Holicon
