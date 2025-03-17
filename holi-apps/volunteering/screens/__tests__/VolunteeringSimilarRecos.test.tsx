import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { makeEngagement } from '@holi-apps/volunteering/__tests__/helpers/generators'
import {
  type AppVolunteeringEngagementByIdResponse,
  type AppVolunteeringEngagementByIdVariables,
  type VolunteeringSimilarRecosQueryResponse,
  type VolunteeringSimilarRecosQueryVariables,
  engagementByIdQuery,
  trackEngagementViewMutation,
  volunteeringSimilarRecosQuery,
} from '@holi-apps/volunteering/queries'
import { ExportedForTesting } from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'
import type {
  AppVolunteering_TrackEngagementViewResponse,
  MutationAppVolunteering_TrackEngagementViewArgs,
} from '@holi/api/graphql/graphql-codegen'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'

const mockEngagementId = '123'

const allTopics = ALL_TOPICS.slice(0, 3)
const allSkills = ALL_SKILLS.slice(0, 2)

const mockEngagementDetailQuery: MockedResponse<
  AppVolunteeringEngagementByIdResponse,
  AppVolunteeringEngagementByIdVariables
> = {
  request: {
    query: engagementByIdQuery,
    variables: { id: mockEngagementId },
  },
  result: {
    data: {
      appVolunteering_engagement: {
        ...makeEngagement(allTopics, allSkills),
      },
    },
  },
}

const mockTrackEngagementView: MockedResponse<
  AppVolunteering_TrackEngagementViewResponse,
  MutationAppVolunteering_TrackEngagementViewArgs
> = {
  request: {
    query: trackEngagementViewMutation,
    variables: {
      id: mockEngagementId,
    },
  },
  result: {
    data: {
      id: mockEngagementId,
    },
  },
}

const mockNoSimilarRecoQueries: MockedResponse<
  VolunteeringSimilarRecosQueryResponse,
  VolunteeringSimilarRecosQueryVariables
> = {
  request: {
    query: volunteeringSimilarRecosQuery,
    variables: {
      offset: 0,
      limit: 4,
      id: mockEngagementId,
    },
  },
  result: {
    data: {
      appVolunteering_similarRecommendations: {
        totalResults: 0,
        data: [],
      },
    },
  },
}

const mockSimilarRecoQueriesEngagements = [
  makeEngagement(allTopics, allSkills),
  makeEngagement(allTopics, allSkills),
  makeEngagement(allTopics, allSkills),
  makeEngagement(allTopics, allSkills),
  makeEngagement(allTopics, allSkills),
]

const mockSimilarRecoQueries: MockedResponse<
  VolunteeringSimilarRecosQueryResponse,
  VolunteeringSimilarRecosQueryVariables
> = {
  request: {
    query: volunteeringSimilarRecosQuery,
    variables: {
      offset: 0,
      limit: 4,
      id: mockEngagementId,
    },
  },
  result: {
    data: {
      appVolunteering_similarRecommendations: {
        totalResults: mockSimilarRecoQueriesEngagements.length,
        data: mockSimilarRecoQueriesEngagements,
      },
    },
  },
}

jest.mock('@holi/core/navigation/hooks/useParam')

describe('VolunteeringEngagementDetail', () => {
  describe('given no similar recommendations', () => {
    it('does not display similar recommendations', async () => {
      mockParameters({ engagementId: mockEngagementId })
      // just check base case that labels are rendered at all
      // more specific tests and assertions on labels: see VolunteeringLabels (test)
      render(
        <MockedProvider mocks={[mockEngagementDetailQuery, mockNoSimilarRecoQueries, mockTrackEngagementView]}>
          <ExportedForTesting.UnwrappedVolunteeringEngagementDetail />
        </MockedProvider>
      )
      expect(screen.queryByText('engagementDetail.similarRecosHeading')).not.toBeOnTheScreen()
    })
  })
  describe('given similar recommendations', () => {
    it('does display similar recommendations', async () => {
      mockParameters({ engagementId: mockEngagementId })
      // just check base case that labels are rendered at all
      // more specific tests and assertions on labels: see VolunteeringLabels (test)
      render(
        <MockedProvider mocks={[mockEngagementDetailQuery, mockSimilarRecoQueries, mockTrackEngagementView]}>
          <ExportedForTesting.UnwrappedVolunteeringEngagementDetail />
        </MockedProvider>
      )
      await waitFor(() => expect(screen.queryByText('engagementDetail.similarRecosHeading')).toBeOnTheScreen())
      expect(screen.queryAllByTestId('volunteering-reco-slider-card')).not.toHaveLength(0)
    })
  })
})
