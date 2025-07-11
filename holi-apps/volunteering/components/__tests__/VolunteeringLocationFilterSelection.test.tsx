import React from 'react'
import { act, render, screen, userEvent } from '@testing-library/react-native'
import { VolunteeringLocationFilterSelection } from '@holi-apps/volunteering/components/VolunteeringLocationFilterSelection'
import { usePlacesAutocomplete } from '@holi/core/geolocation/hooks/usePlacesAutocomplete'
import { testLocation } from '@holi-apps/volunteering/__tests__/testData'

const mockUsePlacesAutocomplete = jest.mocked(usePlacesAutocomplete)
jest.mock('@holi/core/geolocation/hooks/usePlacesAutocomplete', () => ({
  usePlacesAutocomplete: jest.fn(),
}))

const suggestions = [
  {
    ...testLocation,
    value: testLocation.label,
    city: 'Hamburg',
    state: 'Hamburg',
    country: 'Germany',
    coordinates: {
      latitude: 1,
      longitude: 2,
    },
  },
  {
    id: '43',
    label: 'Hannover, Germany',
    value: 'Hannover, Germany',
    city: 'Hannover',
    state: 'Lower Saxony',
    country: 'Germany',
    coordinates: {
      latitude: 2,
      longitude: 3,
    },
  },
]

describe('VolunteeringLocationFilterSelection', () => {
  const mockAutocompleteHook = (value = testLocation.label) => {
    mockUsePlacesAutocomplete.mockReturnValue({
      loading: false,
      error: undefined,
      getSuggestions: jest.fn(),
      placeSuggestions: suggestions,
      value,
      onClose: jest.fn(),
      onBlurHandler: jest.fn(),
      onSubmitHandler: jest.fn(),
      onClear: jest.fn(),
      noResultsText: undefined,
    })
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockAutocompleteHook()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should prefill input field with selected location', () => {
    render(<VolunteeringLocationFilterSelection selected={testLocation} onSelect={jest.fn()} />)

    const inputField = screen.getByLabelText('volunteering.filter.location.label')

    expect(inputField).toHaveProp('value', testLocation.label)
  })

  it('should display placeholder if not location is selected', () => {
    mockAutocompleteHook('')

    render(<VolunteeringLocationFilterSelection selected={undefined} onSelect={jest.fn()} />)

    const inputField = screen.getByLabelText('volunteering.filter.location.label')

    expect(inputField).toHaveProp('placeholder', 'volunteering.filter.location.placeholder')
  })

  it('fetches suggestions for initial selection', () => {
    const onSelect = jest.fn()

    render(<VolunteeringLocationFilterSelection selected={testLocation} onSelect={onSelect} />)

    expect(mockUsePlacesAutocomplete).toHaveBeenCalledWith({
      selected: testLocation,
      onChange: onSelect,
      level: 'city',
    })
  })

  it('displays location suggestions on focus', async () => {
    const user = userEvent.setup()

    render(<VolunteeringLocationFilterSelection selected={testLocation} onSelect={jest.fn()} />)

    const inputField = screen.getByLabelText('volunteering.filter.location.label')

    await act(async () => {
      // Unclear why this is needed for the test
      await jest.runAllTimersAsync()

      // Focus input field to display options
      const interaction = user.paste(inputField, 'Hamburg, Germany')

      expect(screen.getByText('Hamburg, Germany')).toBeOnTheScreen()
      expect(screen.getByText('Hannover, Germany')).toBeOnTheScreen()

      await interaction
    })
  })

  it('should submit selection', async () => {
    const onSelect = jest.fn()

    render(<VolunteeringLocationFilterSelection selected={testLocation} onSelect={onSelect} />)

    // Simulate submit
    mockUsePlacesAutocomplete.mock.calls[0][0].onChange?.(testLocation)

    expect(onSelect).toHaveBeenCalledWith(testLocation)
  })
})
