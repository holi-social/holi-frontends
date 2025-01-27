import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react-native'
import React from 'react'

import PlacesAutocomplete from '@holi/core/geolocation/components/PlacesAutocomplete'
import { geoPlaceDetailsQuery, geoPlacesQuery } from '@holi/core/geolocation/queries'

jest.useFakeTimers()

const mocks = [
  {
    request: {
      query: geoPlacesQuery,
      variables: {
        text: 'Hamburg, Germany',
        limit: 3,
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
      query: geoPlacesQuery,
      variables: {
        text: 'foo',
        limit: 3,
      },
    },
    result: {
      data: {
        geo_placesAutocomplete: [],
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

describe('PlacesAutocomplete', () => {
  const minimalProps = {
    testID: 'test',
    id: 'test',
    label: 'Test',
    placeholder: 'Test',
  }
  const initialSelection = {
    label: 'Hamburg, Germany',
    id: '',
  }
  const expectedSelectionHamburg = {
    id: '1',
    value: 'Hamburg, Germany',
    label: 'Hamburg, Germany',
    city: 'Hamburg',
    state: 'Hamburg',
    country: 'Germany',
    coordinates: { latitude: 1, longitude: 2 },
  }
  const expectedSelectionHannover = {
    id: '2',
    value: 'Hannover, Germany',
    label: 'Hannover, Germany',
    city: 'Hannover',
    state: 'Niedersachsen',
    country: 'Germany',
    coordinates: { latitude: 2, longitude: 3 },
  }
  const expectedSelectionHamburgWithDetails = {
    ...expectedSelectionHamburg,
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
  }

  it('input is empty without initial selection', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')
    expect(input.props.value).toEqual('')
  })

  it('loads suggestions for initial selection', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} selected={initialSelection} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')
    expect(input.props.value).toEqual(initialSelection.label)

    // Open menu and await fetching
    await act(async () => {
      input.props.onFocus()
      await waitFor(() => screen.getByTestId('test-item-1'))
    })

    // Expect options for initial input
    const option = screen.getByTestId('test-item-1')
    expect(option).toHaveTextContent('Hamburg, Germany')
  })

  it('loads suggestions after typing', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'ha' } })
      // Await results
      await waitFor(() => screen.getByTestId('test-item-1'))
    })

    // Expect options for input
    const option1 = screen.getByTestId('test-item-1')
    expect(option1).toHaveTextContent('Hamburg, Germany')
    const option2 = screen.getByTestId('test-item-2')
    expect(option2).toHaveTextContent('Hannover, Germany')
  })

  it('renders helper text if no results were found', async () => {
    const noResultsText = 'location.placesAutocomplete.noResults'
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'foo' } })
      // Await results
      jest.runAllTimers()
    })

    expect(screen.getByText(noResultsText)).toBeDefined()
  })

  it('renders helper text', async () => {
    const helperText = 'Help me!'
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} helperText={helperText} />
      </MockedProvider>
    )

    expect(screen.getByText(helperText)).toBeDefined()
  })

  it('renders validation error text', async () => {
    const validationErrorText = 'Invalid selection!'
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} validationErrorText={validationErrorText} />
      </MockedProvider>
    )

    expect(screen.getByText(validationErrorText)).toBeDefined()
  })

  it('selects first option when submitting input', async () => {
    const onChange = jest.fn()
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} onChange={onChange} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'ha' } })
      // Await results
      await waitFor(() => screen.getByTestId('test-item-1'))
      // Submit input
      input.props.onSubmitEditing()
    })

    // Expect first option to be selected
    expect(onChange).toHaveBeenCalledWith(expectedSelectionHamburg)
    expect(input.props.value).toEqual('Hamburg, Germany')
  })

  it('clears selection when submitting input without valid options', async () => {
    const onChange = jest.fn()
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} onChange={onChange} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'foo' } })
      // Await results
      jest.runAllTimers()
      // Submit input
      input.props.onSubmitEditing()
    })

    // Expect input and selection to be cleared
    expect(onChange).toHaveBeenCalledWith(undefined)
    expect(input.props.value).toEqual('')
  })

  it('calls onSubmit handler when submitting input', async () => {
    const onChange = jest.fn()
    const onSubmit = jest.fn()
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} onChange={onChange} onSubmit={onSubmit} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'ha' } })
      // Await results
      await waitFor(() => screen.getByTestId('test-item-1'))
      // Submit input
      input.props.onSubmitEditing()
    })

    expect(onSubmit).toHaveBeenCalled()
  })

  it('selects matching option when blurring input', async () => {
    const onChange = jest.fn()
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} onChange={onChange} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'Hamburg, Germany' } })
      // Await results
      await waitFor(() => screen.getByTestId('test-item-1'))
      // Blur input
      input.props.onBlur()
    })

    // Expect matching option to be selected
    expect(onChange).toHaveBeenCalledWith(expectedSelectionHamburg)
    expect(input.props.value).toEqual('Hamburg, Germany')
  })

  it('clears selection when blurring input without matching option', async () => {
    const onChange = jest.fn()
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} onChange={onChange} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'ha' } })
      // Await results
      await waitFor(() => screen.getByTestId('test-item-1'))
      // Blur input
      input.props.onBlur()
    })

    // Expect input and selection to be cleared
    expect(onChange).toHaveBeenCalledWith(undefined)
    expect(input.props.value).toEqual('')
  })

  it('calls onSubmit handler when blurring input', async () => {
    const onChange = jest.fn()
    const onSubmit = jest.fn()
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} onChange={onChange} onSubmit={onSubmit} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'Hamburg, Germany' } })
      // Await results
      await waitFor(() => screen.getByTestId('test-item-1'))
      // Blur input
      input.props.onBlur()
    })

    expect(onSubmit).toHaveBeenCalled()
  })

  it('calls onChange handler when selecting an option', async () => {
    const onChange = jest.fn()
    render(
      <MockedProvider mocks={mocks}>
        <PlacesAutocomplete {...minimalProps} onChange={onChange} />
      </MockedProvider>
    )

    const input = screen.getByTestId('input')

    await act(async () => {
      // Start typing
      input.props.onChange({ nativeEvent: { text: 'ha' } })
      // Await results
      await waitFor(() => screen.getByTestId('test-item-1'))
      // Select option
      fireEvent.press(screen.getByTestId('test-item-2'))
    })

    // Expect second option to be selected
    expect(onChange).toHaveBeenCalledWith(expectedSelectionHannover)
    expect(input.props.value).toEqual('Hannover, Germany')
  })

  describe('enhancing with details', () => {
    it('enhances first option when submitting input', async () => {
      const onChange = jest.fn()
      render(
        <MockedProvider mocks={mocks}>
          <PlacesAutocomplete {...minimalProps} onChange={onChange} enhanceWithDetails />
        </MockedProvider>
      )

      const input = screen.getByTestId('input')

      await act(async () => {
        // Start typing
        input.props.onChange({ nativeEvent: { text: 'ha' } })
        // Await results
        await waitFor(() => screen.getByTestId('test-item-1'))
        // Submit input
        input.props.onSubmitEditing()
        // Await details
        jest.runAllTimers()
      })

      expect(onChange).toHaveBeenCalledWith(expectedSelectionHamburgWithDetails)
    })

    it('enhances matching option when blurring input', async () => {
      const onChange = jest.fn()
      render(
        <MockedProvider mocks={mocks}>
          <PlacesAutocomplete {...minimalProps} onChange={onChange} enhanceWithDetails />
        </MockedProvider>
      )

      const input = screen.getByTestId('input')

      await act(async () => {
        // Start typing
        input.props.onChange({ nativeEvent: { text: 'Hamburg, Germany' } })
        // Await results
        await waitFor(() => screen.getByTestId('test-item-1'))
        // Blur input
        input.props.onBlur()
        // Await details
        jest.runAllTimers()
      })

      expect(onChange).toHaveBeenCalledWith(expectedSelectionHamburgWithDetails)
    })

    it('enhances selected option', async () => {
      const onChange = jest.fn()
      render(
        <MockedProvider mocks={mocks}>
          <PlacesAutocomplete {...minimalProps} onChange={onChange} enhanceWithDetails />
        </MockedProvider>
      )

      const input = screen.getByTestId('input')

      await act(async () => {
        // Start typing
        input.props.onChange({ nativeEvent: { text: 'ha' } })
        // Await results
        await waitFor(() => screen.getByTestId('test-item-1'))
        // Select option
        fireEvent.press(screen.getByTestId('test-item-1'))
        // Await details
        jest.runAllTimers()
      })

      expect(onChange).toHaveBeenCalledWith(expectedSelectionHamburgWithDetails)
    })
  })
})
