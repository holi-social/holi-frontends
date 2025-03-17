import type { SearchFilter } from '@holi/core/screens/search/typesense/types'

export const isEmptyFilter = (filter: SearchFilter): boolean =>
  !filter.query && (!filter.location || filter.facet === 'profile')
