import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import { useCallback } from 'react'

import { useNavigation } from 'expo-router'

import { initialScreenOptions } from './initOptions'
import type { NavigationCustomOptions } from './types'
import { getLogger } from '@holi/core/helpers/logging'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'
import { Platform } from 'react-native'
import type { Themes } from 'holi-bricks/main'

export const getStatusBarStyle = (
  { statusBarStyle }: NavigationCustomOptions = {},
  themeName?: keyof Themes // AvailableThemes
): NavigationCustomOptions['statusBarStyle'] => {
  const style = statusBarStyle ?? themeName
  // Android requires inverted style
  const androidStyle = style === 'light' ? 'dark' : 'light'
  return Platform.OS === 'ios' && style ? style : androidStyle
}

const screenOptions = makeVar<NavigationCustomOptions>(initialScreenOptions)
export const useScreenOptions = () => useReactiveVar(screenOptions)
export const useSetScreenOptions = () => {
  const navigation = useNavigation()
  const { getActiveThemeName } = useBricks()
  const themeName = getActiveThemeName()

  return useCallback(
    (options: NavigationCustomOptions) => {
      const fullOptions = {
        statusBarStyle: getStatusBarStyle(options, themeName),
        statusBarHidden: false,
        ...options,
      }
      if (navigation && navigation.isFocused && navigation.isFocused()) {
        try {
          navigation.setOptions(fullOptions)
          screenOptions(fullOptions)
        } catch (error) {
          getLogger('useSetScreenOptions').debug(String(error), 'Failed to set navigation options')
          screenOptions(fullOptions)
        }
      } else {
        screenOptions(fullOptions)
      }
    },
    [navigation, themeName]
  )
}
