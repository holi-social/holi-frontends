import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { TopicsQueryResult } from '@holi/core/screens/userprofile/queries'
import { Skill, Term, Topic } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

import VolunteeringUpdatesList from '@holi-apps/volunteering/components/VolunteeringUpdatesList'
import {
  VolunteeringRecosV1QueryResponse,
  VolunteeringRecosV1QueryVariables,
  volunteeringRecosV1Query,
} from '@holi-apps/volunteering/queries'

export const ENGAGEMENT_PAGE_SIZE = 5

type VolunteeringRecosV1Props = {
  style?: StyleProp<ViewStyle>
}

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

const ForTopicsAndSkills: React.FC<VolunteeringRecosV1Props & { topics: Topic[]; skills: Skill[] }> = ({
  style,
  topics,
  skills,
}) => {
  const queryVariables: VolunteeringRecosV1QueryVariables = {
    offset: 0,
    limit: ENGAGEMENT_PAGE_SIZE,
    topics: topics?.map((term: Term) => term.slug),
    skills: skills?.map((term: Term) => term.slug),
  }
  const { data, loading } = useQuery<VolunteeringRecosV1QueryResponse, VolunteeringRecosV1QueryVariables>(
    volunteeringRecosV1Query,
    {
      variables: queryVariables,
      onError: (error) =>
        logError(error, 'Failed to load volunteering engagements', {
          location: 'VolunteeringRecosV1.VolunteeringEngagementsQuery',
        }),
    }
  )
  const reloading = useRefetchOnClientSideForLoggedInWebUser(volunteeringRecosV1Query, {
    variables: queryVariables,
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringRecosV1.VolunteeringEngagementsQuery',
      }),
  })

  const { data: engagements = [] } = data?.appVolunteering_engagementRecommendations || {}

  const engagementsToRender = engagements.slice(0, ENGAGEMENT_PAGE_SIZE)

  return <VolunteeringUpdatesList engagements={engagementsToRender} loading={loading || reloading} style={style} />
}

const ForDefaultTopics: React.FC<VolunteeringRecosV1Props> = ({ style }) => {
  const { defaultTopics, defaultTopicsLoading } = useDefaultTopics()
  if (defaultTopicsLoading) {
    return <VolunteeringUpdatesList loading={true} style={style} engagements={[]} />
  }
  return <ForTopicsAndSkills topics={defaultTopics} skills={[]} style={style} />
}

const VolunteeringRecosV1: React.FC<VolunteeringRecosV1Props> = ({ style }: VolunteeringRecosV1Props) => {
  const { user, isLoggedOut, isLoggedIn } = useLoggedInUser()

  if (isLoggedOut) {
    return <ForDefaultTopics />
  } else if (isLoggedIn) {
    if (!user /* = isLoading */) {
      return <VolunteeringUpdatesList loading={true} style={style} engagements={[]} />
    } else {
      const hasInterests = user.interests !== undefined && user.interests?.length > 0
      const hasSkills = user.skills !== undefined && user?.skills?.length > 0
      if (hasInterests || hasSkills) {
        return <ForTopicsAndSkills topics={user.interests || []} skills={user.skills || []} style={style} />
      } else {
        return <ForDefaultTopics />
      }
    }
  }
}

export default withProfiler(VolunteeringRecosV1, { name: 'VolunteeringRecosV1' })
