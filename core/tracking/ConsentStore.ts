import AsyncStorage from '@react-native-async-storage/async-storage'

import { logError } from '@holi/core/errors/helpers'
import { ConsentState } from '@holi/core/tracking/types'

const STORE_KEY = 'HOLI_TRACKING_CONSENT'
const DEFAULT_STATE = ConsentState.unknown

const load = (): Promise<ConsentState> => {
  return AsyncStorage.getItem(STORE_KEY)
    .then((value) => {
      if (value) return JSON.parse(value) as ConsentState
      else return store(DEFAULT_STATE)
    })
    .catch((e) => {
      logError(e, 'Error reading from AsyncStorage, assuming broken state, resetting', { location: 'ConsentStore' })
      return clear().then(() => store(ConsentState.unknown))
    })
}

const store = (consentState: ConsentState): Promise<ConsentState> => {
  return AsyncStorage.setItem(STORE_KEY, JSON.stringify(consentState))
    .then(() => consentState)
    .catch((e) => {
      logError(e, 'Error storing to AsyncStorage', { location: 'ConsentStore' })
      throw e
    })
}

const clear = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORE_KEY)
    .catch((e) => {
      logError(e, 'Error clearing AsyncStorage', { location: 'ConsentStore' })
      throw e
    })
    .then(() => store(DEFAULT_STATE))
}

export const consentStore = {
  load,
  store,
  clear,
}
