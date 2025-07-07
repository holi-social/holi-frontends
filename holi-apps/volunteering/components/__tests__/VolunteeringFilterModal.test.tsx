import React from 'react'
import { VolunteeringFilterModal } from '@holi-apps/volunteering/components/VolunteeringFilterModal'
import { render, screen, userEvent } from '@testing-library/react-native'
import type { VolunteeringFilterKey } from '@holi-apps/volunteering/types'
import { filterTranslationKeyMapping } from '@holi-apps/volunteering/hooks/useVolunteeringFilterOptions'
import { emptyFilters, fullFilters } from '@holi-apps/volunteering/components/__tests__/testData'

describe('VolunteeringFilterModal', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const testData: { filterKey: VolunteeringFilterKey; option: string }[] = [
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
  it.each(testData)('should render title and filter options for $filterKey', ({ filterKey }) => {
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

  it.each(testData)('should not call onSubmit on press of %s option', async ({ filterKey, option }) => {
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

  it.each(testData)(
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

  it.each(testData)('should not call onSubmit when clearing the %s selection', async ({ filterKey }) => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()

    render(
      <VolunteeringFilterModal filterKey={filterKey} filters={fullFilters} onSubmit={onSubmit} closeModal={jest.fn()} />
    )

    await user.press(screen.getByText('search.filter.reset'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it.each(testData)(
    'should call onSubmit callback with correct payload on save after clearing the %s selection',
    async ({ filterKey }) => {
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
