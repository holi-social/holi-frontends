import { useEffect, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

const isSSR = typeof window === 'undefined' || Platform.OS === 'web'

const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect

export default useIsomorphicLayoutEffect
