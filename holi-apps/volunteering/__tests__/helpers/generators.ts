import { faker } from '@faker-js/faker'
import type { VolunteeringReco } from '@holi-apps/volunteering/types'
import type { VolunteeringByIdQuery } from '@holi/api/graphql/graphql-codegen'

export const makeEngagement = (
  topics: string[],
  skills: string[],
  { location = true, organizer = true }: { location?: boolean; organizer?: boolean } = {}
): VolunteeringByIdQuery['appVolunteering_engagement'] => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(10),
    url: faker.internet.url(),
    imageUrl: faker.image.url(),
    source: faker.lorem.word(),
    organizer: organizer
      ? {
          name: faker.person.fullName(),
          imageUrl: faker.image.url(),
        }
      : undefined,
    location: location ? faker.location.city() : undefined,
    latitude: location ? faker.location.latitude() : undefined,
    longitude: location ? faker.location.longitude() : undefined,
    topicsV2: topics,
    skillsV2: skills,
    __typename: 'AppVolunteering_Engagement',
  }
}

export const makeReco = (
  topics: string[],
  skills: string[],
  { location = true, organizer = true }: { location?: boolean; organizer?: boolean } = {}
): VolunteeringReco => ({
  engagement: {
    ...makeEngagement(topics, skills, { location, organizer }),
  },
  matchedTopicsV2: topics,
  matchedSkillsV2: skills,
})
