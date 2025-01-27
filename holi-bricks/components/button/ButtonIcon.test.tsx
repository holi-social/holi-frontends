import { Chat3 } from '@holi/icons/src/generated'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { ButtonIcon } from 'holi-bricks/components/button'
import React from 'react'

describe('Button component', () => {
  it('renders correctly with the given text', () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} icon={Chat3} />)
    act(() => {
      /* fire events that update state */
      expect(screen.getByLabelText('Click me')).toBeTruthy()
    })
  })

  it('calls onPress prop when not disabled', () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} icon={Chat3} />)
    act(() => {
      /* fire events that update state */
      fireEvent.press(screen.getByLabelText('Click me'))
    })
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress prop when disabled', () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} disabled icon={Chat3} />)
    act(() => {
      /* fire events that update state */
      fireEvent.press(screen.getByLabelText('Click me'))
    })
    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  it('does not call onPress prop when loading', () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} loading icon={Chat3} />)

    expect(screen.getByTestId('spinner')).toBeOnTheScreen()
    act(() => {
      /* fire events that update state */
      fireEvent.press(screen.getByLabelText('Click me'))
    })
    expect(mockFn).not.toHaveBeenCalled()
  })
})
