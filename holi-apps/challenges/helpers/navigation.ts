import { challengeAppBaseUrl } from '@holi/core/helpers/config'

const appRoute = '/apps/challenges'

export const createInAppChallengesPath = (path?: string) => {
  if (!path) {
    return appRoute
  }
  return `${appRoute}?path=${encodeURIComponent(path)}`
}

export const createExternalChallengesPath = (path?: string) => {
  const decodedPath = path ? decodeURIComponent(path) : ''
  const delimiter = decodedPath.startsWith('/') ? '' : '/'

  return challengeAppBaseUrl + delimiter + decodedPath
}
