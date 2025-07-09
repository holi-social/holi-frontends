import React from 'react'
import {
  SearchLocationSelection,
  type SearchLocationSelectionProps,
} from '@holi/core/screens/search/SearchLocationSelection'
import { act, render, screen, userEvent } from '@testing-library/react-native'
import { geoPlacesQuery, type GeoPlacesResponse } from '@holi/core/geolocation/queries'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import type { UserEventInstance } from '@testing-library/react-native/build/user-event/setup'

const mocks: MockedResponse<GeoPlacesResponse>[] = [
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
]

describe('SearchLocationSelection', () => {
  const location = {
    id: '123',
    label: 'Hamburg, Germany',
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  const renderComponent = ({
    currentLocation,
    onLocationChange,
    disabled,
  }: Partial<SearchLocationSelectionProps> = {}) =>
    render(
      <MockedProvider mocks={mocks}>
        <SearchLocationSelection
          currentLocation={currentLocation}
          onLocationChange={onLocationChange ?? jest.fn()}
          disabled={disabled}
        />
      </MockedProvider>
    )

  const selectLocation = async (user: UserEventInstance) => {
    const inputField = screen.getByLabelText('search.location.label')
    await user.paste(inputField, 'Hamburg, Germany')

    await act(async () => {
      // Await fetching places
      await jest.runAllTimersAsync()
      // Re-focus input field to display options and submit
      await user.paste(inputField, 'Hamburg, Germany')
    })
  }

  it('displays label of current location', () => {
    renderComponent({ currentLocation: location })

    expect(screen.getByText('Hamburg, Germany')).toBeTruthy()
  })

  it('displays default label when no location is selected', () => {
    renderComponent()

    expect(screen.getByText('search.location.germanyWide')).toBeTruthy()
  })

  it('displays default label when location search is disabled', () => {
    renderComponent({ currentLocation: location, disabled: true })

    expect(screen.getByText('search.location.germanyWide')).toBeTruthy()
  })

  it('fetches and displays location suggestions', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.press(screen.getByText('search.location.germanyWide'))
    const inputField = screen.getByLabelText('search.location.label')
    await user.type(inputField, 'Hamburg, Germany')
    await act(async () => {
      // Await fetching places
      await jest.runAllTimersAsync()
      // Re-focus input field to display options
      const interaction = user.paste(inputField, 'Hamburg, Germany')

      expect(screen.getByText('Hamburg, Germany')).toBeTruthy()
      expect(screen.getByText('Hannover, Germany')).toBeTruthy()

      await interaction
    })
  })

  it('calls callback with current selected location on save', async () => {
    const user = userEvent.setup()
    const onLocationChange = jest.fn()
    renderComponent({ onLocationChange })

    await user.press(screen.getByText('search.location.germanyWide'))

    await selectLocation(user)

    await user.press(screen.getByText('search.location.save'))

    expect(onLocationChange).toHaveBeenCalledWith({
      id: '1',
      label: 'Hamburg, Germany',
      state: 'Hamburg',
      value: 'Hamburg, Germany',
      city: 'Hamburg',
      coordinates: { latitude: 1, longitude: 2 },
      country: 'Germany',
    })
  })

  it('does not call callback when closing the modal without submit', async () => {
    const user = userEvent.setup()
    const onLocationChange = jest.fn()
    renderComponent({ onLocationChange })

    await user.press(screen.getByText('search.location.germanyWide'))

    await selectLocation(user)

    await user.press(screen.getByLabelText('search.location.closeSelection'))

    expect(onLocationChange).not.toHaveBeenCalled()
  })

  it('prefills input field with initial location', async () => {
    const user = userEvent.setup()
    renderComponent({ currentLocation: location })

    await user.press(screen.getByText('Hamburg, Germany'))
    const inputField = screen.getByLabelText('search.location.label')

    expect(inputField.props.value).toBe('Hamburg, Germany')
  })

  it('clears location selection', async () => {
    const onLocationChange = jest.fn()
    const user = userEvent.setup()
    renderComponent({ currentLocation: location, onLocationChange })

    await user.press(screen.getByText('Hamburg, Germany'))

    const clearButton = screen.getByLabelText('location.placesAutocomplete.clear')
    await user.press(clearButton)

    await user.press(screen.getByText('search.location.save.germanyWide'))

    expect(onLocationChange).toHaveBeenCalledWith(undefined)
  })

  it('should not clear location selection without submit', async () => {
    const onLocationChange = jest.fn()
    const user = userEvent.setup()
    renderComponent({ currentLocation: location, onLocationChange })

    await user.press(screen.getByText('Hamburg, Germany'))

    const clearButton = screen.getByLabelText('location.placesAutocomplete.clear')
    await user.press(clearButton)

    await user.press(screen.getByLabelText('search.location.closeSelection'))

    expect(onLocationChange).not.toHaveBeenCalled()
  })
})
