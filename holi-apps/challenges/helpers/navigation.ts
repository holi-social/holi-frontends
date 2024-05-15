import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'

const appRoute = HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.CHALLENGES].path

export const createChallengesPath = (path: string) => {
  if (!path) {
    return appRoute
  }
  return `${appRoute}?path=${encodeURIComponent(path)}`
}
