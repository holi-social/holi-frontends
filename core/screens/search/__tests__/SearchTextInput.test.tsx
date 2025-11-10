import React from 'react'
import { SearchTextInput } from '@holi/core/screens/search/SearchTextInput'
import { render, userEvent, screen, act } from '@testing-library/react-native'
import type { SearchFilter } from '@holi/core/screens/search/types'
import { useSearchResults } from '@holi/core/screens/search/hooks/useSearchResults'

const mockUseSearchResults = jest.mocked(useSearchResults)
jest.mock('@holi/core/screens/search/hooks/useSearchResults', () => ({
  useSearchResults: jest.fn(),
}))

describe('SearchTextInput', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  const emptyQueryFilter: SearchFilter = {
    facet: 'volunteering',
    query: '',
  }
  const filter: SearchFilter = {
    facet: 'volunteering',
    query: 'some query',
  }
  const filterWithLocation: SearchFilter = {
    facet: 'volunteering',
    query: 'some query',
    location: { id: '1', label: 'Hamburg, Germany' },
  }

  beforeEach(() => {
    mockUseSearchResults.mockReturnValue({
      isLoading: false,
      searchResults: {
        hits: [],
        totalNrOfPages: 0,
        totalResults: 0,
        canFetchMore: false,
        currentPage: 0,
        parameters: {},
        facetCounts: {},
      },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
  })

  it('should not call callback on query input change', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput filter={emptyQueryFilter} onQueryChange={onQueryChange} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.type(inputField, 'something in my area')

    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it('should call callback on submit', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput filter={emptyQueryFilter} onQueryChange={onQueryChange} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.type(inputField, 'something in my area')
    await user.press(screen.getByLabelText('search.button.label'))
    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).toHaveBeenCalledWith('something in my area')
  })

  it('should call callback on enter', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput filter={emptyQueryFilter} onQueryChange={onQueryChange} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.type(inputField, 'something in my area', { submitEditing: true })

    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).toHaveBeenCalledWith('something in my area')
  })

  it('should prefill input field with initial query', async () => {
    render(<SearchTextInput filter={filter} onQueryChange={jest.fn()} />)

    const inputField = screen.getByLabelText('search.input.label')
    expect(inputField.props.value).toBe('some query')
  })

  it('should not call callback on submit if query is equal to param', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} filter={filter} />)

    await user.press(screen.getByLabelText('search.button.label'))
    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it('should not call callback on submit if query is equal to param', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} filter={filter} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.type(inputField, '', { submitEditing: true })
    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it('should not call callback on submit if filters with new input are empty', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} filter={filter} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.clear(inputField)
    await user.press(screen.getByLabelText('search.button.label'))
    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it('should not call callback on enter if filters with new input are empty', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} filter={filter} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.clear(inputField)
    await user.type(inputField, '', { submitEditing: true })
    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it('should call callback on submit with empty query if location filter is set', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} filter={filterWithLocation} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.clear(inputField)
    await user.press(screen.getByLabelText('search.button.label'))
    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).toHaveBeenCalledWith('')
  })

  it('should call callback on enter with empty query if location filter is set', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} filter={filterWithLocation} />)

    const inputField = screen.getByLabelText('search.input.label')
    await user.clear(inputField)
    await user.type(inputField, '', { submitEditing: true })
    await act(jest.runOnlyPendingTimersAsync)

    expect(onQueryChange).toHaveBeenCalledWith('')
  })

  it('should update input value on param change', () => {
    const { rerender } = render(<SearchTextInput filter={emptyQueryFilter} onQueryChange={jest.fn()} />)

    const inputField = screen.getByLabelText('search.input.label')
    expect(inputField.props.value).toBe('')

    rerender(<SearchTextInput filter={filter} onQueryChange={jest.fn()} />)

    expect(inputField.props.value).toBe('some query')
  })
})
