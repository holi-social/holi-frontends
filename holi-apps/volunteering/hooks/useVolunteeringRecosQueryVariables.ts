import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

import type { VolunteeringRecosQueryVariables } from '@holi-apps/volunteering/queries'

interface VolunteeringRecosParameters {
  topics?: string[]
  skills?: string[]
  geolocationId?: string
  loading?: boolean
}

const DEFAULT_RECO_TOPICS_V2 = [
  'democracy-politics',
  'human-rights',
  'climate-environment',
  'literacy-education',
  'arts-culture',
  'animal-welfare',
]

export const useVolunteeringRecosParameters = (): VolunteeringRecosParameters => {
  const { user, isLoading: userLoading } = useLoggedInUser()

  if (!user && userLoading) {
    return {
      loading: true,
    }
  } else if (user) {
    const hasInterests = !!user.interestsV2?.length
    const hasSkills = !!user.skillsV2?.length
    if (hasInterests || hasSkills) {
      return {
        topics: user.interestsV2,
        skills: user.skillsV2,
        geolocationId: user.geolocationId,
      }
    } else {
      return {
        topics: DEFAULT_RECO_TOPICS_V2,
        geolocationId: user.geolocationId,
      }
    }
  } else {
    return {
      topics: DEFAULT_RECO_TOPICS_V2,
    }
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
      topics: parameters.topics,
      skills: parameters.skills,
      geolocationId: parameters.geolocationId,
    },
  }
}
