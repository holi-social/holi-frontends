import { Platform } from 'react-native'
import { useAnimatedStyle } from 'react-native-reanimated'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { dimensions } from '@holi/ui/styles/globalVars'

import { ScrollHeaderLayoutProps } from './types'

const isWeb = Platform.OS === 'web'

export const useHeaderOffsetOptions = (
  headerRelation: ScrollHeaderLayoutProps['headerRelation'] = 'none',
  refreshing?: boolean
) => {
  const { top: safeAreaTop } = useSafeAreaInsets()

  const offset = headerRelation === 'offset' ? dimensions.topBarHeight + safeAreaTop : 0

  let refreshControlOffset = 0
  switch (headerRelation) {
    case 'offset':
      refreshControlOffset = dimensions.topBarHeight + safeAreaTop
      break
    case 'overlap':
      refreshControlOffset = isWeb ? 0 : safeAreaTop
      break
    case 'none':
      refreshControlOffset = 0
  }

  // Mobile specific styles to handle refresh control offset
  const refreshControlStyle = useAnimatedStyle(() => ({
    paddingTop: headerRelation === 'overlap' && refreshing ? safeAreaTop : 0,
  }))

  return { offset, refreshControlOffset, refreshControlStyle }
}
