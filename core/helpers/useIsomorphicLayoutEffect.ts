import { useEffect, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

const useIsomorphicLayoutEffect = typeof window === 'undefined' || Platform.OS === 'web' ? useEffect : useLayoutEffect

export default useIsomorphicLayoutEffect
