import React, { act } from 'react'
import { VolunteeringFilterModal } from '@holi-apps/volunteering/components/VolunteeringFilterModal'
import { render, screen, userEvent } from '@testing-library/react-native'

import { filterKeyToTranslationKeyMapping } from '@holi-apps/volunteering/helpers/filterFacetData'
import { emptyFilters, fullFilters } from '@holi-apps/volunteering/__tests__/testData'
import { testLocation } from '@holi-apps/volunteering/__tests__/testData'
import type { VolunteeringModalFilterKey } from '@holi-apps/volunteering/types'
import { usePlacesAutocomplete } from '@holi/core/geolocation/hooks/usePlacesAutocomplete'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

const mockTrack = jest.fn()
const mockUseTracking = useTracking as jest.Mock
jest.mock('@holi/core/tracking/hooks/useTracking', () => jest.fn())

const mockUsePlacesAutocomplete = jest.mocked(usePlacesAutocomplete)
jest.mock('@holi/core/geolocation/hooks/usePlacesAutocomplete', () => ({
  usePlacesAutocomplete: jest.fn(),
}))

describe('VolunteeringFilterModal', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockTrack.mockClear()
    mockUseTracking.mockReturnValue({ track: mockTrack })
    mockUsePlacesAutocomplete.mockReturnValue({
      loading: false,
      error: undefined,
      getSuggestions: jest.fn(),
      placeSuggestions: [
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
      ],
      value: testLocation.label,
      onClose: jest.fn(),
      onBlurHandler: jest.fn(),
      onSubmitHandler: jest.fn(),
      onClear: jest.fn(),
      noResultsText: undefined,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Array filters', () => {
    const arrayFilterTestData: {
      filterKey: Exclude<VolunteeringModalFilterKey, 'location'>
      option: string
      facet: string
    }[] = [
      {
        filterKey: 'topics',
        option: 'migration-refugees',
        facet: 'topics_v2',
      },
      {
        filterKey: 'skills',
        option: 'fundraising',
        facet: 'skills_v2',
      },
      {
        filterKey: 'commitmentLabels',
        option: 'recurring',
        facet: 'commitment_label',
      },
      {
        filterKey: 'commitmentDurations',
        option: 'DAYS_1',
        facet: 'commitment_duration',
      },
    ]
    it.each(arrayFilterTestData)('should render title and filter options for $filterKey', ({ filterKey }) => {
      const expectedI18nKey = filterKeyToTranslationKeyMapping[filterKey]
      render(
        <VolunteeringFilterModal
          filterKey={filterKey}
          filters={emptyFilters}
          onSubmit={jest.fn()}
          closeModal={jest.fn()}
          facetCounts={{}}
        />
      )

      expect(screen.getByText(`volunteering.filter.${filterKey}Modal.title`)).toBeOnTheScreen()
      expect(screen.getAllByRole('switch')[0]).toHaveTextContent(expectedI18nKey, { exact: false })
    })

    it.each(arrayFilterTestData)(
      'should render options with facet counts for $filterKey',
      ({ filterKey, option, facet }) => {
        const expectedI18nKey = filterKeyToTranslationKeyMapping[filterKey]
        render(
          <VolunteeringFilterModal
            filterKey={filterKey}
            filters={emptyFilters}
            onSubmit={jest.fn()}
            closeModal={jest.fn()}
            facetCounts={{
              [facet]: {
                [option]: 42,
              },
            }}
          />
        )

        expect(screen.getByText(`volunteering.filter.${filterKey}Modal.title`)).toBeOnTheScreen()
        expect(screen.getByTestId(`${filterKey}--${option}`)).toHaveTextContent(`${expectedI18nKey}.${option}42`)
      }
    )

    it.each(arrayFilterTestData)('should not call onSubmit on press of %s option', async ({ filterKey, option }) => {
      const i18nKey = filterKeyToTranslationKeyMapping[filterKey]
      const onSubmit = jest.fn()
      const user = userEvent.setup()

      render(
        <VolunteeringFilterModal
          filterKey={filterKey}
          filters={emptyFilters}
          onSubmit={onSubmit}
          closeModal={jest.fn()}
          facetCounts={{}}
        />
      )

      await user.press(screen.getByText(`${i18nKey}.${option}`))

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it.each(arrayFilterTestData)(
      'should call onSubmit callback with correct payload on save after %s selection change',
      async ({ filterKey, option }) => {
        const i18nKey = filterKeyToTranslationKeyMapping[filterKey]
        const onSubmit = jest.fn()
        const user = userEvent.setup()

        render(
          <VolunteeringFilterModal
            filterKey={filterKey}
            filters={emptyFilters}
            onSubmit={onSubmit}
            closeModal={jest.fn()}
            facetCounts={{}}
          />
        )

        await user.press(screen.getByText(`${i18nKey}.${option}`))
        await user.press(screen.getByText(`volunteering.filter.${filterKey}Modal.saveButton`))

        expect(onSubmit).toHaveBeenCalledWith({
          [filterKey]: [option],
        })
      }
    )

    it.each(arrayFilterTestData)('should track $filterKey selection on save', async ({ filterKey, option }) => {
      const i18nKey = filterKeyToTranslationKeyMapping[filterKey]
      const user = userEvent.setup()

      render(
        <VolunteeringFilterModal
          filterKey={filterKey}
          filters={emptyFilters}
          onSubmit={jest.fn()}
          closeModal={jest.fn()}
          facetCounts={{}}
        />
      )

      await user.press(screen.getByText(`${i18nKey}.${option}`))
      await user.press(screen.getByText(`volunteering.filter.${filterKey}Modal.saveButton`))

      expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Volunteering.filterSelectionSaved(filterKey, [option]))
    })
  })

  describe('Location filter', () => {
    it('should render title and selected location for location filter', () => {
      render(
        <VolunteeringFilterModal
          filterKey="location"
          filters={fullFilters}
          onSubmit={jest.fn()}
          closeModal={jest.fn()}
          facetCounts={{}}
        />
      )

      expect(screen.getByText('volunteering.filter.locationModal.title')).toBeOnTheScreen()
      expect(screen.getByRole('combobox')).toHaveProp('value', testLocation.label)
    })

    it('should call onSubmit callback with correct payload on save after location selection', async () => {
      const onSubmit = jest.fn()
      const user = userEvent.setup()

      render(
        <VolunteeringFilterModal
          filterKey="location"
          filters={emptyFilters}
          onSubmit={onSubmit}
          closeModal={jest.fn()}
          facetCounts={{}}
        />
      )

      // Simulate location selection
      act(() => {
        mockUsePlacesAutocomplete.mock.calls[0][0].onChange?.(testLocation)
      })

      await user.press(screen.getByText('volunteering.filter.locationModal.saveButton'))

      expect(onSubmit).toHaveBeenCalledWith({
        location: testLocation,
      })
    })

    it('should track location selection on save', async () => {
      const user = userEvent.setup()

      render(
        <VolunteeringFilterModal
          filterKey="location"
          filters={emptyFilters}
          onSubmit={jest.fn()}
          closeModal={jest.fn()}
          facetCounts={{}}
        />
      )

      // Simulate location selection
      mockUsePlacesAutocomplete.mock.calls[0][0].onChange?.(testLocation)

      await user.press(screen.getByText('volunteering.filter.locationModal.saveButton'))

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Volunteering.filterSelectionSaved('location', testLocation.label)
      )
    })
  })

  const allFilters = Object.keys(fullFilters).filter((key) => key !== 'remote') as VolunteeringModalFilterKey[]

  it.each(allFilters)('should not call onSubmit when clearing the %s selection', async (filterKey) => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal
        filterKey={filterKey}
        filters={fullFilters}
        onSubmit={onSubmit}
        closeModal={jest.fn()}
        facetCounts={{}}
      />
    )

    await user.press(screen.getByText('search.filter.reset_one'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it.each(allFilters)(
    'should call onSubmit callback with correct payload on save after clearing the %s selection',
    async (filterKey) => {
      const onSubmit = jest.fn()
      const user = userEvent.setup()

      render(
        <VolunteeringFilterModal
          filterKey={filterKey}
          filters={fullFilters}
          onSubmit={onSubmit}
          closeModal={jest.fn()}
          facetCounts={{}}
        />
      )

      await user.press(screen.getByText('search.filter.reset_one'))
      await user.press(screen.getByText(`volunteering.filter.${filterKey}Modal.saveButton`))

      expect(onSubmit).toHaveBeenCalledWith({
        ...fullFilters,
        [filterKey]: undefined,
      })
    }
  )

  it('should close modal when modal is dismissed', async () => {
    const closeModal = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal
        filterKey="topics"
        filters={emptyFilters}
        onSubmit={jest.fn()}
        closeModal={closeModal}
        facetCounts={{}}
      />
    )

    await user.press(screen.getByTestId('btn-to-close-volunteering-filter-modal'))

    expect(closeModal).toHaveBeenCalled()
  })

  it('should not submit selection when modal is dismissed', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal
        filterKey="topics"
        filters={emptyFilters}
        onSubmit={onSubmit}
        closeModal={jest.fn()}
        facetCounts={{}}
      />
    )

    await user.press(screen.getByTestId('btn-to-close-volunteering-filter-modal'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should close modal when save button is pressed', async () => {
    const closeModal = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal
        filterKey="topics"
        filters={emptyFilters}
        onSubmit={jest.fn()}
        closeModal={closeModal}
        facetCounts={{}}
      />
    )

    await user.press(screen.getByText('volunteering.filter.topicsModal.saveButton'))

    expect(closeModal).toHaveBeenCalled()
  })
})
