import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text, View } from 'react-native'

import { createCache } from '@holi/api/graphql/client'
import {
  createPaginationMock,
  errorMock,
  noResultsMock,
  pageSize,
  totalResults,
} from '@holi/core/pagination/__tests__/testData'
import usePaginationQuery from '@holi/core/pagination/usePaginationQuery'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.useFakeTimers()

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

    // Fetch second page
    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    expect(await screen.findByText('Fetching more'))
    expect(await screen.findByText('50 results'))
    expect((await screen.findAllByTestId('element')).length).toBe(pageSize * 2)

    // Fetch last page
    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    expect(await screen.findByText('Fetching more'))
    expect(await screen.findByText('50 results'))
    expect((await screen.findAllByTestId('element')).length).toBe(totalResults)

    // It should not be possible to fetch another page
    expect(screen.queryByTestId('btn-fetch-more')).toBeFalsy()
  })
})
