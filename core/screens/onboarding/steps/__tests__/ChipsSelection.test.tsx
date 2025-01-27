import React from 'react'
import { MockedProvider, type MockedProviderProps } from '@apollo/client/testing'
import {
  ChipsSelection,
  type ChipsSelectionProps,
  getSortedAndFilteredTerms,
  type UserChipType,
} from '@holi/core/screens/onboarding/steps/ChipsSelection'
import { render, screen, userEvent } from '@testing-library/react-native'
import { interestsQuery } from '@holi/core/screens/userprofile/queries'
import { sdgsQuery, skillsQuery } from '@holi/core/domain/shared/queries'
import type { DocumentNode } from 'graphql'
import { act } from '@testing-library/react-hooks'
import { useErrorHandling } from '@holi/core/errors/hooks'

const mockUseErrorHandling = useErrorHandling as jest.Mock
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

jest.useFakeTimers()

const terms = [
  { id: 'term-1', slug: 'term-1', title: 'Biodiversity' },
  { id: 'term-2', slug: 'term-2', title: 'Children' },
  { id: 'term-3', slug: 'term-3', title: 'Animal Welfare' },
  { id: 'term-4', slug: 'term-4', title: 'Youth' },
  { id: 'term-5', slug: 'term-5', title: 'Climate Protection' },
]
describe('getSortedAndFilteredTerms', () => {
  it('should sort selected terms to the front', () => {
    const sortedTerms = getSortedAndFilteredTerms(terms, ['term-3', 'term-4'])

    expect(sortedTerms.map((term) => term.id)).toEqual(['term-3', 'term-4', 'term-1', 'term-2', 'term-5'])
  })

  it('should sort selected and unselected terms by title', () => {
    const sortedTerms = getSortedAndFilteredTerms(terms, ['term-4', 'term-5'])

    expect(sortedTerms.map((term) => term.id)).toEqual(['term-5', 'term-4', 'term-3', 'term-1', 'term-2'])
  })

  it('should filter sorted terms', () => {
    const sortedTerms = getSortedAndFilteredTerms(terms, ['term-4', 'term-5'], 'ima')

    expect(sortedTerms.map((term) => term.id)).toEqual(['term-5', 'term-3'])
  })
})

const chipTypes: UserChipType[] = ['interests', 'skills']
const queries: { [key in UserChipType]: DocumentNode } = {
  interests: interestsQuery,
  skills: skillsQuery,
  sdgs: sdgsQuery,
}
describe.each(chipTypes)('ChipsSelection for %s', (chipType) => {
  const displayError = jest.fn()
  const termRequest = {
    request: {
      query: queries[chipType],
    },
    result: {
      data: {
        [chipType]: { data: terms },
      },
    },
  }

  const renderScreen = async (
    props: Partial<ChipsSelectionProps> = {},
    mocks: MockedProviderProps['mocks'] = [termRequest]
  ) => {
    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <ChipsSelection
          chipType={chipType}
          selectedChipIds={[]}
          onSelect={jest.fn()}
          filterString=""
          onFilterStringChange={jest.fn()}
          {...props}
        />
      </MockedProvider>
    )

    await act(async () => {
      await jest.runAllTimersAsync()
    })
  }

  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({ displayError })
  })

  it('should load terms', async () => {
    const loadingPromise = renderScreen()

    expect(screen.getByTestId('user-chip-form-loader')).toBeOnTheScreen()

    await loadingPromise

    expect(screen.queryByTestId('user-chip-form-loader')).not.toBeOnTheScreen()
  })

  it('should display error if loading terms failed', async () => {
    const error = new Error('Test')
    const failedRequest = {
      request: {
        query: queries[chipType],
      },
      error,
    }

    await renderScreen({}, [failedRequest])

    expect(displayError).toHaveBeenCalledWith(error, 'Failed to load terms for user chips', {
      location: 'ChipsSelection',
      field: chipType,
    })
  })

  it('should display headline and sorted terms', async () => {
    const sortedTerms = getSortedAndFilteredTerms(terms, [])

    await renderScreen()

    expect(screen.getByText(`user.${chipType}.form.headline`)).toBeOnTheScreen()

    const chips = screen.getAllByRole('switch')
    expect(chips).toHaveLength(terms.length)
    chips.forEach((chip, index) => expect(chip).toHaveTextContent(sortedTerms[index].title))
  })

  it('should sort selected chips to the front', async () => {
    const selectedChipIds = ['term-3', 'term-4']
    const sortedTerms = getSortedAndFilteredTerms(terms, selectedChipIds)

    await renderScreen({ selectedChipIds })

    const chips = screen.getAllByRole('switch')
    chips.forEach((chip, index) => expect(chip).toHaveTextContent(sortedTerms[index].title))
  })

  it('should display filtered chips', async () => {
    const filterString = 'ima'
    const filteredTerms = getSortedAndFilteredTerms(terms, [], filterString)

    await renderScreen({ filterString })

    const chips = screen.getAllByRole('switch')
    expect(chips).toHaveLength(filteredTerms.length)
    chips.forEach((chip, index) => expect(chip).toHaveTextContent(filteredTerms[index].title))
  })

  it('should call filter callback on input', async () => {
    const onFilterStringChange = jest.fn()
    const user = userEvent.setup()
    const filterString = 'animal'

    await renderScreen({ onFilterStringChange })

    user.paste(screen.getByLabelText(`onboarding.${chipType}.inputPlaceholder`), filterString)

    expect(onFilterStringChange).toHaveBeenCalledWith(filterString)
  })

  it('should call on select on chip selection', async () => {
    const onSelect = jest.fn()
    const user = userEvent.setup()

    await renderScreen({ onSelect })

    await user.press(screen.getByTestId('user-chip-form--term-4-chip'))

    expect(onSelect).toHaveBeenCalledWith('term-4')
  })
})
