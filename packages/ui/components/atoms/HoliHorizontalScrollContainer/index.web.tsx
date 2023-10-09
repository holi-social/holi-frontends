import React from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'

import { Props } from './types'

const HoliHorizontalScrollContainer = ({ children, hideWebScrollbars }: Props) => {
  return (
    <ScrollContainer hideScrollbars={hideWebScrollbars} horizontal vertical={false}>
      {children}
    </ScrollContainer>
  )
}

export default HoliHorizontalScrollContainer
