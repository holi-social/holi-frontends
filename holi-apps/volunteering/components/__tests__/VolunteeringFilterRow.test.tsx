import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'

import { VolunteeringFilterRow } from '@holi-apps/volunteering/components/VolunteeringFilterRow'
import { emptyFilters, fullFilters, testLocation } from '@holi-apps/volunteering/__tests__/testData'
import { useFilterFacetCounts } from '@holi-apps/volunteering/hooks/useFilterFacetCounts'
import { usePlacesAutocomplete } from '@holi/core/geolocation/hooks/usePlacesAutocomplete'
import { TrackingEvent } from '@holi/core/tracking'

const mockUsePlacesAutocomplete = jest.mocked(usePlacesAutocomplete)
jest.mock('@holi/core/geolocation/hooks/usePlacesAutocomplete', () => ({
  usePlacesAutocomplete: jest.fn(),
}))

const mockUseFilterFacetCounts = jest.mocked(useFilterFacetCounts)
jest.mock('@holi-apps/volunteering/hooks/useFilterFacetCounts', () => ({
  useFilterFacetCounts: jest.fn(),
}))

const facetCounts = {
  topics_v2: {
    'migration-refugees': 1,
  },
  skills_v2: {
    fundraising: 2,
  },
  commitment_label: {
    recurring: 3,
  },
  commitment_duration: {
    DAYS_1: 4,
  },
}

const results = {
  isLoading: false,
  facetCounts,
}

describe('VolunteeringFilterRow', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUsePlacesAutocomplete.mockReturnValue({
      loading: false,
      error: undefined,
      getSuggestions: jest.fn(),
      placeSuggestions: [{ ...testLocation, value: testLocation.label }],
      value: 'Hamburg, Germany',
      onClose: jest.fn(),
      onBlurHandler: jest.fn(),
      onSubmitHandler: jest.fn(),
      onClear: jest.fn(),
      noResultsText: undefined,
    })
    mockUseFilterFacetCounts.mockReturnValue(results)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should render filter chips in correct order', () => {
    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    const filters = screen.getAllByRole('switch')
    expect(filters[0]).toHaveTextContent(/remote/)
    expect(filters[1]).toHaveTextContent(/location/)
    expect(filters[2]).toHaveTextContent(/topics/)
    expect(filters[3]).toHaveTextContent(/commitmentDurations/)
    expect(filters[4]).toHaveTextContent(/commitmentLabels/)
    expect(filters[5]).toHaveTextContent(/skills/)
  })

  it('should use correct label for unselected filters', () => {
    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    expect(screen.getByText('volunteering.filter.remote.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.location.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.topics.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.commitmentDurations.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.commitmentLabels.label')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.skills.label')).toBeOnTheScreen()
  })

  it('should sort selected filter chips to the front', () => {
    render(
      <VolunteeringFilterRow
        filters={{
          topics: ['migration-refugees'],
          commitmentLabels: ['recurring'],
        }}
        onSubmit={jest.fn()}
        clearFilters={jest.fn()}
      />
    )

    const filters = screen.getAllByRole('switch')
    expect(filters[0]).toHaveTextContent(/topic/)
    expect(filters[1]).toHaveTextContent(/commitment_label/)
    expect(filters[2]).toHaveTextContent(/remote/)
    expect(filters[3]).toHaveTextContent(/location/)
    expect(filters[4]).toHaveTextContent(/commitmentDurations/)
    expect(filters[5]).toHaveTextContent(/skills/)
  })

  it('should use correct label for selected filters', () => {
    render(<VolunteeringFilterRow filters={fullFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    expect(screen.getByText('Hamburg, Germany')).toBeOnTheScreen()
    expect(screen.getByText('topic.migration-refugees + 1')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_duration.DAYS_1')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_label.recurring')).toBeOnTheScreen()
    expect(screen.getByText('skill.food-service + 2')).toBeOnTheScreen()
  })

  it('should not render filter modal if no filter is selected', () => {
    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    expect(screen.queryByTestId('volunteering-filter-modal')).not.toBeOnTheScreen()
  })

  interface FilterTestData {
    filterKey: 'topics' | 'commitmentDurations' | 'commitmentLabels' | 'skills'
    labelText: string
    existingFilterButtonText: string
    expectedValue: string
  }
  const testData: FilterTestData[] = [
    {
      filterKey: 'topics',
      labelText: 'topic.animal-welfare',
      existingFilterButtonText: 'topic.migration-refugees + 1',
      expectedValue: 'animal-welfare',
    },
    {
      filterKey: 'commitmentDurations',
      labelText: 'volunteering.engagement.commitment_duration.MINUTES_10to15',
      existingFilterButtonText: 'volunteering.engagement.commitment_duration.DAYS_1',
      expectedValue: 'MINUTES_10to15',
    },
    {
      filterKey: 'commitmentLabels',
      labelText: 'volunteering.engagement.commitment_label.one-time',
      existingFilterButtonText: 'volunteering.engagement.commitment_label.recurring',
      expectedValue: 'one-time',
    },
    {
      filterKey: 'skills',
      labelText: 'skill.administration',
      existingFilterButtonText: 'skill.food-service + 2',
      expectedValue: 'administration',
    },
  ]
  it.each(testData)('should open modal when selecting $filterKey filter', async ({ filterKey }) => {
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    await user.press(screen.getByText(`volunteering.filter.${filterKey}.label`))

    expect(screen.getByTestId('volunteering-filter-modal')).toBeOnTheScreen()
    expect(screen.getByText(`volunteering.filter.${filterKey}Modal.title`)).toBeOnTheScreen()
  })

  it('should open modal when selecting location filter', async () => {
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    await user.press(screen.getByText('volunteering.filter.location.label'))

    expect(screen.getByTestId('volunteering-filter-modal')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.locationModal.title')).toBeOnTheScreen()
  })

  it.each(testData)('should track press on $filterKey filter pill', async ({ filterKey }) => {
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    await user.press(screen.getByText(`volunteering.filter.${filterKey}.label`))

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Volunteering.filterPillPressed(filterKey))
  })

  it('should track press on location filter pill', async () => {
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    await user.press(screen.getByText('volunteering.filter.location.label'))

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Volunteering.filterPillPressed('location'))
  })

  it.each(testData)('should apply $filterKey filter', async ({ filterKey, labelText, expectedValue }) => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={onSubmit} clearFilters={jest.fn()} />)

    // Open modal
    await user.press(screen.getByText(`volunteering.filter.${filterKey}.label`))
    // Select option
    await user.press(screen.getByText(labelText))
    // Save
    await user.press(screen.getByText(`volunteering.filter.${filterKey}Modal.saveButton`))

    expect(onSubmit).toHaveBeenCalledWith({
      [filterKey]: [expectedValue],
    })
  })

  it.each(testData)(
    'should apply $filterKey selection to existing filter',
    async ({ filterKey, labelText, existingFilterButtonText, expectedValue }) => {
      const onSubmit = jest.fn()
      const user = userEvent.setup()

      render(<VolunteeringFilterRow filters={fullFilters} onSubmit={onSubmit} clearFilters={jest.fn()} />)

      // Open modal
      await user.press(screen.getByText(existingFilterButtonText))
      // Select option
      await user.press(screen.getByText(labelText))
      // Save
      await user.press(screen.getByText(`volunteering.filter.${filterKey}Modal.saveButton`))

      expect(onSubmit).toHaveBeenCalledWith({
        ...fullFilters,
        [filterKey]: [...(fullFilters[filterKey] ?? []), expectedValue],
      })
    }
  )

  it.each(testData)('should close modal after selecting $filterKey filter', async ({ filterKey }) => {
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    // Open modal
    await user.press(screen.getByText(`volunteering.filter.${filterKey}.label`))

    expect(screen.getByTestId('volunteering-filter-modal')).toBeOnTheScreen()

    // Close modal
    await user.press(screen.getByLabelText(`volunteering.filter.${filterKey}Modal.saveButton`))

    expect(screen.queryByTestId('volunteering-filter-modal')).not.toBeOnTheScreen()
  })

  it('should not render button to clear filters if not filtering', () => {
    render(<VolunteeringFilterRow filters={fullFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} />)

    expect(screen.queryByTestId('search.filter.reset.all')).not.toBeOnTheScreen()
  })

  it('should render button to clear filters when filtering', async () => {
    const clearFilters = jest.fn()
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={fullFilters} onSubmit={jest.fn()} clearFilters={clearFilters} isFiltering />)

    await user.press(screen.getByText('search.filter.reset.all'))

    expect(clearFilters).toHaveBeenCalled()
  })

  it('should track clearing all filters', async () => {
    const user = userEvent.setup()

    render(<VolunteeringFilterRow filters={emptyFilters} onSubmit={jest.fn()} clearFilters={jest.fn()} isFiltering />)

    await user.press(screen.getByText('search.filter.reset.all'))

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Volunteering.clearFiltersPressed)
  })
})
