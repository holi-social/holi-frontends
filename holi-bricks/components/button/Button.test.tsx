import { render, screen, userEvent } from '@testing-library/react-native'
import { Button } from 'holi-bricks/components/button'
import React from 'react'

jest.useFakeTimers()

describe('Button component', () => {
  it('renders correctly with the given text', () => {
    const mockFn = jest.fn()
    render(<Button label="Click me" onPress={mockFn} />)

    expect(screen.getByText('Click me')).toBeTruthy()
  })

  it('calls onPress prop when not disabled', async () => {
    const mockFn = jest.fn()
    render(<Button label="Click me" onPress={mockFn} />)

    await userEvent.press(screen.getByText('Click me'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress prop when disabled', async () => {
    const mockFn = jest.fn()
    render(<Button label="Click me" onPress={mockFn} disabled />)

    await userEvent.press(screen.getByText('Click me'))
    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  it('does not call onPress prop when loading', async () => {
    const mockFn = jest.fn()
    render(<Button label="Click me" onPress={mockFn} loading />)

    expect(screen.getByTestId('spinner')).toBeOnTheScreen()

    await userEvent.press(screen.getByText('Click me'))
    expect(mockFn).not.toHaveBeenCalled()
  })
})
