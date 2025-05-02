import React from 'react'
import { VolunteeringSimilarRecosTypesense } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosTypesense'
import { render, screen } from '@testing-library/react-native'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { logError } from '@holi/core/errors/helpers'

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockLogError = jest.mocked(logError)
jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const createEngagementHits = (length: number): SearchResponseHit<TypesenseDocument>[] =>
  Array.from(
    { length },
    (_, i) =>
      ({
        document: {
          id: i.toString(),
          type: 'volunteering',
          title_de: `Titel ${i}`,
          description_de: '',
          external_url: `https://example.com/engagement${i}`,
          source: 'Aktion Mensch',
        },
      }) as SearchResponseHit<TypesenseDocument>
  )

describe('VolunteeringSimilarRecosTypesense', () => {
  const mockDocumentId = 'volunteering_123'
  const emptyState = {
    isLoading: false,
    hits: [],
    totalResults: 0,
    totalNrOfPages: 0,
    canFetchMore: false,
    currentPage: 1,
    parameters: {},
  }

  it('should query recommendations with correct parameters', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isFetchingMore: false,
      state: emptyState,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringSimilarRecosTypesense documentId={mockDocumentId} />)

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by: 'type:=[volunteering,task]',
        sort_by: '_vector_distance:asc',
        per_page: 4,
        vector_query: 'similarity_embedding:([],id:volunteering_123)',
      },
      onError: expect.any(Function),
    })
  })

  it('logs error if fetching recos fails', () => {
    const testError = new Error('Test')
    mockUseTypesensePaginationQuery.mockImplementation(({ onError }) => {
      onError?.(testError)
      return {
        isFetchingMore: false,
        state: emptyState,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
      }
    })

    render(<VolunteeringSimilarRecosTypesense documentId={mockDocumentId} />)

    expect(mockLogError).toHaveBeenCalledWith(testError, 'Error retrieving similar recommendations', {
      location: 'VolunteeringSimilarRecosTypesense.useTypesensePaginationQuery',
    })
  })

  it('should display nothing if there are no recommendations', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isFetchingMore: false,
      state: emptyState,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringSimilarRecosTypesense documentId={mockDocumentId} />)

    expect(screen.queryByText('recommendation.slider.title')).not.toBeOnTheScreen()
  })

  it('should display similar recommendations', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isFetchingMore: false,
      state: {
        isLoading: false,
        hits: createEngagementHits(5),
        totalResults: 5,
        totalNrOfPages: 1,
        canFetchMore: false,
        currentPage: 1,
        parameters: {},
      },
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringSimilarRecosTypesense documentId={mockDocumentId} />)

    expect(screen.getByText('recommendation.slider.title')).toBeOnTheScreen()
    expect(screen.queryAllByTestId('volunteering-reco-slider-card')).toHaveLength(4)
  })

  it('should register fetching recos on pull-to-refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      refetch,
      isFetchingMore: false,
      state: emptyState,
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringSimilarRecosTypesense documentId={mockDocumentId} />)

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })
})
