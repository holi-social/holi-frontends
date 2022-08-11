import React from 'react'
import IcoMoon from 'react-icomoon'
import { Path, Svg } from 'react-native-svg'

import * as iconSetFilled from '@holi/ui/assets/fonts/HoliIcons/filled/selection.json'
import * as iconSetRegular from '@holi/ui/assets/fonts/HoliIcons/regular/selection.json'
import { colors } from '@holi/ui/styles/globalVars'

import { HoliIconProps } from '.'

const HoliIconMobile: React.VFC<HoliIconProps> = (props: HoliIconProps) => {
  const cleanedProps = { ...props }
  delete cleanedProps.filled
  cleanedProps.icon = props.icon.replace(/_filled/g, '')
  return (
    <>
      {props.filled && (
        <IcoMoon
          native
          SvgComponent={Svg}
          PathComponent={Path}
          iconSet={iconSetFilled}
          style={{ color: props?.color || colors.fontColorBlack }}
          {...cleanedProps}
        />
      )}
      {!props.filled && (
        <IcoMoon
          native
          SvgComponent={Svg}
          PathComponent={Path}
          iconSet={iconSetRegular}
          style={{ color: props?.color || colors.fontColorBlack }}
          {...cleanedProps}
        />
      )}
    </>
  )
}

export default HoliIconMobile
