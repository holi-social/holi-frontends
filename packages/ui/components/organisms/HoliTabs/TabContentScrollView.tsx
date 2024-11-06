import React, { PropsWithChildren } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

interface Props {
  marginHorizontal?: number
  paddingTop?: number
  paddingBottom?: number
}

const TabContentScrollView = ({
  paddingTop,
  paddingBottom = 0,
  marginHorizontal = Spacing.xs,
  children,
}: PropsWithChildren<Props>) => {
  const { top: safeAreaTop } = useSafeAreaInsets()
  const offsetBottom = safeAreaTop + dimensions.topBarHeight + paddingBottom

  return (
    <ScrollView
      style={{ marginHorizontal: -marginHorizontal, minHeight: '100%' }}
      contentContainerStyle={{ paddingTop, paddingBottom: offsetBottom, marginHorizontal }}
    >
      {children}
    </ScrollView>
  )
}

export default TabContentScrollView
