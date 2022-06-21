import React from 'react'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

const HeaderTitle: React.VoidFunctionComponent = (props) => {
  const navigationContext = useNavigationContext()

  // TODO: no font type for header text
  return (
    <HoliText type={HoliTextType.body} {...props}>
      {navigationContext.headerTitle}
    </HoliText>
  )
}

export default HeaderTitle
