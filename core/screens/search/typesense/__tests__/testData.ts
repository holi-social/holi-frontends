import type { SearchHitData } from '@holi/core/screens/search/typesense/types'

export const volunteeringHit: SearchHitData = {
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
}

export const profileHit: SearchHitData = {
  type: 'profile',
  id: '2',
  user_full_name: 'Max Mustermann',
  image_url: 'https://example.com/image2.jpg',
  link_locators: {
    profile: '9035322c-3d67-46ca-a2b8-657be490ec00',
  },
}

export const spaceHit: SearchHitData = {
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
}
