import { Typesense_DocumentType } from '@holi/api/graphql/graphql-codegen'
import type { TypesenseDocument, TypesenseDocumentTypeEnum } from '@holi/core/typesense/types'

export const linkFromLocator = (
  type: TypesenseDocumentTypeEnum,
  locs: TypesenseDocument['link_locators'] = {}
): string => {
  switch (type) {
    case Typesense_DocumentType.Volunteering:
      if ('volunteering' in locs && !!locs['volunteering']) {
        return `/volunteering/${locs['volunteering']}`
      }
      break
    case Typesense_DocumentType.Profile:
      if ('profile' in locs && !!locs['profile']) {
        return `/profile/${locs['profile']}`
      }
      break
    case Typesense_DocumentType.Space:
      if ('space' in locs && !!locs['space']) {
        return `/spaces/${locs['space']}`
      }
      break
    case Typesense_DocumentType.Task:
      if ('space' in locs && !!locs['space'] && 'task' in locs && !!locs['task']) {
        return `/spaces/${locs['space']}/tasks/${locs['task']}`
      }
      break
    case Typesense_DocumentType.Donation:
      if ('donation' in locs && !!locs['donation']) {
        return `/donations/${locs['donation']}`
      }
      break
  }
  return '#'
}
