import type { TypesenseDocumentLinkLocatorIdOrSlug, TypesenseDocumentType } from '@holi/core/typesense/types'

export const linkFromLocator = (
  type: TypesenseDocumentType,
  locs: Partial<Record<TypesenseDocumentType, TypesenseDocumentLinkLocatorIdOrSlug>>
): string => {
  switch (type) {
    case 'volunteering':
      if ('volunteering' in locs && !!locs['volunteering']) {
        return `volunteering/${locs['volunteering']}`
      }
      break
    case 'profile':
      if ('profile' in locs && !!locs['profile']) {
        return `profile/${locs['profile']}`
      }
      break
    case 'space':
      if ('space' in locs && !!locs['space']) {
        return `spaces/${locs['space']}`
      }
      break
    case 'task':
      if ('space' in locs && !!locs['space'] && 'task' in locs && !!locs['task']) {
        return `spaces/${locs['space']}/tasks/${locs['task']}`
      }
  }
  return '#'
}
