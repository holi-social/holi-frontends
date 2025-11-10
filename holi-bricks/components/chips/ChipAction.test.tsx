import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { ChipAction } from './ChipAction'

describe('ChipAction', () => {
  it('should render text/children', () => {
    render(<ChipAction onPress={jest.fn()}>Hai</ChipAction>)

    const chip = screen.getByText('Hai')
    expect(chip).toBeOnTheScreen()
  })

  it('should raise press event', () => {
    const mockPressHandler = jest.fn()
    render(<ChipAction onPress={mockPressHandler}>Click me!</ChipAction>)

    fireEvent.press(screen.getByText('Click me!'))

    expect(mockPressHandler).toHaveBeenCalledTimes(1)
  })

  it('should not raise press event and be disabled, when disabled', () => {
    const mockPressHandler = jest.fn()
    render(
      <ChipAction onPress={mockPressHandler} disabled>
        Click me, if you can
      </ChipAction>
    )

    const chip = screen.getByText('Click me, if you can')
    fireEvent.press(chip)

    expect(mockPressHandler).not.toHaveBeenCalled()
    expect(chip).toBeDisabled()
  })
})
