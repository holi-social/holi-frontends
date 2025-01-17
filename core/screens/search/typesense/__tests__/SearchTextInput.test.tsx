import React from 'react'
import { SearchTextInput } from '@holi/core/screens/search/typesense/SearchTextInput'
import { render, userEvent, screen } from '@testing-library/react-native'
import { useSearchBox } from 'react-instantsearch-core'

const mockUseSearchBox = useSearchBox as jest.MockedFunction<typeof useSearchBox>
jest.mock('react-instantsearch-core', () => ({
  useSearchBox: jest.fn(),
}))

describe('SearchTextInput', () => {
  it('should refine results on input change', async () => {
    const refine = jest.fn()
    mockUseSearchBox.mockReturnValue({
      query: '',
      refine,
      clear: jest.fn(),
      isSearchStalled: false,
    })
    const user = userEvent.setup()

    render(<SearchTextInput />)

    const inputField = screen.getByLabelText('search.typesense.input.label')
    await user.type(inputField, 'something in my area')

    expect(refine).toHaveBeenCalledWith('something in my area')
  })

  it('should clear query input', async () => {
    const refine = jest.fn()
    mockUseSearchBox.mockReturnValue({
      query: 'some query',
      refine,
      clear: jest.fn(),
      isSearchStalled: false,
    })
    const user = userEvent.setup()

    render(<SearchTextInput />)

    const clearButton = screen.getByLabelText('search.typesense.input.clear')
    await user.press(clearButton)

    expect(refine).toHaveBeenCalledWith('')
  })
})
