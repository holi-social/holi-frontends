import AsyncStore from '@react-native-async-storage/async-storage'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { Consent, ConsentState, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

const STORE_KEY = 'HOLI_TRACKING_CONSENT'

const load = (): Promise<ConsentState> => {
  return AsyncStore.getItem(STORE_KEY)
    .then((value) => {
      logger.debug('loadTrackingConsentFromAsyncStore', 'value=%s', value)
      if (value) return JSON.parse(value) as ConsentState
      else
        return {
          [TrackingPurpose.Analytics]: Consent.Unknown,
          [TrackingPurpose.Personalization]: Consent.Unknown,
        }
    })
    .catch((e) => {
      logError(e, 'Error reading from AsyncStorage', { location: 'ConsentStore' })
      throw e
    })
}

const store = (consentState: ConsentState): Promise<void> => {
  return AsyncStore.setItem(STORE_KEY, JSON.stringify(consentState)).catch((e) => {
    logError(e, 'Error storing to AsyncStorage', { location: 'ConsentStore' })
    throw e
  })
}

const clear = async (): Promise<void> => {
  await AsyncStore.removeItem(STORE_KEY).catch((e) => {
    logError(e, 'Error clearing AsyncStorage', { location: 'ConsentStore' })
    throw e
  })
}

export const consentStore = {
  load,
  store,
  clear,
}
