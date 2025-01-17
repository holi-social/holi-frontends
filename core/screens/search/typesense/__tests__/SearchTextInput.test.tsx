import React from 'react'
import { SearchTextInput } from '@holi/core/screens/search/typesense/SearchTextInput'
import { render, userEvent, screen } from '@testing-library/react-native'
import { useSearchBox } from 'react-instantsearch-core'

const mockUseSearchBox = useSearchBox as jest.MockedFunction<typeof useSearchBox>
jest.mock('react-instantsearch-core', () => ({
  useSearchBox: jest.fn(),
}))

describe('SearchTextInput', () => {
  const mockRefine = (query = '') => {
    const refine = jest.fn()
    mockUseSearchBox.mockReturnValue({
      query,
      refine,
      clear: jest.fn(),
      isSearchStalled: false,
    })
    return refine
  }

  it('should refine results on input change', async () => {
    const refine = mockRefine()
    const user = userEvent.setup()

    render(<SearchTextInput />)

    const inputField = screen.getByLabelText('search.typesense.input.label')
    await user.type(inputField, 'something in my area')

    expect(refine).toHaveBeenCalledWith('something in my area')
  })

  it('should clear query input', async () => {
    const refine = mockRefine('some query')
    const user = userEvent.setup()

    render(<SearchTextInput />)

    const clearButton = screen.getByLabelText('search.typesense.input.clear')
    await user.press(clearButton)

    expect(refine).toHaveBeenCalledWith('')
  })

  it('should apply initial query', () => {
    const refine = mockRefine()

    render(<SearchTextInput initialQuery="some query" />)

    expect(refine).toHaveBeenCalledWith('some query')
  })

  it('should call callback on query change', async () => {
    const onQueryChange = jest.fn()
    mockRefine()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} />)

    const inputField = screen.getByLabelText('search.typesense.input.label')
    await user.type(inputField, 'some query')

    expect(onQueryChange).toHaveBeenCalledWith('some query')
  })
})
