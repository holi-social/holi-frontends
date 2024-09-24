import { useDefaultTopics } from '@holi/core/domain/shared/hooks'
import { Skill, Term, Topic } from '@holi/core/domain/shared/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

import { VolunteeringRecosQueryVariables } from '@holi-apps/volunteering/queries'

interface VolunteeringRecosParameters {
  topics?: Topic[]
  skills?: Skill[]
  geolocationId?: string
  loading?: boolean
}

const useVolunteeringRecosParameters = (): VolunteeringRecosParameters => {
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

export const useVolunteeringRecosQueryVariables = (): {
  queryVariables: VolunteeringRecosQueryVariables
  loading?: boolean
} => {
  const parameters = useVolunteeringRecosParameters()

  return {
    loading: parameters.loading,
    queryVariables: {
      topics: parameters.topics?.map((term: Term) => term.slug),
      skills: parameters.skills?.map((term: Term) => term.slug),
      geolocationId: parameters.geolocationId,
    },
  }
}
