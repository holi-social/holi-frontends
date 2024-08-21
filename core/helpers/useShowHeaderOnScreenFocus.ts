import { useCallback } from 'react'
import { Platform } from 'react-native'
import { withTiming } from 'react-native-reanimated'

import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import { useHeaderAnimationProgress } from '@holi/core/helpers/useHeaderAnimationProgress'

/**
 * NOTICE: use this hook if you want to reset the header progress when the screen is focused
 * and you DO NOT use `ScrollHeaderLayout` on this screen. `ScrollHeaderLayout` doest it automatically.
 */
export const useShowHeaderOnScreenFocus = () => {
  const headerAnimationProgress = useHeaderAnimationProgress()

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') return

      headerAnimationProgress.value = withTiming(1)
    }, [headerAnimationProgress])
  )
}
