import React from 'react'
import IcoMoon from 'react-icomoon'
import { Path, Svg } from 'react-native-svg'

import iconSet from '@holi/ui/assets/fonts/holicons/selection.json'

import { HoliconProps } from '.'

const HoliconMobile: React.VoidFunctionComponent<HoliconProps> = (props) => (
  <IcoMoon native SvgComponent={Svg} PathComponent={Path} iconSet={iconSet} {...props} />
)

export default HoliconMobile
