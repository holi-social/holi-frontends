// eslint-disable-next-line no-restricted-imports
import type { ContentValue } from '../types'

export const getRouteForContentType = (selectedContentType?: ContentValue | null) => {
  switch (selectedContentType) {
    case 'CHALLENGES':
      return '/act?section=CHALLENGES'
    case 'VOLUNTEERING':
      return '/act?section=VOLUNTEERING'
    case 'SPACES':
      return '/spaces?tab=discover'
    case 'POSTS':
    default:
      return '/'
  }
}
