import { MockedResponse } from '@apollo/client/testing'
import {
  TrackEngagementViewDocument,
  TrackEngagementViewMutation,
  TrackEngagementViewMutationVariables,
} from '@holi/api/graphql/graphql-codegen'

export const mockTrackEngagementView = (
  id: string
): MockedResponse<TrackEngagementViewMutation, TrackEngagementViewMutationVariables> => ({
  request: {
    query: TrackEngagementViewDocument,
    variables: {
      id,
    },
  },
  result: {
    data: {
      appVolunteering_trackEngagementView: {
        id,
      },
    },
  },
})
