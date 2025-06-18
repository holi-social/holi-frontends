import '@holi/core/components/Screen/mock'
import { act, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { makeEngagements } from '@holi-apps/volunteering/__tests__/helpers/generators'
import {
  SimilarVolunteeringSliderDocument,
  type SimilarVolunteeringSliderQuery,
  type SimilarVolunteeringSliderQueryVariables,
} from '@holi/api/graphql/graphql-codegen'
import { VolunteeringSimilarRecosLegacy } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosLegacy'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockEngagementId = '123'

const mockNoSimilarRecoQueries: MockedResponse<
  SimilarVolunteeringSliderQuery,
  SimilarVolunteeringSliderQueryVariables
> = {
  request: {
    query: SimilarVolunteeringSliderDocument,
    variables: {
      offset: 0,
      limit: 4,
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

const mockSimilarRecoQueriesEngagements = makeEngagements(
  5
) as SimilarVolunteeringSliderQuery['appVolunteering_similarRecommendations']['data']

const mockSimilarRecoQueries: MockedResponse<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables> =
  {
    request: {
      query: SimilarVolunteeringSliderDocument,
      variables: {
        offset: 0,
        limit: 4,
        id: mockEngagementId,
      },
    },
    result: {
      data: {
        appVolunteering_similarRecommendations: {
          data: mockSimilarRecoQueriesEngagements,
          totalResults: mockSimilarRecoQueriesEngagements.length,
        },
      },
    },
  }

describe('VolunteeringSimilarRecosLegacy', () => {
  describe('given no similar recommendations', () => {
    it('does not display similar recommendations', async () => {
      render(
        <MockedProvider
          addTypename={false}
          mocks={[mockNoSimilarRecoQueries]}
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' },
          }}
        >
          <VolunteeringSimilarRecosLegacy engagementId={mockEngagementId} />
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
      render(
        <MockedProvider
          mocks={[mockSimilarRecoQueries]}
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' },
          }}
          addTypename={false}
        >
          <VolunteeringSimilarRecosLegacy engagementId={mockEngagementId} />
        </MockedProvider>
      )

      await act(async () => {
        await waitFor(() => {
          expect(screen.getByText('recommendation.slider.title')).toBeOnTheScreen()
          expect(screen.queryAllByTestId('volunteering-reco-card')).toHaveLength(4)
        })
      })
    })
  })

  it('should register refetching recos on pull-to-refresh', async () => {
    jest.useFakeTimers()
    render(
      <MockedProvider
        addTypename={false}
        mocks={[mockNoSimilarRecoQueries]}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <VolunteeringSimilarRecosLegacy engagementId={mockEngagementId} />
      </MockedProvider>
    )

    await act(() => jest.runOnlyPendingTimersAsync())

    expect(mockUseOnRefresh).toHaveBeenCalledWith(expect.any(Function))
    jest.useRealTimers()
  })
})
