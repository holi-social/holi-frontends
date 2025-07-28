import React from 'react'
import { RadioButton } from 'holi-bricks/components/radioButton/RadioButton'
import { render, screen, userEvent } from '@testing-library/react-native'

describe('RadioButton', () => {
  it('should render label', () => {
    render(<RadioButton label="Click me" />)

    expect(screen.getByText('Click me')).toBeOnTheScreen()
  })

  it('should call onPress callback with true when not selected', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<RadioButton label="Click me" onPress={onPress} />)

    await user.press(screen.getByText('Click me'))

    expect(onPress).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it('should call onPress callback with false when selected', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<RadioButton label="Click me" onPress={onPress} selected />)

    await user.press(screen.getByText('Click me'))

    expect(onPress).toHaveBeenCalledWith(false, expect.any(Object))
  })

  it('should not call onPress callback if disabled', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<RadioButton label="Click me" onPress={onPress} disabled />)

    await user.press(screen.getByText('Click me'))

    expect(onPress).not.toHaveBeenCalled()
  })
})
