import { challengeAppBaseUrl } from '@holi/core/helpers/config'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const appRoute = '/apps/challenges'

export const createInAppChallengesPath = (path?: string, extraParams?: Record<string, string>) => {
  if (!path) {
    return appRoute
  }
  const params = new URLSearchParams()
  params.set('path', path)
  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      params.set(key, value)
    })
  }
  return `${appRoute}?${params.toString()}`
}

const PROMO_SEEN_PREFIX = 'promoSeen_'

export async function setHasSeen(challengeId: string) {
  await AsyncStorage.setItem(`${PROMO_SEEN_PREFIX}${challengeId}`, 'true')
}

export async function handlePromoState(challengeId: string) {
  const key = `${PROMO_SEEN_PREFIX}${challengeId}`
  const hasSeen = await AsyncStorage.getItem(key)

  if (hasSeen === 'true') {
    return false
  }
  return true
}

export async function appendShowPromo(url: string, challengeId: string) {
  const [base, query = ''] = url.split('?')
  const params = new URLSearchParams(query)
  const showPromo = await handlePromoState(challengeId)

  params.set('showPromo', showPromo.toString())

  return `${base}?${params.toString()}`
}

export async function removeShowPromoKey(challengeId?: string) {
  if (challengeId) {
    const key = `${PROMO_SEEN_PREFIX}${challengeId}`
    await AsyncStorage.removeItem(key)
    // Verify removal
    const check = await AsyncStorage.getItem(key)

    if (check !== null) {
      // Force remove specific key if still exists
      await AsyncStorage.removeItem(key)
    }
  } else {
    // Clear all promo keys
    const allKeys = await AsyncStorage.getAllKeys()
    const promoKeys = allKeys.filter((key) => key.startsWith(PROMO_SEEN_PREFIX))
    await AsyncStorage.multiRemove(promoKeys)
  }
  return true
}

const preparePath = (path?: string) => {
  const decodedPath = path ? decodeURIComponent(path) : ''
  const delimiter = decodedPath.startsWith('/') ? '' : '/'

  return delimiter + decodedPath
}

export const createExternalChallengesPath = (path?: string) => {
  return challengeAppBaseUrl + preparePath(path)
}

export const challengesPathWithSessionTransfer = (path?: string) => {
  return '/api/challenges/session-to-jwt' + preparePath(path)
}

export const apiUrl = (path: string) => {
  if (Platform.OS === 'web') {
    return `/api/challenges${path}`
  } else {
    return `${challengeAppBaseUrl}${path}`
  }
}
