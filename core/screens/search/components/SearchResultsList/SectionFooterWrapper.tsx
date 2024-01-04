import React from 'react'
import { Platform } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { vars } from '@holi/ui/styles/globalVars'

export const SectionFooterWrapper = ({
  hasBottomOffset,
  children,
}: React.PropsWithChildren<{ hasBottomOffset?: boolean }>) => {
  switch (Platform.OS) {
    case 'android':
    case 'web':
      return hasBottomOffset ? (
        <HoliBox padding={[0, 0, +vars.bottomBarHeight, 0]}>{children}</HoliBox>
      ) : (
        <>{children}</>
      )

    default:
      return <>{children}</>
  }
}
