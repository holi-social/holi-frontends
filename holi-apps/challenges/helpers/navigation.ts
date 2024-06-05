import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'

import { challengeAppBaseUrl } from '@holi-apps/challenges/config'

const appRoute = HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.CHALLENGES].path

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
