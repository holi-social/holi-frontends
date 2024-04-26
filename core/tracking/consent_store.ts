import AsyncStore from '@react-native-async-storage/async-storage'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { Consent, ConsentState, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

const STORE_KEY = 'HOLI_TRACKING_CONSENT'

const defaultState = {
  [TrackingPurpose.Analytics]: Consent.Unknown,
  [TrackingPurpose.Personalization]: Consent.Unknown,
}

const load = (): Promise<ConsentState> => {
  return AsyncStore.getItem(STORE_KEY)
    .then((value) => {
      logger.debug('consentStore.load', 'value=%s', value)
      if (value) return JSON.parse(value) as ConsentState
      else {
        return store(defaultState).then(() => defaultState)
      }
    })
    .catch((e) => {
      logError(e, 'Error reading from AsyncStorage', { location: 'ConsentStore' })
      throw e
    })
}

const store = (consentState: ConsentState): Promise<void> => {
  logger.debug('consentStore.store', 'consentState=%s', consentState)
  return AsyncStore.setItem(STORE_KEY, JSON.stringify(consentState)).catch((e) => {
    logError(e, 'Error storing to AsyncStorage', { location: 'ConsentStore' })
    throw e
  })
}

const clear = async (): Promise<void> => {
  await AsyncStore.removeItem(STORE_KEY).catch((e) => {
    logger.debug('consentStore.clear', 'clearing store')
    logError(e, 'Error clearing AsyncStorage', { location: 'ConsentStore' })
    throw e
  })
}

export const consentStore = {
  load,
  store,
  clear,
}
