import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { allSkills, allTopics } from '@holi-apps/volunteering/__tests__/helpers/fixtures'
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
import { useSkills, useTopics } from '@holi/core/domain/shared/hooks'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'

const mockEngagementId = '123'

jest.mock('react-native-keyboard-controller', () => require('react-native-keyboard-controller/jest'))

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

jest.mock('@holi/core/domain/shared/hooks')
const mockUseTopics = jest.mocked(useTopics)
const mockUseSkills = jest.mocked(useSkills)

describe('VolunteeringEngagementDetail', () => {
  beforeEach(() => {
    mockUseTopics.mockReturnValue({
      topics: allTopics,
      topicsLoading: false,
    })
    mockUseSkills.mockReturnValue({
      skills: allSkills,
      skillsLoading: false,
    })
  })
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
