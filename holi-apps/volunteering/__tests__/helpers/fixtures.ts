import { faker } from '@faker-js/faker'
import { Skill, Topic } from '@holi/core/domain/shared/types'

export const topic1: Topic = {
  id: faker.string.uuid(),
  title: 'Topic 1',
  slug: 'topic-1',
  isDiscoverSpacesDefault: false,
}

export const topic2: Topic = {
  id: faker.string.uuid(),
  title: 'Topic 2',
  slug: 'topic-2',
  isDiscoverSpacesDefault: false,
}

export const topic3: Topic = {
  id: faker.string.uuid(),
  title: 'Topic 3',
  slug: 'topic-3',
  isDiscoverSpacesDefault: false,
}

export const skill1: Skill = {
  id: faker.string.uuid(),
  title: 'Skill 1',
  slug: 'skill-1',
}

export const skill2: Skill = {
  id: faker.string.uuid(),
  title: 'Skill 2',
  slug: 'skill-2',
}

export const skill3: Skill = {
  id: faker.string.uuid(),
  title: 'Skill 3',
  slug: 'skill-3',
}

export const allTopics: Topic[] = [topic1, topic2, topic3]
export const allSkills: Skill[] = [skill1, skill2, skill3]
