import { useQuery } from '@apollo/client'

import { topicsQuery } from '@holi/core/domain/shared/queries'
import { Skill, Term, Topic, TopicsQueryResult } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

import { VolunteeringRecosV1QueryVariables } from '@holi-apps/volunteering/queries'

const useDefaultTopics = (): { defaultTopics: Topic[]; defaultTopicsLoading: boolean } => {
  const { loading: defaultTopicsLoading, data: topicsData } = useQuery<TopicsQueryResult>(topicsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load topics', {
        location: 'VolunteeringRecosV1.useDefaultTopics',
      }),
  })
  const defaultTopics = (topicsData?.topics.data || []).filter((topic) => topic.isDiscoverSpacesDefault)
  return {
    defaultTopics,
    defaultTopicsLoading,
  }
}

interface VolunteeringRecosV1Parameters {
  topics?: Topic[]
  skills?: Skill[]
  geolocationId?: string
  loading?: boolean
}

const useRecosV1Parameters = (): VolunteeringRecosV1Parameters => {
  const { user, isLoggedIn } = useLoggedInUser()
  const { defaultTopics, defaultTopicsLoading } = useDefaultTopics()

  if (isLoggedIn) {
    if (!user /* = isLoading */) {
      return {
        loading: true,
      }
    } else {
      const hasInterests = !!user.interests?.length
      const hasSkills = !!user.skills?.length
      if (hasInterests || hasSkills) {
        return {
          topics: user.interests,
          skills: user.skills,
          geolocationId: user.geolocationId,
        }
      } else {
        return {
          topics: defaultTopics,
          loading: defaultTopicsLoading,
          geolocationId: user.geolocationId,
        }
      }
    }
  }
  return {
    topics: defaultTopics,
    loading: defaultTopicsLoading,
  }
}

export const useVolunteeringRecosV1QueryVariables = (): {
  queryVariables: VolunteeringRecosV1QueryVariables
  loading?: boolean
} => {
  const parameters = useRecosV1Parameters()

  return {
    loading: parameters.loading,
    queryVariables: {
      topics: parameters.topics?.map((term: Term) => term.slug),
      skills: parameters.skills?.map((term: Term) => term.slug),
      geolocationId: parameters.geolocationId,
    },
  }
}
