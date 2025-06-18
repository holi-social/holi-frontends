import { faker } from '@faker-js/faker'
import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import { TypesenseDocumentType, type LocalizedTypesenseDocument } from '@holi/core/typesense/types'

export const makeEngagement = ({
  topics = ALL_TOPICS.slice(0, 3),
  skills = ALL_SKILLS.slice(0, 2),
  location = true,
  organizer = true,
}: {
  topics?: string[]
  skills?: string[]
  location?: boolean
  organizer?: boolean
  commitmentLabel?: string
} = {}): VolunteeringEngagement => {
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
    topicsV2: topics,
    skillsV2: skills,
  }
}

export const makeReco = ({
  topics = ALL_TOPICS.slice(0, 3),
  skills = ALL_SKILLS.slice(0, 2),
  location = true,
  organizer = true,
}: {
  topics?: string[]
  skills?: string[]
  location?: boolean
  organizer?: boolean
} = {}): VolunteeringReco => ({
  engagement: makeEngagement({ topics, skills, location, organizer }),
  matchedTopicsV2: topics,
  matchedSkillsV2: skills,
})

export const makeVolunteeringDocument = ({
  topics = ALL_TOPICS.slice(0, 3),
  skills = ALL_SKILLS.slice(0, 2),
  location = true,
  organizer = true,
  commitment_label,
}: {
  topics?: string[]
  skills?: string[]
  location?: boolean
  organizer?: boolean
  commitment_label?: string
} = {}): LocalizedTypesenseDocument => {
  const id = faker.string.uuid()
  return {
    id: `volunteering_${id}`,
    type: TypesenseDocumentType.Volunteering,
    title: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(10),
    external_url: faker.internet.url(),
    image_url: faker.image.url(),
    source: faker.lorem.word(),
    organizer_name: organizer ? faker.person.fullName() : undefined,
    organizer_image_url: organizer ? faker.image.url() : undefined,
    location: location ? faker.location.city() : undefined,
    location_type: location ? 'onsite' : 'unknown',
    commitment_label,
    topics_v2: topics,
    skills_v2: skills,
    link_locators: {
      volunteering: id,
    },
  }
}

export const makeTaskDocument = ({
  topics = ALL_TOPICS.slice(0, 3),
  skills = ALL_SKILLS.slice(0, 2),
  location = true,
  commitment_label,
  commitment_duration,
}: {
  topics?: string[]
  skills?: string[]
  location?: boolean
  commitment_label?: string
  commitment_duration?: string
} = {}): LocalizedTypesenseDocument => {
  const id = faker.string.uuid()
  return {
    id: `task_${id}`,
    type: TypesenseDocumentType.Task,
    title: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(10),
    image_url: faker.image.url(),
    organizer_name: faker.lorem.word(),
    organizer_image_url: faker.image.url(),
    location: location ? faker.location.city() : undefined,
    location_type: location ? 'onsite' : 'remote',
    commitment_label,
    commitment_duration,
    topics_v2: topics,
    skills_v2: skills,
    link_locators: {
      space: faker.lorem.slug(),
      task: id,
    },
  }
}
export const makeEngagements = (length: number): VolunteeringEngagement[] =>
  Array.from({ length }, () => makeEngagement({ organizer: false }))

export const makeVolunteeringDocuments = (length: number): LocalizedTypesenseDocument[] =>
  Array.from({ length }, () => makeVolunteeringDocument({ organizer: false, commitment_label: 'recurring' }))
