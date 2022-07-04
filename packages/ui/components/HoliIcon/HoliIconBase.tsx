import React from 'react'
import IcoMoon from 'react-icomoon'
import { Path, Svg } from 'react-native-svg'

import * as iconSetFilled from '@holi/ui/assets/fonts/HoliIcons/filled/selection.json'
import * as iconSetRegular from '@holi/ui/assets/fonts/HoliIcons/regular/selection.json'
import { useTheme } from '@holi/ui/styles/theme'

import { HoliIconProps } from '.'

const HoliIconMobile: React.VFC<HoliIconProps> = (props: HoliIconProps) => {
  const { theme } = useTheme()
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
          style={{ color: theme.colors.fontColorBlack }}
          {...cleanedProps}
        />
      )}
      {!props.filled && (
        <IcoMoon
          native
          SvgComponent={Svg}
          PathComponent={Path}
          iconSet={iconSetRegular}
          style={{ color: theme.colors.fontColorBlack }}
          {...cleanedProps}
        />
      )}
    </>
  )
}

export default HoliIconMobile
