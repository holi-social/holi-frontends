import React from 'react'
import { ViewStyle } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'

export interface HeaderTitleProps extends HoliTextProps {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderTitle: React.VFC<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const navigationContext = useNavigationContext()

  if (navigationContext.titleElement) return React.cloneElement(navigationContext.titleElement, { style: props.style })

  return (
    <HoliText bold {...props}>
      {navigationContext.headerTitle}
    </HoliText>
  )
}

export default HeaderTitle
