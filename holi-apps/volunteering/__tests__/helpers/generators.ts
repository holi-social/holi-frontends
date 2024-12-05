import { faker } from '@faker-js/faker'
import { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'
import { Skill, Topic } from '@holi/core/domain/shared/types'

export const makeEngagement = (
  topics: Topic[],
  skills: Skill[],
  { location = true, organizer = true }: { location?: boolean; organizer?: boolean } = {}
): VolunteeringEngagement & { __typename: 'AppVolunteering_Engagement' } => {
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
    topics: topics.map((t) => t.slug),
    skills: skills.map((t) => t.slug),
    __typename: 'AppVolunteering_Engagement',
  }
}

export const makeReco = (
  topics: Topic[],
  skills: Skill[],
  { location = true, organizer = true }: { location?: boolean; organizer?: boolean } = {}
): VolunteeringReco => ({
  engagement: {
    ...makeEngagement(topics, skills, { location, organizer }),
  },
  matchedTopics: topics.map((t) => t.slug),
  matchedSkills: skills.map((s) => s.slug),
})
