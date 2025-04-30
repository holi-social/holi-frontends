import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'

describe('buildTopicAndSkillsEmbedding', () => {
  const topics = ['arts-culture', 'disaster-relief']
  const skills = ['building-handicraft', 'emergency-care']
  const embeddingLength = ALL_TOPICS.length + ALL_SKILLS.length

  it('should create correct embedding vector', () => {
    const expected = [
      0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]

    const actual = buildTopicsAndSkillsEmbedding({ topics, skills })

    expect(actual).toEqual(expected)
  })

  it('should create correct embedding vector with all 1s', () => {
    const expected = Array.from({ length: embeddingLength }).fill(1)

    const actual = buildTopicsAndSkillsEmbedding({ topics: ALL_TOPICS, skills: ALL_SKILLS })

    expect(actual).toEqual(expected)
  })

  it('should handle missing lists and fill embedding vector with 0s', () => {
    const expected = Array.from({ length: embeddingLength }).fill(0)

    const actual = buildTopicsAndSkillsEmbedding()

    expect(actual).toEqual(expected)
  })
})
