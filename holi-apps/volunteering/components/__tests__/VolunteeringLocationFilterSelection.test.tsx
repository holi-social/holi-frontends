import React from 'react'
import { act, render, screen, userEvent } from '@testing-library/react-native'
import { VolunteeringLocationFilterSelection } from '@holi-apps/volunteering/components/VolunteeringLocationFilterSelection'
import { usePlacesAutocomplete } from '@holi/core/geolocation/hooks/usePlacesAutocomplete'
import { testLocation } from '@holi-apps/volunteering/__tests__/testData'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { suggestedLocations } from '@holi-apps/volunteering/helpers/suggestedLocations'

const mockUseUserLanguage = jest.mocked(useUserLanguage)
jest.mock('@holi/core/screens/search/hooks/useUserLanguage', () => ({
  useUserLanguage: jest.fn(),
}))

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
    mockUseUserLanguage.mockReturnValue('de')
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
      // Focus input field to display options
      await user.paste(inputField, 'Hamburg, Germany')
    })
    expect(screen.getByText('Hamburg, Germany')).toBeOnTheScreen()
    expect(screen.getByText('Hannover, Germany')).toBeOnTheScreen()
  })

  it('should submit selection', async () => {
    const onSelect = jest.fn()

    render(<VolunteeringLocationFilterSelection selected={testLocation} onSelect={onSelect} />)

    // Simulate submit
    mockUsePlacesAutocomplete.mock.calls[0][0].onChange?.(testLocation)

    expect(onSelect).toHaveBeenCalledWith(testLocation)
  })

  it('should display suggested locations', () => {
    render(<VolunteeringLocationFilterSelection selected={undefined} onSelect={jest.fn()} />)

    screen.debug()

    expect(screen.getAllByRole('link')).toHaveLength(suggestedLocations.length)
    suggestedLocations.forEach((suggestion) => expect(screen.getByText(suggestion.city!)))
  })

  it('should display suggested locations with english city names', () => {
    mockUseUserLanguage.mockReturnValue('en')

    render(<VolunteeringLocationFilterSelection selected={undefined} onSelect={jest.fn()} />)

    expect(screen.getAllByRole('link')).toHaveLength(suggestedLocations.length)
    suggestedLocations.forEach((suggestion) =>
      expect(screen.getByText(suggestion.overrideEn?.city ?? suggestion.city!))
    )
  })

  it('should select location suggestion on press', async () => {
    const onSelect = jest.fn()
    const user = userEvent.setup()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { overrideEn, ...expectedSuggestion } = suggestedLocations[0]

    render(<VolunteeringLocationFilterSelection selected={undefined} onSelect={onSelect} />)

    await user.press(screen.getByText(expectedSuggestion.city!))

    expect(onSelect).toHaveBeenCalledWith(expectedSuggestion)
  })
})
