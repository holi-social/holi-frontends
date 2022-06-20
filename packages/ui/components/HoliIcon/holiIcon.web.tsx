import React from 'react'
import IcoMoon from 'react-icomoon'

import * as iconSetFilled from '@holi/ui/assets/fonts/HoliIcons/filled/selection.json'
import * as iconSetRegular from '@holi/ui/assets/fonts/HoliIcons/regular/selection.json'

import { HoliIconProps } from '.'

const HoliconWeb: React.VFC<HoliIconProps> = (props: HoliIconProps) => {
  const cleanedProps = { ...props }
  delete cleanedProps.filled
  return (
    <>
      {props.filled && <IcoMoon iconSet={iconSetFilled} {...cleanedProps} />}
      {!props.filled && <IcoMoon iconSet={iconSetRegular} {...cleanedProps} />}
    </>
  )
}

export default HoliconWeb
