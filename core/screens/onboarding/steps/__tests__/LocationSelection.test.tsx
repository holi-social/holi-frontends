import React from 'react'

import LocationSelection from '@holi/core/screens/onboarding/steps/LocationSelection'
import { act, render, screen, userEvent, waitFor } from '@testing-library/react-native'
import { geoPlaceDetailsQuery, geoPlacesQuery } from '@holi/core/geolocation/queries'
import { MockedProvider } from '@apollo/client/testing'

const mocks = [
  {
    request: {
      query: geoPlacesQuery,
      variables: {
        text: 'Hamburg, Germany',
        limit: 3,
        level: 'city',
      },
    },
    result: {
      data: {
        geo_placesAutocomplete: [
          {
            id: '1',
            name: 'Hamburg, Germany',
            city: 'Hamburg',
            state: 'Hamburg',
            country: 'Germany',
            coordinates: { latitude: 1, longitude: 2 },
          },
        ],
      },
    },
  },
  {
    request: {
      query: geoPlacesQuery,
      variables: {
        text: 'ha',
        limit: 3,
        level: 'city',
      },
    },
    result: {
      data: {
        geo_placesAutocomplete: [
          {
            id: '1',
            name: 'Hamburg, Germany',
            city: 'Hamburg',
            state: 'Hamburg',
            country: 'Germany',
            coordinates: { latitude: 1, longitude: 2 },
          },
          {
            id: '2',
            name: 'Hannover, Germany',
            city: 'Hannover',
            state: 'Niedersachsen',
            country: 'Germany',
            coordinates: { latitude: 2, longitude: 3 },
          },
        ],
      },
    },
  },
  {
    request: {
      query: geoPlaceDetailsQuery,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        geo_placeDetails: {
          id: '1',
          name: 'Hamburg, Germany',
          geolocation: {
            place_id: '1',
            properties: {
              formatted: 'Hamburg, Germany',
            },
            geometry: {
              type: 'test',
              coordinates: [],
            },
          },
        },
      },
    },
  },
]

describe('LocationSelection', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  const expectedSelection = {
    city: 'Hamburg',
    coordinates: {
      latitude: 1,
      longitude: 2,
    },
    country: 'Germany',
    id: '1',
    label: 'Hamburg, Germany',
    state: 'Hamburg',
    value: 'Hamburg, Germany',
  }

  it('should render texts and input field', () => {
    render(
      <MockedProvider mocks={mocks}>
        <LocationSelection />
      </MockedProvider>
    )

    expect(screen.getByText('onboarding.location.headline')).toBeOnTheScreen()
    expect(screen.getByText('onboarding.location.subline')).toBeOnTheScreen()
    expect(screen.getByRole('combobox')).toBeOnTheScreen()
  })

  it('should query places and render options', async () => {
    const user = userEvent.setup()

    render(
      <MockedProvider mocks={mocks}>
        <LocationSelection />
      </MockedProvider>
    )

    expect(screen.queryAllByRole('menuitem')).toHaveLength(0)

    const input = screen.getByRole('combobox')

    await user.type(input, 'ha')

    await act(async () => {
      // Await fetching places
      await jest.runAllTimersAsync()
      // Re-focus input field to display options
      const interaction = user.paste(input, 'ha')
      await waitFor(() => expect(screen.getAllByRole('menuitem')).toHaveLength(2))
      await interaction
    })
  })

  it('should select option', async () => {
    const onChange = jest.fn()
    const user = userEvent.setup()

    render(
      <MockedProvider mocks={mocks}>
        <LocationSelection onChange={onChange} />
      </MockedProvider>
    )

    const input = screen.getByRole('combobox')

    await user.type(input, 'Hamburg, Germany')

    await act(async () => {
      // Await fetching places
      await jest.runAllTimersAsync()
      // Re-focus input field to display options and submit
      await user.paste(input, 'Hamburg, Germany')
    })

    expect(onChange).toHaveBeenCalledWith(expectedSelection)
  })

  it('should use initial selection', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <LocationSelection selected={expectedSelection} />
      </MockedProvider>
    )

    const input = screen.getByRole('combobox')

    expect(input).toHaveProp('value', 'Hamburg, Germany')
  })
})
