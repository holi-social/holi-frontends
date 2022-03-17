import React from 'react'
import { IconComponent } from 'react-icomoon'
import { useTheme } from '../../../styles/theme'
import Holicon from './holicon'

export type HoliconProps = React.ComponentProps<typeof IconComponent> & {
  color?: string
}

const HoliconDefaultTheme: React.VoidFunctionComponent<HoliconProps> = (props) => {
  const { theme } = useTheme()
  return <Holicon color={theme.colors.text} size={20} {...props} />
}

export default HoliconDefaultTheme
