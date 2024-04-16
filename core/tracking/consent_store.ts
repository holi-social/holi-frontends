import { ReactiveVar, makeVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Tracking')

export enum ConsentState {
  Unknown = 'unknown', // TODO can we remove this state or Loading for simplicity?
  Given = 'given',
  Denied = 'denied',
}

const parseConsentState = (str: string): ConsentState => {
  if (Object.values(ConsentState).includes(str as ConsentState)) {
    return str as ConsentState
  } else {
    throw new Error(`Invalid enum value: ${str}`)
  }
}

const STORE_KEY = 'HOLI_TRACKING_CONSENT'

const consentStateCache: ReactiveVar<ConsentState> = makeVar<ConsentState>(ConsentState.Unknown)

const loadTrackingConsentFromUserProfile = (): Promise<ConsentState> => {
  // TODO replace dummy implementation
  return loadTrackingConsentFromAsyncStore()
}

const storeTrackingConsentOnUserProfile = (state: ConsentState): Promise<void> => {
  // TODO replace dummy implementation
  return storeTrackingConsentToAsyncStore(state)
}

const loadTrackingConsentFromAsyncStore = (): Promise<ConsentState> => {
  return AsyncStore.getItem(STORE_KEY).then((value) => {
    logger.debug('loadTrackingConsentFromAsyncStore', 'value=%s', value)
    if (value) return parseConsentState(value)
    else return ConsentState.Unknown
  })
}

const storeTrackingConsentToAsyncStore = (state: ConsentState): Promise<void> => {
  return AsyncStore.setItem(STORE_KEY, state.valueOf())
}

const getConsent = async (isLoggedIn: boolean): Promise<ConsentState> => {
  const state = consentStateCache()
  if (state == ConsentState.Given || state == ConsentState.Denied) {
    return Promise.resolve(state)
  } else {
    const loaded = await (isLoggedIn ? loadTrackingConsentFromUserProfile() : loadTrackingConsentFromAsyncStore())
    consentStateCache(loaded)
    return loaded
  }
}

const giveConsent = (isLoggedIn: boolean): Promise<void> => {
  const state = ConsentState.Given
  const store = isLoggedIn ? storeTrackingConsentOnUserProfile : storeTrackingConsentToAsyncStore
  return store(state)
    .catch((e) => logError(e, 'Error storing to AsyncStorage', { location: 'ConsentStore' }))
    .then(() => {
      consentStateCache(state)
    })
}

const denyConsent = (isLoggedIn: boolean): Promise<void> => {
  const state = ConsentState.Denied
  const store = isLoggedIn ? storeTrackingConsentOnUserProfile : storeTrackingConsentToAsyncStore
  return store(state)
    .catch((e) => logError(e, 'Error storing to AsyncStorage', { location: 'ConsentStore' }))
    .then(() => {
      consentStateCache(state)
    })
}

const clear = (): Promise<void> => {
  return AsyncStore.removeItem(STORE_KEY)
    .catch((e) => logError(e, 'Error clearing AsyncStorage', { location: 'ConsentStore' }))
    .then(() => {
      consentStateCache(ConsentState.Unknown)
    })
}

export const consentStore = {
  getConsent,
  giveConsent,
  denyConsent,
  clear,
}
