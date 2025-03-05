import { useMutation, useQuery } from '@apollo/client'

import { anonCountQuery, sdgsQuery, skillsQuery, topicsQuery } from '@holi/core/domain/shared/queries'
import type {
  SDG,
  SdgsQueryResult,
  Skill,
  SkillsQueryResult,
  Topic,
  TopicsQueryResult,
} from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { useCallback } from 'react'
import { getLogger } from '@holi/core/helpers/logging'
import type { MutationAnonCountArgs } from '@holi/api/graphql/graphql-codegen'

export const useTopics = (): { topics: readonly Topic[]; topicsLoading: boolean } => {
  const { loading: topicsLoading, data: topicsData } = useQuery<TopicsQueryResult>(topicsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load topics', {
        location: 'domain/shared/hooks/useTopics',
      }),
  })
  const topics = topicsData?.topics.data || []
  return {
    topics,
    topicsLoading: topicsLoading && !topics.length,
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
  const skills = skillsData?.skills.data || []
  return {
    skills,
    skillsLoading: skillsLoading && !skills.length,
  }
}

export const useSDGs = (): { sdgs: readonly SDG[]; sdgsLoading: boolean } => {
  const { loading: sdgsLoading, data: sdgsData } = useQuery<SdgsQueryResult>(sdgsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load SDGs', {
        location: 'domain/shared/hooks/useSDGs',
      }),
  })
  const sdgs = sdgsData?.sdgs.data || []
  return {
    sdgs,
    sdgsLoading: sdgsLoading && !sdgs.length,
  }
}

export type AnonCountFn = (counterName: string) => void

const logger = getLogger('Tracking')

/**
 * Hook returning a function to call the `anonCount` API. Guaranteed to not throw, i.e. intentionally ignores any errors
 * that might occur on server- or client-side. Anonymous counts are intended to be (non-reliable) side effects of user
 * interactions.
 */
export const useAnonCount: () => AnonCountFn = () => {
  const [anonCount] = useMutation<void, MutationAnonCountArgs>(anonCountQuery)
  return useCallback(
    (counterName: string): void => {
      logger.debug('anonCount', counterName)
      // noinspection JSIgnoredPromiseFromCall
      anonCount({
        variables: {
          counterName,
        },
      })
    },
    [anonCount]
  )
}
