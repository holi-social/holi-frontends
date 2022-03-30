import React from 'react'
import IcoMoon from 'react-icomoon'
import iconSet from '@holi/shared/assets/fonts/holicons/selection.json'
import { HoliconProps } from '.'

const HoliconWeb: React.VoidFunctionComponent<HoliconProps> = (props) => <IcoMoon iconSet={iconSet} {...props} />

export default HoliconWeb
