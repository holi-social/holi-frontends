import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import { useCallback } from 'react'
import { useNavigation } from 'expo-router'
import { initialScreenOptions } from './initOptions'
import type { NavigationCustomOptions } from './types'
import { getLogger } from '@holi/core/helpers/logging'

const screenOptions = makeVar<NavigationCustomOptions>(initialScreenOptions)
export const useScreenOptions = () => useReactiveVar(screenOptions)
export const useSetScreenOptions = () => {
  const navigation = useNavigation()

  return useCallback(
    (options: NavigationCustomOptions) => {
      if (navigation && navigation.isFocused && navigation.isFocused()) {
        try {
          navigation.setOptions(options)
          screenOptions(options)
        } catch (error) {
          getLogger('useSetScreenOptions').debug(String(error), 'Failed to set navigation options')
          screenOptions(options)
        }
      } else {
        screenOptions(options)
      }
    },
    [navigation]
  )
}
