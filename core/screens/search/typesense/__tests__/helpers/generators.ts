import { faker } from '@faker-js/faker'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'

export const makeHit = (overrides: Partial<SearchHitData> = {}): SearchHitData => ({
  ...{
    type: 'volunteering',
    id: faker.string.uuid(),
    title_de: faker.lorem.sentence({ min: 1, max: 20 }),
    title_en: faker.lorem.sentence({ min: 1, max: 20 }),
    description_de: faker.lorem.sentence({ min: 0, max: 200 }),
    description_en: faker.lorem.sentence({ min: 0, max: 200 }),
    location: faker.location.city(),
    location_lat_lng: [faker.location.latitude(), faker.location.longitude()],
    image_url: faker.image.url(),
    link_locators: {
      volunteering: faker.string.uuid(),
    },
  },
  ...overrides,
})
