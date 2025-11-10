import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import { useCallback } from 'react'

import { initialScreenOptions } from './initOptions'
import { NavigationCustomOptions } from './types'

const screenOptions = makeVar<NavigationCustomOptions>(initialScreenOptions)
export const useScreenOptions = () => useReactiveVar(screenOptions)
export const useSetScreenOptions = () => {
  // !!!important: return function bellow should return nothing (void-function)
  return useCallback((options: NavigationCustomOptions): void => {
    screenOptions(options)
  }, [])
}
