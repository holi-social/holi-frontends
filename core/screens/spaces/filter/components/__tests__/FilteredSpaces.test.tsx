import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { geoPlaceDetailsQuery } from '@holi/core/location/queries'
import { locationDetailsMock } from '@holi/core/screens/spaces/__tests__/mocks'
import { createSpaceList, locationId, spaces } from '@holi/core/screens/spaces/__tests__/testData'
import { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import FilteredSpaces from '@holi/core/screens/spaces/filter/components/FilteredSpaces'
import { spacesQuery } from '@holi/core/screens/spaces/queries'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => Date.now())

const createSpacesMock = (variables = {}) => ({
  request: {
    query: spacesQuery,
    variables: {
      ...variables,
      limit: 20,
      offset: 0,
    },
  },
  result: {
    data: {
      spaces: {
        totalResults: 3,
        data: spaces,
        __typename: 'SpacePaged',
      },
    },
  },
})

const spacesMock = createSpacesMock()
const spacesByLocationMock = createSpacesMock({ geolocation: {} })
const topicSlug = 'topic1'
const skillSlugs = ['skill1']

const createSpacesPaginationMock = (offset = 0) => ({
  request: {
    query: spacesQuery,
    variables: {
      limit: 20,
      offset,
    },
  },
  result: {
    data: {
      spaces: {
        totalResults: 100,
        data: createSpaceList(offset + 20).slice(offset),
        __typename: 'SpacePaged',
      },
    },
  },
})

const spacesNoResultsMock = {
  request: {
    query: spacesQuery,
    variables: {
      limit: 20,
      offset: 0,
    },
  },
  result: {
    data: {
      spaces: {
        totalResults: 0,
        data: [],
      },
    },
  },
}

const spacesErrorMock = {
  request: {
    query: spacesQuery,
    variables: {
      limit: 20,
      offset: 0,
    },
  },
  error: new HoliError('Test error'),
}

export const locationDetailsErrorMock = {
  request: {
    query: geoPlaceDetailsQuery,
    variables: {
      id: locationId,
    },
  },
  error: new HoliError('Test error'),
}

describe('FilteredSpaces', () => {
  const renderFilteredSpaces = (mocks: MockedResponse[], filters: SpaceFilter = {}) =>
    render(
      <MockedProvider mocks={mocks} cache={createCache()}>
        <ToastProvider>
          <FilteredSpaces {...filters} applyFilters={() => ({})} />
        </ToastProvider>
      </MockedProvider>
    )

  it('displays loading screen while loading', async () => {
    renderFilteredSpaces([spacesMock])

    expect(await screen.findByText('spaces.spaceListing.loading'))
  })

  it('displays error toast if loading spaces failed', async () => {
    renderFilteredSpaces([spacesErrorMock])

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith(
        'spaces.spaceListing.error',
        HoliToastType.ERROR,
        undefined,
        undefined
      )
    )
  })

  it('displays list of spaces', async () => {
    renderFilteredSpaces([spacesMock])

    expect((await screen.findAllByTestId('filtered-spaces-container')).length).toBeGreaterThan(0)
    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('paginates long lists of spaces', async () => {
    renderFilteredSpaces([createSpacesPaginationMock(), createSpacesPaginationMock(20)])

    // expect 20 spaces
    expect((await screen.findAllByTestId('filtered-spaces-container')).length).toBeGreaterThan(0)
    expect((await screen.findAllByTestId('space-link')).length).toBe(20)

    // load more
    fireEvent.press(await screen.findByText('spaces.spaceListing.loadMoreButton.text'))
    expect(await screen.findByText('spaces.spaceListing.loadMoreButton.loading'))

    // expect 40 spaces
    // TODO: expo-image - enable after fixing
    // expect(await screen.findByText('spaces.spaceListing.loadMoreButton.text'))
    // FIXME: caching seems to work correctly, but the data inside the component are not updated with the new list
    // expect((await screen.findAllByTestId('space-link')).length).toBe(40)
  })

  it('displays no results screen if no spaces were found', async () => {
    renderFilteredSpaces([spacesNoResultsMock])

    expect(await screen.findByText('spaces.filter.notFound.title'))
    expect(await screen.findByTestId('spaces-filter-reset'))
  })

  it('displays loading screen while loading geolocation', async () => {
    renderFilteredSpaces([locationDetailsMock, spacesByLocationMock], { locationId })

    expect(await screen.findByText('spaces.spaceListing.loading'))
  })

  it('displays error toast if loading geolocation failed', async () => {
    renderFilteredSpaces([locationDetailsErrorMock], { locationId })

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith(
        'spaces.spaceListing.error',
        HoliToastType.ERROR,
        undefined,
        undefined
      )
    )
  })

  it('filters spaces by location', async () => {
    renderFilteredSpaces([locationDetailsMock, spacesByLocationMock], { locationId })

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('filters spaces by topic', async () => {
    renderFilteredSpaces([locationDetailsMock, createSpacesMock({ topicSlug })], { topicSlug })

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('filters spaces by skills', async () => {
    renderFilteredSpaces([locationDetailsMock, createSpacesMock({ skillSlugs })], { skillSlugs })

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('filters spaces by multiple filters', async () => {
    renderFilteredSpaces([locationDetailsMock, createSpacesMock({ geolocation: {}, topicSlug, skillSlugs })], {
      locationId,
      topicSlug,
      skillSlugs,
    })

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })
})
