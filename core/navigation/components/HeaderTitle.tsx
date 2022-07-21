import React from 'react'
import { ViewStyle } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliText from '@holi/ui/components/atoms/HoliText'

export type HeaderTitleProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderTitle: React.VoidFunctionComponent<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const navigationContext = useNavigationContext()

  // TODO: no font type for header text
  return <HoliText {...props}>{navigationContext.headerTitle}</HoliText>
}

export default HeaderTitle
