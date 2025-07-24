import { faker } from '@faker-js/faker'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import { TypesenseDocumentType, type LocalizedTypesenseDocument } from '@holi/core/typesense/types'

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
    organizer_url: organizer ? faker.internet.url() : undefined,
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

export const makeVolunteeringDocuments = (length: number): LocalizedTypesenseDocument[] =>
  Array.from({ length }, () => makeVolunteeringDocument({ organizer: false, commitment_label: 'recurring' }))
