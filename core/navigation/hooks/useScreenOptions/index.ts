import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
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
