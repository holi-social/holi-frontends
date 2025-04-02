import { challengeAppBaseUrl } from '@holi/core/helpers/config'
import { Platform } from 'react-native'

const appRoute = '/apps/challenges'

export const createInAppChallengesPath = (path?: string) => {
  if (!path) {
    return appRoute
  }
  return `${appRoute}?path=${encodeURIComponent(path)}`
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
