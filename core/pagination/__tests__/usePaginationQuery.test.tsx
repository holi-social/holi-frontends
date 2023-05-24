import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text, View } from 'react-native'

import { createCache } from '@holi/api/graphql/client'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import usePaginationQuery from '@holi/core/pagination/usePaginationQuery'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import { user } from '@holi/core/screens/spaces/__tests__/testData'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

const pageSize = 20
const totalResults = 50

const insight: Insight = {
  id: '1',
  title: 'Insight title',
  description: 'Insight description',
  datePublished: '',
  creator: user,
  headerImage: '',
  topic: { id: '1', title: 'Topic 1', slug: 'topic1', isDiscoverSpacesDefault: false },
  posts: [],
  numberOfPosts: 0,
  involvedUsers: {
    totalResults: 0,
    data: [],
  },
}

export const createInsightList = (length = 3) =>
  Array.from({ length }, (_, index) => ({
    ...insight,
    id: `insight-${index}`,
    __typename: 'Insight',
  }))

const createPaginationMock = (offset = 0) => ({
  request: {
    query: lastInsightsQuery,
    variables: {
      limit: pageSize,
      offset,
    },
  },
  result: {
    data: {
      lastInsights: {
        totalResults,
        data: createInsightList(Math.min(offset + pageSize, totalResults)).slice(offset),
        __typename: 'InsightPaged',
      },
    },
  },
})

const noResultsMock = {
  request: {
    query: lastInsightsQuery,
    variables: {
      limit: pageSize,
      offset: 0,
    },
  },
  result: {
    data: {
      lastInsights: {
        totalResults: 0,
        data: [],
      },
    },
  },
}

const errorMock = {
  request: {
    query: lastInsightsQuery,
    variables: {
      limit: pageSize,
      offset: 0,
    },
  },
  error: new HoliError('Test error'),
}

const TestComponent: React.FC = () => {
  const { loading, data, error, totalResults, isFetchingMore, canFetchMore, fetchNextPage } =
    usePaginationQuery<Insight>(lastInsightsQuery, {
      queryPath: 'lastInsights',
      pageSize,
    })

  if (loading) {
    return <Text>Loading</Text>
  }
  if (isFetchingMore) {
    return <Text>Fetching more</Text>
  }
  if (error) {
    return <Text>{error.message}</Text>
  }

  return (
    <View>
      <Text>{totalResults} results</Text>
      {data.map((element) => (
        <Text key={element.id} testID="element">
          {element.id}
        </Text>
      ))}
      {canFetchMore && <HoliButtonLoading onPress={fetchNextPage} testID="btn-fetch-more" label={'Fetch more'} />}
    </View>
  )
}

describe('usePaginationQuery', () => {
  it('should expose loading status', async () => {
    render(
      <MockedProvider mocks={[createPaginationMock()]}>
        <TestComponent />
      </MockedProvider>
    )

    expect(screen.findByText('Loading'))
  })

  it('should expose error status', () => {
    render(
      <MockedProvider mocks={[errorMock]}>
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </MockedProvider>
    )

    expect(screen.findByText('Test error'))
  })

  it('should expose total results', () => {
    render(
      <MockedProvider mocks={[noResultsMock]}>
        <TestComponent />
      </MockedProvider>
    )

    expect(screen.findByText('0 results'))
  })

  it('should expose data', async () => {
    render(
      <MockedProvider mocks={[createPaginationMock()]}>
        <TestComponent />
      </MockedProvider>
    )

    expect(screen.findByText('50 results'))
    expect((await screen.findAllByTestId('element')).length).toBe(pageSize)
  })

  it('should expose flag if fetching more is possible', async () => {
    render(
      <MockedProvider mocks={[noResultsMock]}>
        <TestComponent />
      </MockedProvider>
    )

    expect(screen.findByText('0 results'))

    expect(screen.queryByTestId('btn-fetch-more')).toBeFalsy()
  })

  it('should expose fetching more status', async () => {
    render(
      <MockedProvider mocks={[createPaginationMock(), createPaginationMock(pageSize)]}>
        <TestComponent />
      </MockedProvider>
    )

    expect(await screen.findByText('50 results'))

    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    expect(screen.findByText('Fetching more'))
  })

  it('should expose function to fetch more pages', async () => {
    render(
      <MockedProvider
        cache={createCache()}
        mocks={[createPaginationMock(), createPaginationMock(pageSize), createPaginationMock(pageSize * 2)]}
      >
        <TestComponent />
      </MockedProvider>
    )

    expect(await screen.findByText('50 results'))

    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    expect(await screen.findByText('50 results'))
    expect((await screen.findAllByTestId('element')).length).toBe(pageSize * 2)

    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    expect(await screen.findByText('50 results'))
    expect((await screen.findAllByTestId('element')).length).toBe(totalResults)

    expect(screen.queryByTestId('btn-fetch-more')).toBeFalsy()
  })
})
