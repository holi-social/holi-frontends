import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { NavigationRouteContext, type Route } from '@react-navigation/native'

import { createCache } from '@holi/api/graphql/client'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'
import { locationDetailsMock } from '@holi/core/screens/spaces/__tests__/mocks'
import { createSpaceList, locationId as location, spaces } from '@holi/core/screens/spaces/__tests__/testData'
import FilteredSpaces, { SPACES_PAGE_SIZE } from '@holi/core/screens/spaces/filter/FilteredSpaces'
import { spacesQuery } from '@holi/core/screens/spaces/filter/queries'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => Date.now())
jest.mock('react-native-keyboard-controller', () => require('react-native-keyboard-controller/jest'))

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const createSpacesMock = (variables = {}) => ({
  request: {
    query: spacesQuery,
    variables: {
      geolocation: undefined,
      topicsV2: [],
      skillsV2: [],
      limit: SPACES_PAGE_SIZE,
      offset: 0,
      ...variables,
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
const topicsV2 = ['human-rights']
const skillsV2 = ['arts-crafts']

const createSpacesPaginationMock = (offset = 0) => ({
  request: {
    query: spacesQuery,
    variables: {
      limit: SPACES_PAGE_SIZE,
      offset,
      geolocation: undefined,
      topicsV2: [],
      skillsV2: [],
    },
  },
  result: {
    data: {
      spaces: {
        totalResults: 100,
        data: createSpaceList(offset + SPACES_PAGE_SIZE).slice(offset),
        __typename: 'SpacePaged',
      },
    },
  },
})

const spacesNoResultsMock = {
  request: {
    query: spacesQuery,
    variables: {
      geolocation: undefined,
      topicsV2: [],
      skillsV2: [],
      limit: SPACES_PAGE_SIZE,
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
      limit: SPACES_PAGE_SIZE,
      offset: 0,
      geolocation: undefined,
      topicsV2: [],
      skillsV2: [],
    },
  },
  error: new HoliError('Test error', 'test-error'),
}

export const locationDetailsErrorMock = {
  request: {
    query: geoPlaceDetailsQuery,
    variables: {
      id: location,
    },
  },
  error: new HoliError('Test error', 'test-error'),
}

describe('FilteredSpaces', () => {
  const renderFilteredSpaces = (
    mocks: MockedResponse[],
    params?: Partial<{ location: string; topic: string[]; skill: string[] }>
  ) =>
    render(
      <NavigationRouteContext.Provider value={{ params } as Route<string>}>
        <MockedProvider mocks={mocks} cache={createCache()}>
          <ToastProvider>
            <FilteredSpaces />
          </ToastProvider>
        </MockedProvider>
      </NavigationRouteContext.Provider>
    )

  it('displays loading screen while loading', async () => {
    renderFilteredSpaces([spacesMock])

    expect(await screen.findByTestId('spaces-grid-cell-skeleton'))
  })

  it('displays error toast if loading spaces failed', async () => {
    renderFilteredSpaces([spacesErrorMock])

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith('spaces.spaceListing.error', HoliToastType.ERROR, {
        testID: 'test-error',
      })
    )
  })

  it('displays list of spaces', async () => {
    renderFilteredSpaces([spacesMock])

    expect((await screen.findAllByTestId('filtered-spaces-container')).length).toBeGreaterThan(0)
    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('paginates long lists of spaces', async () => {
    renderFilteredSpaces([createSpacesPaginationMock(), createSpacesPaginationMock(SPACES_PAGE_SIZE)])

    // expect 12 spaces
    await waitFor(async () =>
      expect((await screen.findAllByTestId('filtered-spaces-container')).length).toBeGreaterThan(0)
    )
    await waitFor(async () => expect((await screen.findAllByTestId('space-link')).length).toBe(SPACES_PAGE_SIZE))

    // load more
    await act(async () => fireEvent.press(await screen.findByText('spaces.spaceListing.loadMoreButton.text')))

    // expect 24 spaces
    await waitFor(async () => expect(await screen.findByText('spaces.spaceListing.loadMoreButton.text')))
    await waitFor(async () => expect((await screen.findAllByTestId('space-link')).length).toBe(2 * SPACES_PAGE_SIZE))
  })

  it('displays no results screen if no spaces were found', async () => {
    renderFilteredSpaces([spacesNoResultsMock])

    expect(await screen.findByText('spaces.filter.notFound.title'))
    expect(await screen.findByTestId('spaces-filter-reset'))
  })

  it('displays loading screen while loading geolocation', async () => {
    renderFilteredSpaces([locationDetailsMock, spacesByLocationMock])

    expect(await screen.findByTestId('spaces-grid-cell-skeleton'))
  })

  it('displays error toast if loading geolocation failed', async () => {
    renderFilteredSpaces([locationDetailsErrorMock, spacesErrorMock], { location })

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith('spaces.spaceListing.error', HoliToastType.ERROR, {
        testID: 'test-error',
      })
    )
  })

  it('filters spaces by location', async () => {
    renderFilteredSpaces([locationDetailsMock, spacesByLocationMock], { location })

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('filters spaces by topic', async () => {
    renderFilteredSpaces([locationDetailsMock, createSpacesMock({ topicsV2 })], { topic: topicsV2 })

    screen.debug()

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('filters spaces by skills', async () => {
    renderFilteredSpaces([locationDetailsMock, createSpacesMock({ skillsV2 })], { skill: skillsV2 })

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })

  it('filters spaces by multiple filters', async () => {
    renderFilteredSpaces([locationDetailsMock, createSpacesMock({ geolocation: {}, topicsV2, skillsV2 })], {
      location,
      topic: topicsV2,
      skill: skillsV2,
    })

    expect((await screen.findAllByTestId('space-link')).length).toBe(spaces.length)
  })
})
