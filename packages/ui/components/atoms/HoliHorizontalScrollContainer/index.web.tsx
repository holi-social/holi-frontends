import React from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'

import { Props } from './types'

// Ignore second `_` argument. It is used to satisfy web and mobile in regard to Ref attribute
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HoliHorizontalScrollContainer = React.forwardRef<unknown, Props>(({ children, hideWebScrollbars }, _) => {
  return (
    <ScrollContainer hideScrollbars={hideWebScrollbars} horizontal vertical={false}>
      {children}
    </ScrollContainer>
  )
})
HoliHorizontalScrollContainer.displayName = 'HoliHorizontalScrollContainer'

export default HoliHorizontalScrollContainer
