import type { SearchFilter } from '@holi/core/screens/search/types'

export const isEmptyFilter = (filter: SearchFilter): boolean =>
  !filter.query && (!filter.location || filter.facet === 'profile')
