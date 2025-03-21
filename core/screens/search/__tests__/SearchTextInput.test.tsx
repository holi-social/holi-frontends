import React from 'react'
import { SearchTextInput } from '@holi/core/screens/search/SearchTextInput'
import { render, userEvent, screen, act } from '@testing-library/react-native'

describe('SearchTextInput', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('should call callback on query change', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput currentQuery="" onQueryChange={onQueryChange} />)

    const inputField = screen.getByLabelText('search.typesense.input.label')
    await user.type(inputField, 'something in my area')

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(onQueryChange).toHaveBeenCalledWith('something in my area')
  })

  it('should prefill input field with initial query', async () => {
    render(<SearchTextInput currentQuery="some query" onQueryChange={jest.fn()} />)

    const inputField = screen.getByLabelText('search.typesense.input.label')
    expect(inputField.props.value).toBe('some query')
  })

  it('should clear query input', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput currentQuery="some query" onQueryChange={onQueryChange} />)

    const clearButton = screen.getByLabelText('search.typesense.input.clear')
    await user.press(clearButton)

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(onQueryChange).toHaveBeenCalledWith('')
  })

  it('should not call callback on query change if query is equal to param', async () => {
    const onQueryChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchTextInput onQueryChange={onQueryChange} currentQuery="some query" />)

    const inputField = screen.getByLabelText('search.typesense.input.label')
    await user.paste(inputField, 'some query')

    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it('should update input value on param change', () => {
    const { rerender } = render(<SearchTextInput currentQuery="" onQueryChange={jest.fn()} />)

    const inputField = screen.getByLabelText('search.typesense.input.label')
    expect(inputField.props.value).toBe('')

    rerender(<SearchTextInput currentQuery="new query" onQueryChange={jest.fn()} />)

    expect(inputField.props.value).toBe('new query')
  })
})
