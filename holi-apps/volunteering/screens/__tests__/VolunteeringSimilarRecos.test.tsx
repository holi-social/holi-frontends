import '@holi/core/components/Screen/mock'
import { act, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { makeEngagement } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { VolunteeringEngagementDetail } from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'
import {
  SimilarVolunteeringSliderDocument,
  type SimilarVolunteeringSliderQuery,
  type SimilarVolunteeringSliderQueryVariables,
} from '@holi/api/graphql/graphql-codegen'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import { mockTrackEngagementView } from '@holi-apps/volunteering/__tests__/helpers/mocks'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

jest.mock('@holi/core/navigation/hooks/useParam')

const mockEngagementId = '123'

const allTopics = ALL_TOPICS.slice(0, 3)
const allSkills = ALL_SKILLS.slice(0, 2)

const mockNoSimilarRecoQueries: MockedResponse<
  SimilarVolunteeringSliderQuery,
  SimilarVolunteeringSliderQueryVariables
> = {
  request: {
    query: SimilarVolunteeringSliderDocument,
    variables: {
      offset: 0,
      limit: 10,
      id: mockEngagementId,
    },
  },
  result: {
    data: {
      appVolunteering_similarRecommendations: {
        data: [],
        totalResults: 0,
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
] as SimilarVolunteeringSliderQuery['appVolunteering_similarRecommendations']['data']

const mockSimilarRecoQueries: MockedResponse<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables> =
  {
    request: {
      query: SimilarVolunteeringSliderDocument,
      variables: {
        offset: 0,
        limit: 10,
        id: mockEngagementId,
      },
    },
    result: {
      data: {
        appVolunteering_similarRecommendations: {
          data: mockSimilarRecoQueriesEngagements,
          totalResults: 0,
        },
      },
    },
  }
// totalResults: mockSimilarRecoQueriesEngagements.length,
//         data: mockSimilarRecoQueriesEngagements,
jest.mock('@holi/core/navigation/hooks/useParam')

const mockSearch = jest.fn()
jest.mock('@holi/core/typesense/helpers/createTypesenseClient', () => ({
  createTypesenseClient: () => ({
    search: () => mockSearch(),
  }),
}))

const mockUseFeatureFlag = jest.mocked(useFeatureFlag)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn(),
}))

describe('VolunteeringEngagementDetail', () => {
  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue([true, {}])
    mockSearch.mockResolvedValue({ hits: [{}] })
  })

  describe('given no similar recommendations', () => {
    it('does not display similar recommendations', async () => {
      mockParameters({ engagementId: mockEngagementId })
      // just check base case that labels are rendered at all
      // more specific tests and assertions on labels: see VolunteeringLabels (test)
      render(
        <MockedProvider
          addTypename={false}
          mocks={[mockNoSimilarRecoQueries, mockTrackEngagementView(mockEngagementId)]}
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' },
          }}
        >
          <VolunteeringEngagementDetail />
        </MockedProvider>
      )

      await act(async () => {
        await waitFor(() => {
          expect(screen.queryByText('recommendation.slider.title')).not.toBeOnTheScreen()
        })
      })
    })
  })

  describe('given similar recommendations', () => {
    it('does display similar recommendations', async () => {
      mockParameters({ engagementId: mockEngagementId })
      // just check base case that labels are rendered at all
      // more specific tests and assertions on labels: see VolunteeringLabels (test)
      render(
        <MockedProvider
          mocks={[mockSimilarRecoQueries, mockTrackEngagementView(mockEngagementId)]}
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' },
          }}
          addTypename={false}
        >
          <VolunteeringEngagementDetail />
        </MockedProvider>
      )

      await act(async () => {
        await waitFor(() => {
          expect(screen.getByText('recommendation.slider.title')).toBeOnTheScreen()
          expect(screen.queryAllByTestId('volunteering-reco-slider-card')).not.toHaveLength(0)
        })
      })
    })
  })
})
