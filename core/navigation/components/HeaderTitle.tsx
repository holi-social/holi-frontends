import React from 'react'
import { ViewStyle } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'

export type HeaderTitleProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderTitle: React.VFC<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const navigationContext = useNavigationContext()

  if (navigationContext.titleElement) return navigationContext.titleElement

  return (
    <HoliText bold {...props}>
      {navigationContext.headerTitle}
    </HoliText>
  )
}

export default HeaderTitle
