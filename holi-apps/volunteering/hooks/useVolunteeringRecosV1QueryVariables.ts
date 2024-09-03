import { useDefaultTopics } from '@holi/core/domain/shared/hooks'
import { Skill, Term, Topic } from '@holi/core/domain/shared/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

import { VolunteeringRecosV1QueryVariables } from '@holi-apps/volunteering/queries'

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
