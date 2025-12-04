import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { Checkbox } from 'holi-bricks/components/checkbox/Checkbox'

describe('Checkbox', () => {
  it('should render label', () => {
    render(<Checkbox label="Click me" />)

    expect(screen.getByText('Click me')).toBeOnTheScreen()
  })

  it('should call onPress callback', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<Checkbox label="Click me" onPress={onPress} />)

    await user.press(screen.getByText('Click me'))

    expect(onPress).toHaveBeenCalled()
  })

  it('should not call onPress callback if disabled', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<Checkbox label="Click me" onPress={onPress} disabled />)

    await user.press(screen.getByText('Click me'))

    expect(onPress).not.toHaveBeenCalled()
  })
})
