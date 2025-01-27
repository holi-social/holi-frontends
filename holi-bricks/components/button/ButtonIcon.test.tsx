import { Chat3 } from '@holi/icons/src/generated'
import { render, screen, userEvent } from '@testing-library/react-native'
import { ButtonIcon } from 'holi-bricks/components/button'
import React from 'react'

describe('Button component', () => {
  it('renders correctly with the given text', () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} icon={Chat3} />)
    expect(screen.getByLabelText('Click me')).toBeTruthy()
  })

  it('calls onPress prop when not disabled', async () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} icon={Chat3} />)

    await userEvent.press(screen.getByLabelText('Click me'))

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress prop when disabled', async () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} disabled icon={Chat3} />)

    await userEvent.press(screen.getByLabelText('Click me'))

    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  it('does not call onPress prop when loading', async () => {
    const mockFn = jest.fn()
    render(<ButtonIcon label="Click me" onPress={mockFn} loading icon={Chat3} testID="button-icon" />)
    expect(screen.getByTestId('button-icon-spinner')).toBeOnTheScreen()

    await userEvent.press(screen.getByLabelText('Click me'))

    expect(mockFn).not.toHaveBeenCalled()
  })
})
