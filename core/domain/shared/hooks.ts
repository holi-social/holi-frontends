import { useQuery } from '@apollo/client'

import { skillsQuery, topicsQuery } from '@holi/core/domain/shared/queries'
import { Skill, SkillsQueryResult, Topic, TopicsQueryResult } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'

export const useTopics = (): { topics: readonly Topic[]; topicsLoading: boolean } => {
  const { loading: topicsLoading, data: topicsData } = useQuery<TopicsQueryResult>(topicsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load topics', {
        location: 'domain/shared/hooks/useTopics',
      }),
  })
  return {
    topics: topicsData?.topics.data || [],
    topicsLoading,
  }
}

export const useDefaultTopics = (): { defaultTopics: Topic[]; defaultTopicsLoading: boolean } => {
  const { topics, topicsLoading } = useTopics()
  const defaultTopics = topics.filter((topic) => topic.isDiscoverSpacesDefault)
  return {
    defaultTopics,
    defaultTopicsLoading: topicsLoading,
  }
}

export const useSkills = (): { skills: readonly Skill[]; skillsLoading: boolean } => {
  const { loading: skillsLoading, data: skillsData } = useQuery<SkillsQueryResult>(skillsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load skills', {
        location: 'domain/shared/hooks/useSkills',
      }),
  })
  return {
    skills: skillsData?.skills.data || [],
    skillsLoading,
  }
}
