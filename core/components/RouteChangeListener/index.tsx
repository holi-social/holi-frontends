import { useNavigation } from '@react-navigation/native'

import { callAllCallbacks } from './callbacks'

function RouteChangeListener() {
  const navigation = useNavigation()

  navigation.addListener('state', callAllCallbacks)

  return null
}

export default RouteChangeListener
