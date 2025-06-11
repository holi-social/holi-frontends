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

export async function handlePromoState() {
  const key = 'promoSeen'
  const hasSeen = await AsyncStorage.getItem(key)

  if (!hasSeen || hasSeen === 'false') {
    await AsyncStorage.setItem(key, 'true')

    return true
  }

  return false
}

export async function appendShowPromo(url: string) {
  const [base, query = ''] = url.split('?')
  const params = new URLSearchParams(query)
  const showPromo = await handlePromoState()

  params.set('showPromo', showPromo.toString())

  return `${base}?${params.toString()}`
}

export async function removeShowPromoKey() {
  const key = 'promoSeen'
  await AsyncStorage.removeItem(key)
  // Verify removal
  const check = await AsyncStorage.getItem(key)

  if (check !== null) {
    // Force remove if still exists
    await AsyncStorage.clear()
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
