import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import type { OnRouteChangeCallback } from './types'

export const useRouteChange = (onRouteChange: OnRouteChangeCallback) => {
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', onRouteChange)

    return unsubscribe
  }, [navigation, onRouteChange])
}
