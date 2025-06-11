import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'

import { useNavigation } from 'expo-router'

import { initialScreenOptions } from './initOptions'
import { NavigationCustomOptions } from './types'

const screenOptions = makeVar<NavigationCustomOptions>(initialScreenOptions)
export const useScreenOptions = () => useReactiveVar(screenOptions)
export const useSetScreenOptions = () => {
  const navigation = useNavigation()

  return useCallback(
    (options: NavigationCustomOptions) => {
      navigation.setOptions(options)
      screenOptions(options)
    },
    [navigation]
  )
}
