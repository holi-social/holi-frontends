import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { View } from 'react-native'

import { createCache } from '@holi/api/graphql/client'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import {
  createPaginationMock,
  errorMock,
  noResultsMock,
  pageSize,
  totalResults,
} from '@holi/core/pagination/__tests__/testData'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.useFakeTimers()

const TestComponent: React.FC = () => {
  const { loading, error, data, totalResults } = usePaginationContext<Insight>()

  return (
    <View>
      <Text size="md">{loading && 'Loading'}</Text>
      <Text size="md">{error && error.message}</Text>
      <Text size="md">{totalResults} results</Text>
      {data.map((element) =>
        element ? (
          <Text size="md" key={element.id}>
            Element {element.id}
          </Text>
        ) : (
          // eslint-disable-next-line react/jsx-key
          <Text size="md">Erroneous element</Text>
        )
      )}
    </View>
  )
}

const renderPagination = (mocks: MockedResponse[]) =>
  render(
    <MockedProvider mocks={mocks} cache={createCache()}>
      <ToastProvider>
        <Pagination
          query={lastInsightsQuery}
          queryOptions={{
            queryPath: 'lastInsights',
            pageSize,
          }}
        >
          <TestComponent />
        </Pagination>
      </ToastProvider>
    </MockedProvider>
  )

describe('PaginationContext', () => {
  it('provides loading state in pagination context', async () => {
    renderPagination([createPaginationMock()])

    expect(await screen.findByText('Loading'))
  })

  it('provides error state in pagination context', async () => {
    renderPagination([errorMock])
    expect(await screen.findByText('Network error'))
  })

  it('provides total results in pagination context', async () => {
    renderPagination([noResultsMock])

    expect(await screen.findByText('0 results'))
  })

  it('provides data in pagination context', async () => {
    renderPagination([createPaginationMock()])

    expect(await screen.findByText(totalResults + ' results'))
    expect((await screen.findAllByText(/Element/)).length).toBe(pageSize)
  })

  it('does not render button to fetch more if not possible', async () => {
    renderPagination([noResultsMock])

    expect(await screen.findByText('0 results'))
    expect(screen.queryByTestId('btn-fetch-more')).toBeFalsy()
  })

  it('renders button to fetch more if possible', async () => {
    renderPagination([createPaginationMock(), createPaginationMock(pageSize), createPaginationMock(pageSize * 2)])

    expect(await screen.findByText(totalResults + ' results'))

    // Fetch second page
    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    await act(async () => {
      await waitFor(() => screen.getByText('global.loading'))
      await waitForElementToBeRemoved(() => screen.getByText('global.loading'))
      expect(await screen.findByText('global.seeMore'))
      expect((await screen.findAllByText(/Element/)).length).toBe(pageSize * 2)
    })

    // Fetch last page
    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    await act(async () => {
      await waitFor(() => screen.getByText('global.loading'))
      await waitForElementToBeRemoved(() => screen.getByText('global.loading'))
      expect((await screen.findAllByText(/Element/)).length).toBe(totalResults)
    })

    // The button to fetch more should be hidden now
    expect(screen.queryByTestId('btn-fetch-more')).toBeFalsy()
  })
})
