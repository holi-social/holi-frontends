import type { useRefinementList } from 'react-instantsearch-core'

export const facets: ReturnType<typeof useRefinementList>['items'] = [
  {
    count: 30691,
    isRefined: false,
    value: 'volunteering',
    label: 'volunteering',
    highlighted: 'volunteering',
  },
  {
    count: 8265,
    isRefined: false,
    value: 'profile',
    label: 'profile',
    highlighted: 'profile',
  },
  {
    count: 5648,
    isRefined: true,
    value: 'space',
    label: 'space',
    highlighted: 'space',
  },
]
