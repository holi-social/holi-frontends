import { useEffect } from 'react'

import { useNavigation } from '@react-navigation/native'

import { callAllCallbacks } from './callbacks'

function RouteChangeListener() {
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', callAllCallbacks)
    return unsubscribe
  }, [navigation])

  return null
}

export default RouteChangeListener
