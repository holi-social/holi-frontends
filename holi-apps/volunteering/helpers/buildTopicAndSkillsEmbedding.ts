import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'

export const buildTopicsAndSkillsEmbedding = ({
  skills = [],
  topics = [],
}: { skills?: string[]; topics?: string[] } = {}) => [
  ...ALL_TOPICS.map((topic) => (topics?.includes(topic) ? 1 : 0)),
  ...ALL_SKILLS.map((skill) => (skills?.includes(skill) ? 1 : 0)),
]
