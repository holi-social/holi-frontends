import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { Switch } from 'holi-bricks/components/switch/Switch'

describe('Switch', () => {
  it('should render label', () => {
    render(<Switch label="Click me" />)

    expect(screen.getByText('Click me')).toBeOnTheScreen()
  })

  it('should call onPress callback', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<Switch label="Click me" onPress={onPress} />)

    await user.press(screen.getByText('Click me'))

    expect(onPress).toHaveBeenCalled()
  })

  it('should not call onPress callback if disabled', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<Switch label="Click me" onPress={onPress} disabled />)

    await user.press(screen.getByText('Click me'))

    expect(onPress).not.toHaveBeenCalled()
  })
})
