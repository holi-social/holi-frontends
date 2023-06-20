import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'

import { initialScreenOptions } from './initOptions'
import { NavigationCustomOptions } from './types'

const screenOptions = makeVar<NavigationCustomOptions>(initialScreenOptions)
export const useScreenOptions = () => useReactiveVar(screenOptions)
export const useSetScreenOptions = () => {
  const { setOptions } = useNavigation()

  return useCallback(
    (options: NavigationCustomOptions) => {
      setOptions(options)
      screenOptions(options)
    },
    [setOptions]
  )
}
