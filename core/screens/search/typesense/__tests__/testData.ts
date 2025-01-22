import type { SearchHitData } from '@holi/core/screens/search/typesense/types'
import type { Hit } from 'instantsearch.js'
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

export const volunteeringHit: Hit<SearchHitData> = {
  type: 'volunteering',
  id: 'volunteering_157403',
  title_de: 'Freiwilligenarbeit in Berlin',
  title_en: 'Volunteering in Berlin',
  description_de: 'Hilf deiner Gemeinschaft als Freiwilliger.',
  description_en: 'Help your community through volunteering.',
  location: 'Berlin',
  location_lat_lng: [52.52, 13.405],
  image_url: 'https://example.com/image1.jpg',
  link_locators: {
    volunteering: 157403,
  },
  __position: 0,
  __queryID: '1',
  objectID: '1',
}

export const profileHit: Hit<SearchHitData> = {
  type: 'profile',
  id: '2',
  user_full_name: 'Max Mustermann',
  image_url: 'https://example.com/image2.jpg',
  link_locators: {
    profile: '9035322c-3d67-46ca-a2b8-657be490ec00',
  },
  __position: 1,
  __queryID: '1',
  objectID: '2',
}

export const spaceHit: Hit<SearchHitData> = {
  type: 'space',
  id: '3',
  title_de: 'Coworking Space in Mitte',
  title_en: 'Coworking Space in Mitte',
  description_de: 'Arbeite in einem kreativen Raum.',
  description_en: 'Work in a creative space.',
  location: 'Mitte, Berlin',
  location_lat_lng: [52.53, 13.4],
  image_url: 'https://example.com/image3.jpg',
  link_locators: {
    space: 'coworking-mitte',
  },
  __position: 2,
  __queryID: '1',
  objectID: '3',
}
