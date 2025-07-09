import React from 'react'
import { VolunteeringFilterModal } from '@holi-apps/volunteering/components/VolunteeringFilterModal'
import { render, screen, userEvent } from '@testing-library/react-native'
import type { VolunteeringFilterKey } from '@holi-apps/volunteering/types'
import { filterTranslationKeyMapping } from '@holi-apps/volunteering/hooks/useVolunteeringFilterOptions'
import { emptyFilters, fullFilters } from '@holi-apps/volunteering/components/__tests__/testData'
import { testLocation } from '@holi/core/screens/onboarding/hooks/__tests__/useUserData.test'
import { usePlacesAutocomplete } from '@holi/core/geolocation/hooks/usePlacesAutocomplete'

const mockUsePlacesAutocomplete = jest.mocked(usePlacesAutocomplete)
jest.mock('@holi/core/geolocation/hooks/usePlacesAutocomplete', () => ({
  usePlacesAutocomplete: jest.fn(),
}))

describe('VolunteeringFilterModal', () => {
  beforeEach(() => {
    jest.useFakeTimers()
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
    const arrayFilterTestData: { filterKey: VolunteeringFilterKey; option: string }[] = [
      {
        filterKey: 'topics',
        option: 'migration-refugees',
      },
      {
        filterKey: 'skills',
        option: 'fundraising',
      },
      {
        filterKey: 'commitmentLabels',
        option: 'recurring',
      },
      {
        filterKey: 'commitmentDurations',
        option: 'DAYS_1',
      },
    ]
    it.each(arrayFilterTestData)('should render title and filter options for $filterKey', ({ filterKey }) => {
      const expectedI18nKey = filterTranslationKeyMapping[filterKey]
      render(
        <VolunteeringFilterModal
          filterKey={filterKey}
          filters={emptyFilters}
          onSubmit={jest.fn()}
          closeModal={jest.fn()}
        />
      )

      expect(screen.getByText(`volunteering.filter.${filterKey}Modal.title`))
      expect(screen.getAllByRole('switch')[0]).toHaveTextContent(expectedI18nKey)
    })

    it.each(arrayFilterTestData)('should not call onSubmit on press of %s option', async ({ filterKey, option }) => {
      const i18nKey = filterTranslationKeyMapping[filterKey]
      const onSubmit = jest.fn()
      const user = userEvent.setup()

      render(
        <VolunteeringFilterModal
          filterKey={filterKey}
          filters={emptyFilters}
          onSubmit={onSubmit}
          closeModal={jest.fn()}
        />
      )

      await user.press(screen.getByText(`${i18nKey}.${option}`))

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it.each(arrayFilterTestData)(
      'should call onSubmit callback with correct payload on save after %s selection change',
      async ({ filterKey, option }) => {
        const i18nKey = filterTranslationKeyMapping[filterKey]
        const onSubmit = jest.fn()
        const user = userEvent.setup()

        render(
          <VolunteeringFilterModal
            filterKey={filterKey}
            filters={emptyFilters}
            onSubmit={onSubmit}
            closeModal={jest.fn()}
          />
        )

        await user.press(screen.getByText(`${i18nKey}.${option}`))
        await user.press(screen.getByText(`volunteering.filter.${filterKey}Modal.saveButton`))

        expect(onSubmit).toHaveBeenCalledWith({
          [filterKey]: [option],
        })
      }
    )
  })

  describe('Location filter', () => {
    it('should render title and selected location for location filter', () => {
      render(
        <VolunteeringFilterModal
          filterKey="location"
          filters={fullFilters}
          onSubmit={jest.fn()}
          closeModal={jest.fn()}
        />
      )

      expect(screen.getByText('volunteering.filter.locationModal.title'))
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
        />
      )

      // Simulate location selection
      mockUsePlacesAutocomplete.mock.calls[0][0].onChange?.(testLocation)

      await user.press(screen.getByText('volunteering.filter.locationModal.saveButton'))

      expect(onSubmit).toHaveBeenCalledWith({
        location: testLocation,
      })
    })
  })

  const allFilters = Object.keys(fullFilters) as VolunteeringFilterKey[]

  it.each(allFilters)('should not call onSubmit when clearing the %s selection', async (filterKey) => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal filterKey={filterKey} filters={fullFilters} onSubmit={onSubmit} closeModal={jest.fn()} />
    )

    await user.press(screen.getByText('search.filter.reset'))

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
        />
      )

      await user.press(screen.getByText('search.filter.reset'))
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
      <VolunteeringFilterModal filterKey="topics" filters={emptyFilters} onSubmit={jest.fn()} closeModal={closeModal} />
    )

    await user.press(screen.getByTestId('btn-to-close-volunteering-filter-modal'))

    expect(closeModal).toHaveBeenCalled()
  })

  it('should not submit selection when modal is dismissed', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal filterKey="topics" filters={emptyFilters} onSubmit={onSubmit} closeModal={jest.fn()} />
    )

    await user.press(screen.getByTestId('btn-to-close-volunteering-filter-modal'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should close modal when save button is pressed', async () => {
    const closeModal = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal filterKey="topics" filters={emptyFilters} onSubmit={jest.fn()} closeModal={closeModal} />
    )

    await user.press(screen.getByText('volunteering.filter.topicsModal.saveButton'))

    expect(closeModal).toHaveBeenCalled()
  })
})
