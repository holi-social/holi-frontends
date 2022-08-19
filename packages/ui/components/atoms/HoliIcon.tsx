/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import IcoMoon from 'react-icomoon'
import { Platform } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export type HoliIconProps = {
  icon: string
  color?: string
  filled?: boolean
  size?: number
  testID?: string
  style?: React.CSSProperties
}

const HoliIcon: React.VoidFunctionComponent<HoliIconProps> = (props: HoliIconProps) => {
  const cleanedProps = { ...props }
  delete cleanedProps.filled
  cleanedProps.icon = props.icon.replace(/_filled/g, '')
  cleanedProps.size = props.size !== undefined ? props.size : 24

  const iconSet = props?.filled
    ? require('@holi/ui/assets/fonts/HoliIcons/filled/selection.json')
    : require('@holi/ui/assets/fonts/HoliIcons/regular/selection.json')

  const mobileProps =
    Platform.OS === 'web'
      ? {}
      : {
          native: true,
          SvgComponent: require('react-native-svg').Svg,
          PathComponent: require('react-native-svg').Path,
        }

  return (
    <IcoMoon
      iconSet={iconSet}
      style={{ color: props?.color || colors.fontColorBlack }}
      {...mobileProps}
      {...cleanedProps}
    />
  )
}

export default HoliIcon
